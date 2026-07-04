"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { posterUrl } from "@/lib/tmdb/image";

interface Suggestion {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  voteAverage: number;
  year: number | null;
}

const DEBOUNCE_MS = 300;

/** Header search: debounced live suggestions with keyboard navigation. */
export function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const onQueryChange = (next: string) => {
    setQuery(next);
    if (next.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
    }
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as { results: Suggestion[] };
        setSuggestions(data.results);
        setHighlighted(-1);
        setOpen(true);
      } catch {
        // aborted or offline — keep previous state
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goToResults = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((index) => Math.max(index - 1, -1));
    } else if (event.key === "Enter") {
      const selected = suggestions[highlighted];
      if (selected && open) {
        setOpen(false);
        router.push(`/${selected.mediaType}/${selected.id}`);
      } else {
        goToResults();
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative hidden w-56 lg:block xl:w-72">
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 stroke-mist"
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
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length && setOpen(true)}
        placeholder="Поиск фильмов и сериалов"
        aria-label="Поиск"
        role="combobox"
        aria-expanded={open}
        aria-controls="search-suggestions"
        className="h-9 w-full rounded-md border border-line bg-paper pr-3 pl-9 text-sm text-ink placeholder:text-mist-2 transition-colors focus:border-accent focus:bg-white focus:outline-none"
      />

      {open && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute top-full right-0 left-0 z-50 mt-1.5 overflow-hidden rounded-lg border border-line bg-white"
        >
          {suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-mist">Ничего не найдено</p>
          ) : (
            <>
              <ul>
                {suggestions.map((item, index) => {
                  const poster = posterUrl(item.posterPath, "w185");
                  return (
                    <li key={`${item.mediaType}-${item.id}`} role="option" aria-selected={index === highlighted}>
                      <Link
                        href={`/${item.mediaType}/${item.id}`}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                          index === highlighted ? "bg-paper" : "hover:bg-paper"
                        }`}
                      >
                        <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded border border-line bg-paper">
                          {poster && (
                            <Image src={poster} alt="" fill sizes="32px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm font-medium text-ink">{item.title}</p>
                          <p className="text-xs text-mist">
                            {item.mediaType === "movie" ? "Фильм" : "Сериал"}
                            {item.year ? ` · ${item.year}` : ""}
                            {item.voteAverage ? ` · ★ ${item.voteAverage.toFixed(1)}` : ""}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={goToResults}
                className="block w-full border-t border-line px-4 py-2.5 text-left text-sm font-medium text-accent transition-colors hover:bg-paper"
              >
                Все результаты →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
