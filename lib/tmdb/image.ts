/** TMDB image URL helpers. Safe to import from client components. */

const IMAGE_BASE = "https://image.tmdb.org/t/p";

export type PosterSize = "w185" | "w342" | "w500" | "w780";
export type BackdropSize = "w780" | "w1280" | "original";
export type ProfileSize = "w185" | "h632";
export type StillSize = "w300" | "original";

export function posterUrl(path: string | null, size: PosterSize = "w342") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function backdropUrl(path: string | null, size: BackdropSize = "w1280") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function profileUrl(path: string | null, size: ProfileSize = "w185") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function stillUrl(path: string | null, size: StillSize = "w300") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function youtubeEmbedUrl(key: string) {
  return `https://www.youtube-nocookie.com/embed/${key}?rel=0`;
}
