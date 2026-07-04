function ratingTone(value: number, onDark: boolean) {
  if (onDark) return value >= 7 ? "text-white" : "text-mist-dark";
  return value >= 7 ? "text-ink" : "text-mist";
}

export function RatingBadge({
  value,
  onDark = false,
  className = "",
}: {
  value: number;
  onDark?: boolean;
  className?: string;
}) {
  if (!value) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${ratingTone(value, onDark)} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden>
        <path d="M12 2l2.9 6.26 6.6.7-4.9 4.5 1.35 6.54L12 16.77 6.05 20l1.35-6.54-4.9-4.5 6.6-.7L12 2z" />
      </svg>
      {value.toFixed(1)}
    </span>
  );
}
