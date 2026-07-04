import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Page section. White by default; `tone="dark"` renders the navy variant —
 * sections alternate down the page.
 */
export function Section({
  tone = "light",
  className = "",
  children,
}: {
  tone?: "light" | "dark" | "paper";
  className?: string;
  children: ReactNode;
}) {
  const tones = {
    light: "bg-white text-ink",
    paper: "bg-paper text-ink",
    dark: "bg-ink text-white",
  };
  return (
    <section className={`${tones[tone]} ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  href,
  onDark = false,
}: {
  title: string;
  href?: string;
  onDark?: boolean;
}) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {href && (
        <Link
          href={href}
          className={`shrink-0 text-sm font-medium transition-colors ${
            onDark ? "text-mist-dark hover:text-white" : "text-mist hover:text-ink"
          }`}
        >
          Смотреть все →
        </Link>
      )}
    </div>
  );
}
