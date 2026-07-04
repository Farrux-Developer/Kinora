import { NextResponse } from "next/server";
import { getSeasonDetails } from "@/lib/tmdb/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; n: string }> },
) {
  const { id, n } = await params;
  const tvId = Number.parseInt(id, 10);
  const seasonNumber = Number.parseInt(n, 10);

  if (!Number.isFinite(tvId) || tvId <= 0 || !Number.isFinite(seasonNumber) || seasonNumber < 0) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  try {
    const season = await getSeasonDetails(tvId, seasonNumber);
    return NextResponse.json({
      episodes: season.episodes.map((episode) => ({
        id: episode.id,
        episodeNumber: episode.episode_number,
        name: episode.name,
        overview: episode.overview,
        stillPath: episode.still_path,
        airDate: episode.air_date,
        runtime: episode.runtime,
        voteAverage: episode.vote_average,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Season not found" }, { status: 404 });
  }
}
