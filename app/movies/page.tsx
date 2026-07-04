import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { parseFilters, type RawSearchParams } from "@/lib/catalog-params";
import { discoverTitles, getGenres } from "@/lib/tmdb/client";

export const metadata: Metadata = {
  title: "Фильмы",
  description: "Каталог фильмов: фильтры по жанру, году и рейтингу.",
};

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseFilters(await searchParams);

  return (
    <CatalogPage
      basePath="/movies"
      title="Фильмы"
      description="Подберите фильм по жанру, году выхода и рейтингу."
      filters={filters}
      itemsPromise={discoverTitles("movie", filters)}
      genresPromise={getGenres("movie")}
    />
  );
}
