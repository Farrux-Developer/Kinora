import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LibraryCard } from "@/components/library/library-card";
import { Section } from "@/components/ui/section";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Мои списки" };

const TABS = [
  { key: "watchlist", listType: "WATCHLIST", label: "Смотреть позже" },
  { key: "favorites", listType: "FAVORITE", label: "Избранное" },
] as const;

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/login?next=/library");

  const { tab } = await searchParams;
  const activeTab = TABS.find((item) => item.key === tab) ?? TABS[0];

  const [items, counts] = await Promise.all([
    db.listItem.findMany({
      where: { userId: user.id, listType: activeTab.listType },
      orderBy: { createdAt: "desc" },
    }),
    db.listItem.groupBy({
      by: ["listType"],
      where: { userId: user.id },
      _count: true,
    }),
  ]);

  const countFor = (listType: string) =>
    counts.find((row) => row.listType === listType)?._count ?? 0;

  return (
    <Section>
      <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">Мои списки</h1>
      <p className="mt-2 text-sm text-mist sm:text-base">
        {user.name ? `${user.name}, здесь` : "Здесь"} всё, что вы сохранили на потом.
      </p>

      <div className="mt-7 flex gap-2 border-b border-line" role="tablist">
        {TABS.map((item) => {
          const active = item.key === activeTab.key;
          return (
            <Link
              key={item.key}
              href={item.key === "watchlist" ? "/library" : `/library?tab=${item.key}`}
              role="tab"
              aria-selected={active}
              className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-accent text-fg"
                  : "border-transparent text-mist hover:text-fg"
              }`}
            >
              {item.label}
              <span className="ml-1.5 text-xs text-mist-2 tabular-nums">
                {countFor(item.listType)}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        {items.length === 0 ? (
          <div className="rounded-lg border border-line bg-paper py-16 text-center">
            <p className="text-sm font-medium text-fg">Список пуст</p>
            <p className="mt-1 text-sm text-mist">
              Откройте любой тайтл и нажмите «{activeTab.label === "Избранное" ? "В избранное" : "Смотреть позже"}».
            </p>
            <Link
              href="/movies"
              className="mt-6 inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              В каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => (
              <LibraryCard
                key={item.id}
                item={{
                  id: item.id,
                  mediaType: item.mediaType,
                  tmdbId: item.tmdbId,
                  title: item.title,
                  posterPath: item.posterPath,
                  voteAverage: item.voteAverage,
                  releaseYear: item.releaseYear,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
