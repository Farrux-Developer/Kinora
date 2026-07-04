/** Raw TMDB v3 API shapes (subset used by the app) and normalized app-level types. */

export type TmdbMediaType = "movie" | "tv";

export interface TmdbPaginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbMediaBase {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  original_language: string;
}

export interface TmdbMovieListItem extends TmdbMediaBase {
  title: string;
  original_title: string;
  release_date?: string;
  media_type?: "movie";
}

export interface TmdbTvListItem extends TmdbMediaBase {
  name: string;
  original_name: string;
  first_air_date?: string;
  origin_country?: string[];
  media_type?: "tv";
}

export type TmdbListItem = TmdbMovieListItem | TmdbTvListItem;

export interface TmdbPersonListItem {
  id: number;
  name: string;
  profile_path: string | null;
  media_type: "person";
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  iso_639_1: string;
  published_at: string;
}

export interface TmdbSeasonSummary {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  episode_count: number;
  air_date: string | null;
  vote_average: number;
}

export interface TmdbEpisode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface TmdbMovieDetails extends TmdbMovieListItem {
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string;
  status: string;
  production_countries: { iso_3166_1: string; name: string }[];
  credits?: { cast: TmdbCastMember[] };
  videos?: { results: TmdbVideo[] };
  similar?: TmdbPaginated<TmdbMovieListItem>;
}

export interface TmdbTvDetails extends TmdbTvListItem {
  genres: TmdbGenre[];
  tagline: string;
  status: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  last_air_date: string | null;
  seasons: TmdbSeasonSummary[];
  credits?: { cast: TmdbCastMember[] };
  videos?: { results: TmdbVideo[] };
  similar?: TmdbPaginated<TmdbTvListItem>;
}

export interface TmdbSeasonDetails {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
  episodes: TmdbEpisode[];
}

/* ------------------------------------------------------------------ */
/* Normalized app-level types: movie/tv differences are flattened so   */
/* the UI renders both media types with the same components.           */
/* ------------------------------------------------------------------ */

export interface MediaItem {
  id: number;
  mediaType: TmdbMediaType;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  voteCount: number;
  year: number | null;
  genreIds: number[];
}

export interface Paginated<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface SeasonSummary {
  id: number;
  seasonNumber: number;
  name: string;
  overview: string;
  posterPath: string | null;
  episodeCount: number;
  airYear: number | null;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string | null;
  runtime: number | null;
  voteAverage: number;
}

export interface TitleDetails extends MediaItem {
  genres: TmdbGenre[];
  tagline: string;
  status: string;
  /** Minutes for movies, average episode runtime for TV. */
  runtime: number | null;
  cast: CastMember[];
  /** YouTube video key of the best available trailer, if any. */
  trailerKey: string | null;
  similar: MediaItem[];
  /** TV only */
  seasons: SeasonSummary[];
  numberOfSeasons: number;
  numberOfEpisodes: number;
}

export type SortOption =
  | "popularity.desc"
  | "vote_average.desc"
  | "primary_release_date.desc"
  | "first_air_date.desc";

export interface DiscoverFilters {
  page?: number;
  genreId?: number;
  year?: number;
  minRating?: number;
  sortBy?: SortOption;
}
