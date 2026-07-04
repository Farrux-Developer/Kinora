import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { MediaItem } from "@/lib/tmdb/types";
import { ListActionsButtons } from "./list-actions-buttons";

/** "Watch later" / "Favorite" toggles; asks guests to sign in. */
export async function ListActions({ item }: { item: MediaItem }) {
  const user = await currentUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-md border border-line-dark px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
      >
        <svg viewBox="0 0 24 24" className="size-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 3h12v18l-6-4.5L6 21V3z" />
        </svg>
        Войти, чтобы сохранить
      </Link>
    );
  }

  const rows = await db.listItem.findMany({
    where: { userId: user.id, mediaType: item.mediaType, tmdbId: item.id },
    select: { listType: true },
  });

  return (
    <ListActionsButtons
      item={{
        mediaType: item.mediaType,
        tmdbId: item.id,
        title: item.title,
        posterPath: item.posterPath,
        voteAverage: item.voteAverage,
        releaseYear: item.year,
      }}
      initial={{
        watchlist: rows.some((row) => row.listType === "WATCHLIST"),
        favorite: rows.some((row) => row.listType === "FAVORITE"),
      }}
    />
  );
}
