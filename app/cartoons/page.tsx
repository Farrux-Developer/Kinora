import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { parseFilters, type RawSearchParams } from "@/lib/catalog-params";
import { discoverTitles } from "@/lib/tmdb/client";

const ANIMATION_GENRE_ID = 16;

export const metadata: Metadata = {
  title: "Мультфильмы",
  description: "Анимационные фильмы: от классики до свежих премьер.",
};

export default async function CartoonsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseFilters(await searchParams);

  return (
    <CatalogPage
      basePath="/cartoons"
      title="Мультфильмы"
      description="Анимация для всей семьи: подберите мультфильм по году и рейтингу."
      filters={filters}
      itemsPromise={discoverTitles("movie", { ...filters, genreId: ANIMATION_GENRE_ID })}
    />
  );
}
