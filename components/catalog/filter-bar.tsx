"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { TmdbGenre } from "@/lib/tmdb/types";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1969 }, (_, index) => CURRENT_YEAR - index);

const SORT_LABELS = [
  { value: "popularity.desc", label: "По популярности" },
  { value: "vote_average.desc", label: "По рейтингу" },
  { value: "primary_release_date.desc", label: "Сначала новые" },
];

const RATINGS = [6, 7, 8];

/** Genre/year/rating/sort filters; updates the URL, page resets to 1. */
export function FilterBar({ genres = [] }: { genres?: TmdbGenre[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const apply = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
    });
  };

  const selectClass =
    "h-9 rounded-md border border-line bg-surface px-2.5 text-sm text-fg transition-colors hover:border-mist-2 focus:border-accent focus:outline-none";

  const hasFilters = ["genre", "year", "rating", "sort"].some((key) => searchParams.has(key));

  return (
    <div
      className={`flex flex-wrap items-center gap-2 transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      {genres.length > 0 && (
        <select
          aria-label="Жанр"
          className={selectClass}
          value={searchParams.get("genre") ?? ""}
          onChange={(event) => apply("genre", event.target.value)}
        >
          <option value="">Все жанры</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      )}

      <select
        aria-label="Год"
        className={selectClass}
        value={searchParams.get("year") ?? ""}
        onChange={(event) => apply("year", event.target.value)}
      >
        <option value="">Любой год</option>
        {YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        aria-label="Минимальный рейтинг"
        className={selectClass}
        value={searchParams.get("rating") ?? ""}
        onChange={(event) => apply("rating", event.target.value)}
      >
        <option value="">Любой рейтинг</option>
        {RATINGS.map((rating) => (
          <option key={rating} value={rating}>
            {rating}+
          </option>
        ))}
      </select>

      <select
        aria-label="Сортировка"
        className={selectClass}
        value={searchParams.get("sort") ?? "popularity.desc"}
        onChange={(event) => apply("sort", event.target.value)}
      >
        {SORT_LABELS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={() => startTransition(() => router.push(pathname, { scroll: false }))}
          className="h-9 rounded-md px-2.5 text-sm font-medium text-mist transition-colors hover:text-fg"
        >
          Сбросить
        </button>
      )}
    </div>
  );
}
