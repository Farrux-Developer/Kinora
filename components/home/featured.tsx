import Image from "next/image";
import Link from "next/link";
import { RatingBadge } from "@/components/ui/rating-badge";
import { Reveal } from "@/components/ui/reveal";
import { TrailerButton } from "@/components/ui/trailer-button";
import { backdropUrl } from "@/lib/tmdb/image";
import { getFeatured, safe } from "@/lib/tmdb/client";

/** Featured movie of the week — dark navy section under the hero. */
export async function FeaturedSection() {
  const featured = await safe(getFeatured());
  if (!featured) return null;

  const backdrop = backdropUrl(featured.backdropPath, "w1280");

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.14em] text-mist-dark uppercase">
            Фильм недели
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            {featured.title}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-mist-dark">
            <RatingBadge value={featured.voteAverage} onDark />
            {featured.year && <span>{featured.year}</span>}
            {featured.genres.slice(0, 3).map((genre) => (
              <span key={genre.id} className="rounded-md border border-line-dark px-2 py-0.5 text-xs">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="mt-5 line-clamp-4 max-w-prose text-sm leading-relaxed text-mist-dark sm:text-base">
            {featured.overview}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <TrailerButton trailerKey={featured.trailerKey} />
            <Link
              href={`/movie/${featured.id}`}
              className="inline-flex items-center rounded-md border border-line-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Подробнее
            </Link>
          </div>
        </Reveal>

        {backdrop && (
          <Reveal delay={0.12}>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-line-dark">
              <Image
                src={backdrop}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                priority
                className="object-cover"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
