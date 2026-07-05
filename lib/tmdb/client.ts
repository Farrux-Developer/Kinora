import "server-only";

import type {
  DiscoverFilters,
  MediaItem,
  Paginated,
  TitleDetails,
  TmdbGenre,
  TmdbListItem,
  TmdbMediaType,
  TmdbMovieDetails,
  TmdbMovieListItem,
  TmdbPaginated,
  TmdbSeasonDetails,
  TmdbTvDetails,
  TmdbTvListItem,
  TmdbVideo,
  TmdbWatchProvider,
  TmdbWatchProviderRegion,
  WatchProviders,
} from "./types";

const API_BASE = "https://api.themoviedb.org/3";
const LANGUAGE = "ru-RU";

/** Anime = Animation genre + Japanese origin. */
const ANIMATION_GENRE_ID = 16;

const HOUR = 3600;
const DAY = 86400;

export class TmdbNotConfiguredError extends Error {
  constructor() {
    super("TMDB_API_KEY is not set. Add it to .env to load catalog data.");
    this.name = "TmdbNotConfiguredError";
  }
}

export class TmdbApiError extends Error {
  constructor(
    public readonly status: number,
    path: string,
  ) {
    super(`TMDB request failed (${status}): ${path}`);
    this.name = "TmdbApiError";
  }
}

export function isTmdbConfigured(): boolean {
  return Boolean(process.env.TMDB_API_KEY);
}

async function tmdb<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  revalidate: number = HOUR,
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new TmdbNotConfiguredError();

  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("language", LANGUAGE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  // v4 read tokens are JWTs and go in the Authorization header;
  // classic v3 keys are passed as the api_key query param.
  const isV4Token = apiKey.startsWith("eyJ");
  const headers: HeadersInit = { accept: "application/json" };
  if (isV4Token) {
    headers.Authorization = `Bearer ${apiKey}`;
  } else {
    url.searchParams.set("api_key", apiKey);
  }

  const res = await fetch(url, { headers, next: { revalidate } });
  if (!res.ok) throw new TmdbApiError(res.status, path);
  return res.json() as Promise<T>;
}

/**
 * Resolve a data promise to null on failure. Lets independent page sections
 * (carousels, similar titles, …) degrade individually instead of failing the
 * whole page.
 */
export async function safe<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (!(error instanceof TmdbNotConfiguredError)) {
      console.error("[tmdb]", error);
    }
    return null;
  }
}

/* ------------------------------- normalize ------------------------------ */

function yearOf(date: string | undefined | null): number | null {
  if (!date) return null;
  const year = Number(date.slice(0, 4));
  return Number.isFinite(year) && year > 1800 ? year : null;
}

function normalizeMovie(raw: TmdbMovieListItem): MediaItem {
  return {
    id: raw.id,
    mediaType: "movie",
    title: raw.title,
    originalTitle: raw.original_title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    year: yearOf(raw.release_date),
    genreIds: raw.genre_ids ?? [],
  };
}

function normalizeTv(raw: TmdbTvListItem): MediaItem {
  return {
    id: raw.id,
    mediaType: "tv",
    title: raw.name,
    originalTitle: raw.original_name,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    year: yearOf(raw.first_air_date),
    genreIds: raw.genre_ids ?? [],
  };
}

function normalizeItem(raw: TmdbListItem, fallbackType: TmdbMediaType): MediaItem {
  const type = raw.media_type ?? fallbackType;
  return type === "movie"
    ? normalizeMovie(raw as TmdbMovieListItem)
    : normalizeTv(raw as TmdbTvListItem);
}

function normalizePage<R extends TmdbListItem>(
  page: TmdbPaginated<R>,
  fallbackType: TmdbMediaType,
): Paginated<MediaItem> {
  return {
    page: page.page,
    // TMDB caps paginated access at page 500.
    totalPages: Math.min(page.total_pages, 500),
    totalResults: page.total_results,
    results: page.results.map((raw) => normalizeItem(raw, fallbackType)),
  };
}

/** Pick the best trailer: official trailers first, then teasers, RU before EN. */
function pickTrailer(videos: TmdbVideo[] | undefined): string | null {
  if (!videos?.length) return null;
  const candidates = videos
    .filter((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"))
    .sort((a, b) => {
      const score = (v: TmdbVideo) =>
        (v.type === "Trailer" ? 4 : 0) + (v.official ? 2 : 0) + (v.iso_639_1 === "ru" ? 1 : 0);
      return score(b) - score(a);
    });
  return candidates[0]?.key ?? null;
}

/** Regions to try for watch offers, most relevant first. */
const WATCH_REGIONS = ["RU", "US", "DE", "GB"];

function normalizeProviders(list: TmdbWatchProvider[] | undefined) {
  return (list ?? [])
    .sort((a, b) => a.display_priority - b.display_priority)
    .map((provider) => ({
      id: provider.provider_id,
      name: provider.provider_name,
      logoPath: provider.logo_path,
    }));
}

function pickWatchProviders(
  results: Record<string, TmdbWatchProviderRegion> | undefined,
): WatchProviders | null {
  if (!results) return null;
  const region =
    WATCH_REGIONS.find((code) => results[code]) ?? Object.keys(results)[0];
  const offers = region ? results[region] : undefined;
  if (!offers) return null;

  // Dedupe: a provider often appears in both `free` and `ads`.
  const free = [...normalizeProviders(offers.free), ...normalizeProviders(offers.ads)].filter(
    (provider, index, all) => all.findIndex((p) => p.id === provider.id) === index,
  );
  const rentOrBuy = [...normalizeProviders(offers.rent), ...normalizeProviders(offers.buy)].filter(
    (provider, index, all) => all.findIndex((p) => p.id === provider.id) === index,
  );

  const providers: WatchProviders = {
    link: offers.link,
    region,
    free,
    subscription: normalizeProviders(offers.flatrate),
    rentOrBuy,
  };
  return providers.free.length || providers.subscription.length || providers.rentOrBuy.length
    ? providers
    : null;
}

/* -------------------------------- catalog ------------------------------- */

export async function getTrending(
  mediaType: "all" | TmdbMediaType = "all",
  page = 1,
): Promise<Paginated<MediaItem>> {
  const data = await tmdb<TmdbPaginated<TmdbListItem>>(`/trending/${mediaType}/week`, { page });
  const normalized = normalizePage(data, "movie");
  // /trending/all also returns people — media_type filter keeps movie/tv only.
  normalized.results = normalized.results.filter((item) => item.title);
  return normalized;
}

export async function getPopularMovies(page = 1): Promise<Paginated<MediaItem>> {
  const data = await tmdb<TmdbPaginated<TmdbMovieListItem>>("/movie/popular", { page });
  return normalizePage(data, "movie");
}

export async function getNowPlayingMovies(page = 1): Promise<Paginated<MediaItem>> {
  const data = await tmdb<TmdbPaginated<TmdbMovieListItem>>("/movie/now_playing", { page });
  return normalizePage(data, "movie");
}

export async function getOnTheAirTv(page = 1): Promise<Paginated<MediaItem>> {
  const data = await tmdb<TmdbPaginated<TmdbTvListItem>>("/tv/on_the_air", { page });
  return normalizePage(data, "tv");
}

/** Animated movies (cartoons) — popular first, obscure entries filtered out. */
export async function getCartoonMovies(page = 1): Promise<Paginated<MediaItem>> {
  const data = await tmdb<TmdbPaginated<TmdbMovieListItem>>("/discover/movie", {
    page,
    with_genres: ANIMATION_GENRE_ID,
    sort_by: "popularity.desc",
    "vote_count.gte": 100,
  });
  return normalizePage(data, "movie");
}

export async function discoverTitles(
  mediaType: TmdbMediaType,
  filters: DiscoverFilters = {},
): Promise<Paginated<MediaItem>> {
  const { page = 1, genreId, year, minRating, sortBy = "popularity.desc" } = filters;
  const isMovie = mediaType === "movie";
  const sort =
    !isMovie && sortBy === "primary_release_date.desc" ? "first_air_date.desc" : sortBy;

  const data = await tmdb<TmdbPaginated<TmdbListItem>>(`/discover/${mediaType}`, {
    page,
    with_genres: genreId,
    sort_by: sort,
    ...(isMovie ? { primary_release_year: year } : { first_air_date_year: year }),
    "vote_average.gte": minRating,
    // Guard rating/date sorts against obscure entries with a handful of votes.
    "vote_count.gte": sortBy === "popularity.desc" ? undefined : 50,
  });
  return normalizePage(data, mediaType);
}

export async function getGenres(mediaType: TmdbMediaType): Promise<TmdbGenre[]> {
  const data = await tmdb<{ genres: TmdbGenre[] }>(`/genre/${mediaType}/list`, {}, DAY);
  return data.genres;
}

/* -------------------------------- details ------------------------------- */

export async function getMovieDetails(id: number): Promise<TitleDetails> {
  const raw = await tmdb<TmdbMovieDetails>(
    `/movie/${id}`,
    {
      append_to_response: "credits,videos,similar,watch/providers",
      include_video_language: "ru,en,null",
    },
    DAY,
  );

  return {
    ...normalizeMovie(raw),
    genreIds: raw.genres.map((genre) => genre.id),
    genres: raw.genres,
    tagline: raw.tagline,
    status: raw.status,
    runtime: raw.runtime,
    cast: (raw.credits?.cast ?? []).slice(0, 20).map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profilePath: member.profile_path,
    })),
    trailerKey: pickTrailer(raw.videos?.results),
    similar: (raw.similar?.results ?? []).slice(0, 12).map(normalizeMovie),
    seasons: [],
    numberOfSeasons: 0,
    numberOfEpisodes: 0,
    watchProviders: pickWatchProviders(raw["watch/providers"]?.results),
  };
}

export async function getTvDetails(id: number): Promise<TitleDetails> {
  const raw = await tmdb<TmdbTvDetails>(
    `/tv/${id}`,
    {
      append_to_response: "credits,videos,similar,watch/providers",
      include_video_language: "ru,en,null",
    },
    DAY,
  );

  return {
    ...normalizeTv(raw),
    genreIds: raw.genres.map((genre) => genre.id),
    genres: raw.genres,
    tagline: raw.tagline,
    status: raw.status,
    runtime: raw.episode_run_time?.[0] ?? null,
    cast: (raw.credits?.cast ?? []).slice(0, 20).map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profilePath: member.profile_path,
    })),
    trailerKey: pickTrailer(raw.videos?.results),
    similar: (raw.similar?.results ?? []).slice(0, 12).map(normalizeTv),
    seasons: raw.seasons
      .filter((season) => season.season_number > 0)
      .map((season) => ({
        id: season.id,
        seasonNumber: season.season_number,
        name: season.name,
        overview: season.overview,
        posterPath: season.poster_path,
        episodeCount: season.episode_count,
        airYear: yearOf(season.air_date),
      })),
    numberOfSeasons: raw.number_of_seasons,
    numberOfEpisodes: raw.number_of_episodes,
    watchProviders: pickWatchProviders(raw["watch/providers"]?.results),
  };
}

export async function getSeasonDetails(
  tvId: number,
  seasonNumber: number,
): Promise<TmdbSeasonDetails> {
  return tmdb<TmdbSeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`, {}, DAY);
}

/* -------------------------------- search -------------------------------- */

export async function searchTitles(query: string, page = 1): Promise<Paginated<MediaItem>> {
  const data = await tmdb<TmdbPaginated<TmdbListItem & { media_type: string }>>(
    "/search/multi",
    { query, page, include_adult: "false" },
    HOUR,
  );
  return {
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
    results: data.results
      .filter((raw) => raw.media_type === "movie" || raw.media_type === "tv")
      .map((raw) => normalizeItem(raw, "movie")),
  };
}

/* ------------------------------- featured ------------------------------- */

/** Featured title for the home hero: the top trending movie with rich media. */
export async function getFeatured(): Promise<TitleDetails | null> {
  const trending = await getTrending("movie");
  const candidate = trending.results.find(
    (item) => item.backdropPath && item.overview && item.voteAverage >= 6.5,
  );
  if (!candidate) return null;
  return getMovieDetails(candidate.id);
}
