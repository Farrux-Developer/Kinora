"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const DEBOUNCE_MS = 350;

/** Big search field on /search — syncs to the `q` URL param with debounce. */
export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  const [isPending, startTransition] = useTransition();

  // Adopt external URL changes (back/forward, header suggestion click).
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setValue(urlQuery);
  }

  useEffect(() => {
    if (value.trim() === urlQuery) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      startTransition(() => {
        router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
      });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, urlQuery, pathname, router, searchParams]);

  return (
    <div className="relative max-w-2xl">
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 stroke-mist"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        autoFocus
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Название фильма, сериала или аниме…"
        aria-label="Поисковый запрос"
        className="h-12 w-full rounded-lg border border-line bg-white pr-4 pl-12 text-base text-ink placeholder:text-mist-2 transition-colors focus:border-accent focus:outline-none"
      />
      {isPending && (
        <span
          className="absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin rounded-full border-2 border-line border-t-accent"
          aria-hidden
        />
      )}
    </div>
  );
}
