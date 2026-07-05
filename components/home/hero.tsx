import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { HeroCanvas } from "./hero-canvas";

/** First screen: light, clean, with a monochrome 3D backdrop. */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <HeroCanvas />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start px-4 py-24 sm:px-6 sm:py-36">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Каталог кино
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tighter text-balance sm:text-6xl">
            Фильмы, сериалы и мультфильмы — в одном каталоге
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            Рейтинги, трейлеры и актёрские составы тысяч тайтлов. Сохраняйте
            любимое в «Избранное» и планируйте, что посмотреть дальше.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/movies"
              className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              Смотреть каталог
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center rounded-md border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-mist-2"
            >
              Найти тайтл
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
