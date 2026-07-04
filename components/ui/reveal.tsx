"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-reveal wrapper: fade + 12px rise over 0.6s when the element enters
 * the viewport. `delay` staggers siblings (60ms per card).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.6, ease: EASE_OUT_SOFT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger helper: caps the delay so long grids don't wait forever. */
export function staggerDelay(index: number, step = 0.06, max = 0.42) {
  return Math.min(index * step, max);
}
