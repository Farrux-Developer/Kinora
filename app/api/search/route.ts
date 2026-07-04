import { NextResponse } from "next/server";
import { isTmdbConfigured, searchTitles } from "@/lib/tmdb/client";

/** Slim search endpoint for the header live-suggestions dropdown. */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || !isTmdbConfigured()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const page = await searchTitles(query);
    return NextResponse.json({
      results: page.results.slice(0, 8).map((item) => ({
        id: item.id,
        mediaType: item.mediaType,
        title: item.title,
        posterPath: item.posterPath,
        voteAverage: item.voteAverage,
        year: item.year,
      })),
    });
  } catch {
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
