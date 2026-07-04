import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { parseFilters, type RawSearchParams } from "@/lib/catalog-params";
import { discoverAnime } from "@/lib/tmdb/client";

export const metadata: Metadata = {
  title: "Аниме",
  description: "Аниме-сериалы: от классики Гибли до свежих сезонов.",
};

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseFilters(await searchParams);

  return (
    <CatalogPage
      basePath="/anime"
      title="Аниме"
      description="Японская анимация: сериалы с рейтингами, трейлерами и списками серий."
      filters={filters}
      itemsPromise={discoverAnime(filters)}
    />
  );
}
