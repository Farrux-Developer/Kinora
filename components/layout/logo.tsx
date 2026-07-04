import Link from "next/link";

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-lg font-semibold tracking-tighter ${
        onDark ? "text-white" : "text-fg"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" className="stroke-accent" strokeWidth="1.8" />
        <path d="M9.5 9l5 3-5 3V9z" className="fill-accent" />
      </svg>
      Kinora
    </Link>
  );
}
