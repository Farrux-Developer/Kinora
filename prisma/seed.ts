/**
 * Seed: demo user (demo@kinora.app / demo12345) with a few saved titles.
 * When TMDB_API_KEY is set, posters and ratings are fetched live; otherwise
 * the items are created with placeholder posters.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import type { MediaType } from "../lib/generated/prisma/enums";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

interface SeedTitle {
  tmdbId: number;
  mediaType: MediaType;
  listType: "WATCHLIST" | "FAVORITE";
  fallbackTitle: string;
  fallbackYear: number;
}

const TITLES: SeedTitle[] = [
  { tmdbId: 157336, mediaType: "movie", listType: "FAVORITE", fallbackTitle: "Интерстеллар", fallbackYear: 2014 },
  { tmdbId: 129, mediaType: "movie", listType: "FAVORITE", fallbackTitle: "Унесённые призраками", fallbackYear: 2001 },
  { tmdbId: 27205, mediaType: "movie", listType: "WATCHLIST", fallbackTitle: "Начало", fallbackYear: 2010 },
  { tmdbId: 1396, mediaType: "tv", listType: "FAVORITE", fallbackTitle: "Во все тяжкие", fallbackYear: 2008 },
  { tmdbId: 1429, mediaType: "tv", listType: "WATCHLIST", fallbackTitle: "Атака титанов", fallbackYear: 2013 },
  { tmdbId: 95479, mediaType: "tv", listType: "WATCHLIST", fallbackTitle: "Магическая битва", fallbackYear: 2020 },
];

async function fetchTmdbSnapshot(title: SeedTitle) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;
  const url = new URL(`https://api.themoviedb.org/3/${title.mediaType}/${title.tmdbId}`);
  url.searchParams.set("language", "ru-RU");
  const headers: Record<string, string> = { accept: "application/json" };
  if (apiKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${apiKey}`;
  } else {
    url.searchParams.set("api_key", apiKey);
  }
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      title?: string;
      name?: string;
      poster_path: string | null;
      vote_average: number;
      release_date?: string;
      first_air_date?: string;
    };
    const date = data.release_date ?? data.first_air_date;
    return {
      title: data.title ?? data.name ?? title.fallbackTitle,
      posterPath: data.poster_path,
      voteAverage: data.vote_average,
      releaseYear: date ? Number(date.slice(0, 4)) : title.fallbackYear,
    };
  } catch {
    return null;
  }
}

async function main() {
  const email = "demo@kinora.app";
  const passwordHash = await bcrypt.hash("demo12345", 10);

  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Демо", passwordHash },
  });

  for (const title of TITLES) {
    const snapshot = (await fetchTmdbSnapshot(title)) ?? {
      title: title.fallbackTitle,
      posterPath: null,
      voteAverage: 0,
      releaseYear: title.fallbackYear,
    };

    await db.listItem.upsert({
      where: {
        userId_listType_mediaType_tmdbId: {
          userId: user.id,
          listType: title.listType,
          mediaType: title.mediaType,
          tmdbId: title.tmdbId,
        },
      },
      update: {
        title: snapshot.title,
        posterPath: snapshot.posterPath,
        voteAverage: snapshot.voteAverage,
        releaseYear: snapshot.releaseYear,
      },
      create: {
        userId: user.id,
        listType: title.listType,
        mediaType: title.mediaType,
        tmdbId: title.tmdbId,
        ...snapshot,
      },
    });
  }

  console.log(`Seeded demo user ${email} with ${TITLES.length} list items.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
