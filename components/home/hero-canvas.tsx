"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { HeroBackdrop } from "./hero-backdrop";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => <HeroBackdrop />,
});

const QUERIES = ["(prefers-reduced-motion: reduce)", "(max-width: 768px)"] as const;

function subscribe(onChange: () => void) {
  const lists = QUERIES.map((query) => window.matchMedia(query));
  for (const list of lists) list.addEventListener("change", onChange);
  return () => {
    for (const list of lists) list.removeEventListener("change", onChange);
  };
}

function getMode(): "static" | "compact" | "full" {
  if (window.matchMedia(QUERIES[0]).matches) return "static";
  return window.matchMedia(QUERIES[1]).matches ? "compact" : "full";
}

/**
 * Mounts the 3D scene on capable clients; falls back to the static CSS
 * dot grid with prefers-reduced-motion and on the server. On small
 * screens the scene is simplified (fewer points, no frames, dpr 1).
 */
export function HeroCanvas() {
  const mode = useSyncExternalStore(subscribe, getMode, () => "static" as const);

  if (mode === "static") return <HeroBackdrop />;

  return (
    <div className="absolute inset-0" aria-hidden>
      <HeroScene compact={mode === "compact"} />
    </div>
  );
}
