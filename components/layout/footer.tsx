import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line-dark bg-ink text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-3">
            <Logo onDark />
            <p className="text-sm leading-relaxed text-mist-dark">
              Каталог фильмов, сериалов и аниме: рейтинги, трейлеры и персональные списки.
            </p>
          </div>

          <nav className="flex gap-12 text-sm" aria-label="Навигация в подвале">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Каталог</span>
              <Link href="/movies" className="text-mist-dark transition-colors hover:text-white">Фильмы</Link>
              <Link href="/tv" className="text-mist-dark transition-colors hover:text-white">Сериалы</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Аккаунт</span>
              <Link href="/library" className="text-mist-dark transition-colors hover:text-white">Мои списки</Link>
              <Link href="/search" className="text-mist-dark transition-colors hover:text-white">Поиск</Link>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line-dark pt-6 text-xs text-mist-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            Данные о фильмах предоставлены{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-white/90 underline-offset-2 hover:underline"
            >
              TMDB
            </a>
            . Этот продукт использует TMDB API, но не одобрен и не сертифицирован TMDB.
          </p>
          <p>© {new Date().getFullYear()} Kinora. Портфолио-проект.</p>
        </div>
      </div>
    </footer>
  );
}
