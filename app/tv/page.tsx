import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { parseFilters, type RawSearchParams } from "@/lib/catalog-params";
import { discoverTitles, getGenres } from "@/lib/tmdb/client";

export const metadata: Metadata = {
  title: "Сериалы",
  description: "Каталог сериалов: фильтры по жанру, году и рейтингу.",
};

export default async function TvPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseFilters(await searchParams);

  return (
    <CatalogPage
      basePath="/tv"
      title="Сериалы"
      description="Новинки эфира и культовая классика — с сезонами и сериями."
      filters={filters}
      itemsPromise={discoverTitles("tv", filters)}
      genresPromise={getGenres("tv")}
    />
  );
}
