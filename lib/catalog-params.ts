import type { DiscoverFilters, SortOption } from "@/lib/tmdb/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const SORT_OPTIONS: SortOption[] = [
  "popularity.desc",
  "vote_average.desc",
  "primary_release_date.desc",
];

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Parse and clamp catalog filters from URL search params. */
export function parseFilters(params: RawSearchParams): DiscoverFilters {
  const page = toInt(single(params.page));
  const year = toInt(single(params.year));
  const genreId = toInt(single(params.genre));
  const minRating = toInt(single(params.rating));
  const sortRaw = single(params.sort) as SortOption | undefined;

  const currentYear = new Date().getFullYear();

  return {
    page: page && page >= 1 && page <= 500 ? page : 1,
    genreId,
    year: year && year >= 1900 && year <= currentYear + 1 ? year : undefined,
    minRating: minRating && minRating >= 1 && minRating <= 9 ? minRating : undefined,
    sortBy: sortRaw && SORT_OPTIONS.includes(sortRaw) ? sortRaw : "popularity.desc",
  };
}

/** Build a catalog URL preserving active filters. */
export function catalogHref(basePath: string, filters: DiscoverFilters, page?: number): string {
  const search = new URLSearchParams();
  const target = page ?? filters.page ?? 1;
  if (target > 1) search.set("page", String(target));
  if (filters.genreId) search.set("genre", String(filters.genreId));
  if (filters.year) search.set("year", String(filters.year));
  if (filters.minRating) search.set("rating", String(filters.minRating));
  if (filters.sortBy && filters.sortBy !== "popularity.desc") search.set("sort", filters.sortBy);
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}
