import { Suspense } from "react";
import { FeaturedSection } from "@/components/home/featured";
import { Hero } from "@/components/home/hero";
import { MediaRow } from "@/components/home/media-row";
import { TmdbSetupNotice } from "@/components/tmdb-notice";
import { Section } from "@/components/ui/section";
import { CarouselSkeleton, SectionTitleSkeleton } from "@/components/ui/skeletons";
import {
  discoverTitles,
  getCartoonMovies,
  getOnTheAirTv,
  getPopularMovies,
  getTrending,
  isTmdbConfigured,
} from "@/lib/tmdb/client";

const COMEDY_GENRE_ID = 35;
const SCIFI_GENRE_ID = 878;

function RowFallback({ onDark = false }: { onDark?: boolean }) {
  return (
    <div>
      <SectionTitleSkeleton onDark={onDark} />
      <CarouselSkeleton onDark={onDark} />
    </div>
  );
}

export default function HomePage() {
  if (!isTmdbConfigured()) {
    return (
      <>
        <Hero />
        <Section>
          <TmdbSetupNotice />
        </Section>
      </>
    );
  }

  return (
    <>
      <Hero />

      <FeaturedSection />

      <Section>
        <Suspense fallback={<RowFallback />}>
          <MediaRow title="В тренде" href="/movies" itemsPromise={getTrending("all")} />
        </Suspense>
        <div className="mt-14">
          <Suspense fallback={<RowFallback />}>
            <MediaRow title="Популярное" href="/movies" itemsPromise={getPopularMovies()} />
          </Suspense>
        </div>
      </Section>

      <Section tone="dark">
        <Suspense fallback={<RowFallback onDark />}>
          <MediaRow title="Мультфильмы" href="/cartoons" itemsPromise={getCartoonMovies()} onDark />
        </Suspense>
      </Section>

      <Section>
        <Suspense fallback={<RowFallback />}>
          <MediaRow title="Новинки сериалов" href="/tv" itemsPromise={getOnTheAirTv()} />
        </Suspense>
        <div className="mt-14">
          <Suspense fallback={<RowFallback />}>
            <MediaRow
              title="Комедии"
              href={`/movies?genre=${COMEDY_GENRE_ID}`}
              itemsPromise={discoverTitles("movie", { genreId: COMEDY_GENRE_ID })}
            />
          </Suspense>
        </div>
        <div className="mt-14">
          <Suspense fallback={<RowFallback />}>
            <MediaRow
              title="Фантастика"
              href={`/movies?genre=${SCIFI_GENRE_ID}`}
              itemsPromise={discoverTitles("movie", { genreId: SCIFI_GENRE_ID })}
            />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
