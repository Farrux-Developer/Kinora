import Image from "next/image";
import Link from "next/link";
import { PosterPlaceholder } from "@/components/ui/poster-card";
import { RatingBadge } from "@/components/ui/rating-badge";
import { posterUrl } from "@/lib/tmdb/image";
import { removeListItem } from "@/server/actions/lists";

export interface LibraryItem {
  id: string;
  mediaType: "movie" | "tv";
  tmdbId: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseYear: number | null;
}

export function LibraryCard({ item }: { item: LibraryItem }) {
  const poster = posterUrl(item.posterPath, "w342");
  const removeWithId = removeListItem.bind(null, item.id);

  return (
    <div className="group relative">
      <Link
        href={`/${item.mediaType}/${item.tmdbId}`}
        className="block overflow-hidden rounded-lg border border-line transition-colors duration-200 hover:border-mist-2"
      >
        <div className="relative aspect-2/3 bg-paper">
          {poster ? (
            <Image
              src={poster}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
              className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <PosterPlaceholder title={item.title} />
          )}
        </div>
      </Link>

      <form action={removeWithId} className="absolute top-2 right-2">
        <button
          type="submit"
          aria-label={`Удалить «${item.title}» из списка`}
          title="Удалить из списка"
          className="flex items-center justify-center rounded-md border border-line bg-white/95 p-1.5 text-mist opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="size-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </form>

      <div className="mt-2">
        <p className="line-clamp-1 text-sm font-medium text-ink">{item.title}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-mist">
          <RatingBadge value={item.voteAverage} className="!text-xs" />
          {item.releaseYear && <span>{item.releaseYear}</span>}
          <span>{item.mediaType === "movie" ? "Фильм" : "Сериал"}</span>
        </div>
      </div>
    </div>
  );
}
