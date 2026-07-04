import Link from "next/link";

/** Server-rendered pagination: prev/next + a window of numbered pages. */
export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const windowStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => windowStart + i);

  const itemClass =
    "flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors";
  const idleClass = "border-line text-fg hover:border-mist-2";
  const activeClass = "border-accent bg-accent text-white";
  const disabledClass = "pointer-events-none border-line text-mist-2";

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Пагинация">
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={page <= 1}
        className={`${itemClass} ${page <= 1 ? disabledClass : idleClass}`}
      >
        ←
      </Link>

      {pages.map((number) => (
        <Link
          key={number}
          href={hrefFor(number)}
          aria-current={number === page ? "page" : undefined}
          className={`${itemClass} ${number === page ? activeClass : idleClass}`}
        >
          {number}
        </Link>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          <span className="px-1 text-sm text-mist">…</span>
          <Link href={hrefFor(totalPages)} className={`${itemClass} ${idleClass}`}>
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={hrefFor(page + 1)}
        aria-disabled={page >= totalPages}
        className={`${itemClass} ${page >= totalPages ? disabledClass : idleClass}`}
      >
        →
      </Link>
    </nav>
  );
}
