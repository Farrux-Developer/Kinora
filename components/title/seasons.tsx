"use client";

import Image from "next/image";
import { useState } from "react";
import { posterUrl, stillUrl } from "@/lib/tmdb/image";
import type { Episode, SeasonSummary } from "@/lib/tmdb/types";

interface EpisodesState {
  status: "idle" | "loading" | "loaded" | "error";
  episodes: Episode[];
}

/** Season list with lazily loaded episodes (fetched from /api on expand). */
export function Seasons({ tvId, seasons }: { tvId: number; seasons: SeasonSummary[] }) {
  const [openSeason, setOpenSeason] = useState<number | null>(null);
  const [episodesBySeason, setEpisodesBySeason] = useState<Record<number, EpisodesState>>({});

  if (!seasons.length) return null;

  const toggle = async (seasonNumber: number) => {
    const next = openSeason === seasonNumber ? null : seasonNumber;
    setOpenSeason(next);
    if (next === null || episodesBySeason[next]?.status === "loaded") return;

    setEpisodesBySeason((state) => ({
      ...state,
      [next]: { status: "loading", episodes: [] },
    }));
    try {
      const res = await fetch(`/api/tv/${tvId}/season/${next}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { episodes: Episode[] };
      setEpisodesBySeason((state) => ({
        ...state,
        [next]: { status: "loaded", episodes: data.episodes },
      }));
    } catch {
      setEpisodesBySeason((state) => ({
        ...state,
        [next]: { status: "error", episodes: [] },
      }));
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">Сезоны</h2>
      <div className="flex flex-col gap-3">
        {seasons.map((season) => {
          const open = openSeason === season.seasonNumber;
          const state = episodesBySeason[season.seasonNumber];
          const poster = posterUrl(season.posterPath, "w185");

          return (
            <div key={season.id} className="overflow-hidden rounded-lg border border-line-dark">
              <button
                type="button"
                onClick={() => toggle(season.seasonNumber)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 bg-ink-2 p-3 text-left transition-colors hover:bg-ink-2/60"
              >
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded border border-line-dark bg-ink">
                  {poster && (
                    <Image src={poster} alt={season.name} fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{season.name}</p>
                  <p className="mt-0.5 text-sm text-mist-dark">
                    {season.episodeCount} серий{season.airYear ? ` · ${season.airYear}` : ""}
                  </p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className={`size-5 shrink-0 stroke-mist-dark transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {open && (
                <div className="border-t border-line-dark bg-ink">
                  {state?.status === "loading" && (
                    <p className="p-4 text-sm text-mist-dark">Загружаем серии…</p>
                  )}
                  {state?.status === "error" && (
                    <p className="p-4 text-sm text-mist-dark">Не удалось загрузить список серий.</p>
                  )}
                  {state?.status === "loaded" && (
                    <ul className="divide-y divide-line-dark">
                      {state.episodes.map((episode) => (
                        <li key={episode.id} className="flex gap-4 p-4">
                          <div className="relative hidden h-16 w-28 shrink-0 overflow-hidden rounded border border-line-dark bg-ink-2 sm:block">
                            {episode.stillPath && (
                              <Image
                                src={stillUrl(episode.stillPath)!}
                                alt=""
                                fill
                                sizes="112px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {episode.episodeNumber}. {episode.name}
                            </p>
                            <p className="mt-0.5 text-xs text-mist-dark">
                              {[
                                episode.airDate &&
                                  new Date(episode.airDate).toLocaleDateString("ru-RU"),
                                episode.runtime && `${episode.runtime} мин`,
                                episode.voteAverage > 0 && `★ ${episode.voteAverage.toFixed(1)}`,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                            {episode.overview && (
                              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-mist-dark">
                                {episode.overview}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
