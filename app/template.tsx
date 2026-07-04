"use client";

import { motion, useReducedMotion } from "motion/react";

/** Soft cross-page transition: content fades in on navigation. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
