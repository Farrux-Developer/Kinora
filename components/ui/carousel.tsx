"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/**
 * Horizontal carousel: snap scrolling, mouse drag, edge arrows that appear on
 * hover. Items are server-rendered and passed as children.
 */
export function Carousel({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScroll({
      left: track.scrollLeft > 8,
      right: track.scrollLeft < track.scrollWidth - track.clientWidth - 8,
    });
  }, []);

  useEffect(() => {
    updateArrows();
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateArrows]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  const onPointerDown = (event: ReactPointerEvent) => {
    const track = trackRef.current;
    if (!track || event.pointerType !== "mouse") return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 6) {
      drag.current.moved = true;
      track.setPointerCapture(event.pointerId);
    }
    if (drag.current.moved) {
      track.scrollLeft = drag.current.startScroll - delta;
    }
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  // Suppress the click that follows a drag so cards don't navigate.
  const onClickCapture = (event: React.MouseEvent) => {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    }
  };

  const arrowClass = `absolute top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-md border p-2 opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100 focus-visible:opacity-100 md:flex disabled:hidden ${
    onDark
      ? "border-line-dark bg-ink text-white hover:bg-ink-2"
      : "border-line bg-surface text-fg hover:bg-paper"
  }`;

  return (
    <div className="group/carousel relative">
      <button
        type="button"
        aria-label="Прокрутить влево"
        className={`${arrowClass} -left-3`}
        onClick={() => scrollByPage(-1)}
        disabled={!canScroll.left}
      >
        <ArrowIcon direction="left" />
      </button>

      <div
        ref={trackRef}
        onScroll={updateArrows}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="no-scrollbar flex snap-x snap-proximity gap-4 overflow-x-auto scroll-smooth pb-1 select-none"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Прокрутить вправо"
        className={`${arrowClass} -right-3`}
        onClick={() => scrollByPage(1)}
        disabled={!canScroll.right}
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-5 stroke-current ${direction === "left" ? "rotate-180" : ""}`}
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/** Fixed-width snap item for poster carousels. */
export function CarouselItem({ children }: { children: ReactNode }) {
  return <div className="w-36 shrink-0 snap-start sm:w-44">{children}</div>;
}
