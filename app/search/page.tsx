import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterBar } from "@/components/catalog/filter-bar";
import { MediaGrid } from "@/components/catalog/media-grid";
import { Pagination } from "@/components/catalog/pagination";
import { SearchInput } from "@/components/search/search-input";
import { TmdbSetupNotice } from "@/components/tmdb-notice";
import { Section } from "@/components/ui/section";
import { catalogHref, parseFilters, type RawSearchParams } from "@/lib/catalog-params";
import { discoverTitles, getGenres, isTmdbConfigured, safe, searchTitles } from "@/lib/tmdb/client";
import type { DiscoverFilters, MediaItem, Paginated, TmdbGenre } from "@/lib/tmdb/types";

export const metadata: Metadata = {
  title: "Поиск",
  description: "Поиск по фильмам, сериалам и аниме с фильтрами.",
};

/**
 * TMDB's search endpoint has no filter params, so genre/year/rating/sort are
 * applied to the returned page of results. Without a query the page falls
 * back to filtered discover.
 */
function applyFilters(page: Paginated<MediaItem>, filters: DiscoverFilters): Paginated<MediaItem> {
  let results = page.results;
  if (filters.genreId) results = results.filter((item) => item.genreIds.includes(filters.genreId!));
  if (filters.year) results = results.filter((item) => item.year === filters.year);
  if (filters.minRating) results = results.filter((item) => item.voteAverage >= filters.minRating!);
  if (filters.sortBy === "vote_average.desc") {
    results = [...results].sort((a, b) => b.voteAverage - a.voteAverage);
  } else if (filters.sortBy === "primary_release_date.desc") {
    results = [...results].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }
  return { ...page, results };
}

async function mergedGenres(): Promise<TmdbGenre[]> {
  const [movie, tv] = await Promise.all([getGenres("movie"), getGenres("tv")]);
  const byId = new Map<number, TmdbGenre>();
  for (const genre of [...movie, ...tv]) byId.set(genre.id, genre);
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";
  const filters = parseFilters(params);

  if (!isTmdbConfigured()) {
    return (
      <Section>
        <TmdbSetupNotice />
      </Section>
    );
  }

  const [rawPage, genres] = await Promise.all([
    query
      ? safe(searchTitles(query, filters.page))
      : safe(discoverTitles("movie", filters)),
    safe(mergedGenres()),
  ]);

  const page = rawPage && query ? applyFilters(rawPage, filters) : rawPage;
  const hrefFor = (target: number) => {
    const base = catalogHref("/search", filters, target);
    return query ? `${base}${base.includes("?") ? "&" : "?"}q=${encodeURIComponent(query)}` : base;
  };

  return (
    <Section>
      <div className="mb-8 flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">Поиск</h1>
          <p className="mt-2 text-sm text-mist sm:text-base">
            {query
              ? `Результаты по запросу «${query}»${page ? ` — ${page.totalResults.toLocaleString("ru-RU")}` : ""}`
              : "Введите запрос или подберите тайтл фильтрами."}
          </p>
        </div>
        <Suspense>
          <SearchInput />
        </Suspense>
        <Suspense>
          <FilterBar genres={genres ?? []} />
        </Suspense>
      </div>

      {page ? (
        <>
          <MediaGrid items={page.results} />
          <Pagination page={page.page} totalPages={page.totalPages} hrefFor={hrefFor} />
        </>
      ) : (
        <div className="rounded-lg border border-line bg-paper py-16 text-center">
          <p className="text-sm font-medium text-ink">Не удалось выполнить поиск</p>
          <p className="mt-1 text-sm text-mist">Попробуйте ещё раз чуть позже.</p>
        </div>
      )}
    </Section>
  );
}
