/**
 * Static CSS dot-grid backdrop for the hero. Replaced at the polish stage by
 * the interactive 3D scene (this stays as its reduced-motion / SSR fallback).
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
      }}
    />
  );
}
