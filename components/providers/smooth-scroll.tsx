"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Site-wide inertial smooth scrolling. Skipped with prefers-reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
