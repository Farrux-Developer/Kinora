import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TitlePage } from "@/components/title/title-page";
import { getMovieDetails, isTmdbConfigured, TmdbApiError } from "@/lib/tmdb/client";
import type { TitleDetails } from "@/lib/tmdb/types";

async function loadMovie(idParam: string): Promise<TitleDetails> {
  const id = Number.parseInt(idParam, 10);
  if (!Number.isFinite(id) || id <= 0 || !isTmdbConfigured()) notFound();
  try {
    return await getMovieDetails(id);
  } catch (error) {
    if (error instanceof TmdbApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const details = await loadMovie(id);
  return {
    title: `${details.title}${details.year ? ` (${details.year})` : ""}`,
    description: details.overview.slice(0, 200) || undefined,
  };
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const details = await loadMovie(id);
  return <TitlePage details={details} />;
}
