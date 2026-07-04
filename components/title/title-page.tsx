import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { PosterCard, PosterPlaceholder } from "@/components/ui/poster-card";
import { RatingBadge } from "@/components/ui/rating-badge";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/components/ui/stagger";
import { SectionHeading } from "@/components/ui/section";
import { TrailerButton } from "@/components/ui/trailer-button";
import { backdropUrl, posterUrl } from "@/lib/tmdb/image";
import type { TitleDetails } from "@/lib/tmdb/types";
import { CastCarousel } from "./cast-carousel";
import { ListActions } from "./list-actions";
import { Seasons } from "./seasons";
import { WatchProvidersBlock } from "./watch-providers";

function formatRuntime(minutes: number | null, isTv: boolean): string | null {
  if (!minutes) return null;
  if (isTv) return `~${minutes} мин/серия`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours} ч ${rest} мин` : `${rest} мин`;
}

/** Detail page for a movie or TV show — dark navy so the poster stands out. */
export function TitlePage({ details }: { details: TitleDetails }) {
  const isTv = details.mediaType === "tv";
  const backdrop = backdropUrl(details.backdropPath, "w1280");
  const poster = posterUrl(details.posterPath, "w500");
  const runtime = formatRuntime(details.runtime, isTv);

  return (
    <article className="bg-ink text-white">
      {/* Backdrop */}
      <div className="relative h-[42vh] min-h-72 w-full sm:h-[52vh]">
        {backdrop ? (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="h-full w-full bg-ink-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      </div>

      {/* Poster + info */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="relative z-10 -mt-36 flex flex-col gap-8 sm:-mt-44 md:flex-row">
          <Reveal className="w-40 shrink-0 sm:w-56">
            <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-line-dark bg-ink-2">
              {poster ? (
                <Image
                  src={poster}
                  alt={details.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 160px, 224px"
                  className="object-cover"
                />
              ) : (
                <PosterPlaceholder title={details.title} onDark />
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="max-w-2xl md:pt-24">
            <h1 className="text-3xl font-semibold tracking-tighter text-balance sm:text-5xl">
              {details.title}
            </h1>
            {details.tagline && (
              <p className="mt-2 text-sm text-mist-dark sm:text-base">{details.tagline}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-mist-dark">
              <RatingBadge value={details.voteAverage} onDark />
              {details.year && <span>{details.year}</span>}
              {runtime && <span>{runtime}</span>}
              {isTv && details.numberOfSeasons > 0 && (
                <span>
                  {details.numberOfSeasons} сезон{details.numberOfSeasons === 1 ? "" : details.numberOfSeasons < 5 ? "а" : "ов"}
                </span>
              )}
              {details.voteCount > 0 && (
                <span>{details.voteCount.toLocaleString("ru-RU")} оценок</span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {details.genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/${isTv ? "tv" : "movies"}?genre=${genre.id}`}
                  className="rounded-md border border-line-dark px-2.5 py-1 text-xs font-medium text-mist-dark transition-colors hover:border-mist-dark hover:text-white"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            {details.overview && (
              <p className="mt-6 text-sm leading-relaxed text-white/85 sm:text-base">
                {details.overview}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {details.watchProviders && (
                <a
                  href={details.watchProviders.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
                >
                  <svg viewBox="0 0 24 24" className="size-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                    <path d="M10 9l5 3-5 3V9z" className="fill-current" />
                  </svg>
                  Смотреть онлайн
                </a>
              )}
              <TrailerButton
                trailerKey={details.trailerKey}
                variant={details.watchProviders ? "onDark" : "primary"}
              />
              <Suspense fallback={null}>
                <ListActions item={details} />
              </Suspense>
            </div>
          </Reveal>
        </div>

        {/* Legal watch options */}
        <Reveal>
          <WatchProvidersBlock providers={details.watchProviders} />
        </Reveal>

        {/* Cast */}
        <div className="mt-16">
          <CastCarousel cast={details.cast} />
        </div>

        {/* Seasons (TV only) */}
        {isTv && details.seasons.length > 0 && (
          <div className="mt-16">
            <Seasons tvId={details.id} seasons={details.seasons} />
          </div>
        )}

        {/* Similar titles */}
        {details.similar.length > 0 && (
          <div className="mt-16 pb-20">
            <SectionHeading title="Похожие тайтлы" onDark />
            <Carousel onDark>
              {details.similar
                .filter((item) => item.posterPath)
                .map((item, index) => (
                  <CarouselItem key={item.id}>
                    <Reveal delay={staggerDelay(index)}>
                      <PosterCard item={item} onDark />
                    </Reveal>
                  </CarouselItem>
                ))}
            </Carousel>
          </div>
        )}
        {!details.similar.length && <div className="pb-20" />}
      </div>
    </article>
  );
}
