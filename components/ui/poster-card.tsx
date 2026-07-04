import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/lib/tmdb/types";
import { posterUrl } from "@/lib/tmdb/image";
import { RatingBadge } from "./rating-badge";

export function titleHref(item: Pick<MediaItem, "id" | "mediaType">) {
  return `/${item.mediaType}/${item.id}`;
}

/**
 * Poster card with a hover overlay (title, rating, year). Pure CSS hover —
 * renders on the server. `onDark` switches the border for navy sections.
 */
export function PosterCard({
  item,
  onDark = false,
  sizes = "(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 180px",
  priority = false,
}: {
  item: MediaItem;
  onDark?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  const poster = posterUrl(item.posterPath, "w342");

  return (
    <Link
      href={titleHref(item)}
      className={`group block overflow-hidden rounded-lg border transition-colors duration-200 ${
        onDark ? "border-line-dark hover:border-mist-dark" : "border-line hover:border-mist-2"
      }`}
    >
      <div className={`relative aspect-2/3 overflow-hidden ${onDark ? "bg-ink-2" : "bg-paper"}`}>
        {poster ? (
          <Image
            src={poster}
            alt={item.title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <PosterPlaceholder title={item.title} onDark={onDark} />
        )}

        <div
          className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden
        >
          <p className="line-clamp-2 text-sm font-semibold text-white">{item.title}</p>
          <div className="mt-1 flex items-center gap-2">
            <RatingBadge value={item.voteAverage} onDark />
            {item.year && <span className="text-xs text-mist-dark">{item.year}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PosterPlaceholder({
  title,
  onDark = false,
}: {
  title: string;
  onDark?: boolean;
}) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center ${
        onDark ? "text-mist-dark" : "text-mist-2"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-8 stroke-current" fill="none" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18M7 5v14M17 5v14" />
      </svg>
      <span className="line-clamp-3 text-xs font-medium">{title}</span>
    </div>
  );
}
