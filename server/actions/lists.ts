"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ListType } from "@/lib/generated/prisma/enums";

const toggleSchema = z.object({
  listType: z.enum(["WATCHLIST", "FAVORITE"]),
  mediaType: z.enum(["movie", "tv"]),
  tmdbId: z.number().int().positive(),
  title: z.string().min(1).max(500),
  posterPath: z.string().max(200).nullable(),
  voteAverage: z.number().min(0).max(10),
  releaseYear: z.number().int().nullable(),
});

export type ToggleInput = z.infer<typeof toggleSchema>;

/**
 * Add the title to the list, or remove it when already saved.
 * Returns the new membership state.
 */
export async function toggleListItem(input: ToggleInput): Promise<{ saved: boolean }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("UNAUTHORIZED");

  const data = toggleSchema.parse(input);
  const where = {
    userId_listType_mediaType_tmdbId: {
      userId,
      listType: data.listType as ListType,
      mediaType: data.mediaType,
      tmdbId: data.tmdbId,
    },
  };

  const existing = await db.listItem.findUnique({ where });
  let saved: boolean;
  if (existing) {
    await db.listItem.delete({ where });
    saved = false;
  } else {
    await db.listItem.create({
      data: {
        userId,
        listType: data.listType as ListType,
        mediaType: data.mediaType,
        tmdbId: data.tmdbId,
        title: data.title,
        posterPath: data.posterPath,
        voteAverage: data.voteAverage,
        releaseYear: data.releaseYear,
      },
    });
    saved = true;
  }

  revalidatePath("/library");
  return { saved };
}

/** Remove an item from a list (used on the library page). */
export async function removeListItem(id: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("UNAUTHORIZED");

  await db.listItem.deleteMany({ where: { id, userId } });
  revalidatePath("/library");
}
