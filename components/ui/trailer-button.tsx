"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { youtubeEmbedUrl } from "@/lib/tmdb/image";

/**
 * "Watch trailer" button + fullscreen modal with an embedded YouTube player.
 * Renders nothing when the title has no trailer.
 */
export function TrailerButton({
  trailerKey,
  variant = "primary",
}: {
  trailerKey: string | null;
  variant?: "primary" | "onDark";
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!trailerKey) return null;

  const buttonClass =
    variant === "primary"
      ? "bg-accent text-white hover:bg-accent/90"
      : "border border-line-dark bg-white/5 text-white hover:bg-white/10";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${buttonClass}`}
      >
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M8 5.5v13l11-6.5-11-6.5z" />
        </svg>
        Смотреть трейлер
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Трейлер"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-4xl overflow-hidden rounded-lg border border-line-dark bg-ink"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-end border-b border-line-dark px-3 py-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть"
                  className="rounded-md p-1.5 text-mist-dark transition-colors hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="size-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={`${youtubeEmbedUrl(trailerKey)}&autoplay=1`}
                  title="Трейлер"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
