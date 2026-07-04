import { Suspense } from "react";
import { FilterBar } from "@/components/catalog/filter-bar";
import { MediaGrid } from "@/components/catalog/media-grid";
import { Pagination } from "@/components/catalog/pagination";
import { TmdbSetupNotice } from "@/components/tmdb-notice";
import { Section } from "@/components/ui/section";
import { catalogHref } from "@/lib/catalog-params";
import { isTmdbConfigured, safe } from "@/lib/tmdb/client";
import type { DiscoverFilters, MediaItem, Paginated, TmdbGenre } from "@/lib/tmdb/types";

/** Shared shell for the /movies and /tv grid pages. */
export async function CatalogPage({
  basePath,
  title,
  description,
  filters,
  itemsPromise,
  genresPromise,
}: {
  basePath: string;
  title: string;
  description: string;
  filters: DiscoverFilters;
  itemsPromise: Promise<Paginated<MediaItem>>;
  genresPromise?: Promise<TmdbGenre[]>;
}) {
  if (!isTmdbConfigured()) {
    return (
      <Section>
        <TmdbSetupNotice />
      </Section>
    );
  }

  const [page, genres] = await Promise.all([
    safe(itemsPromise),
    genresPromise ? safe(genresPromise) : Promise.resolve(null),
  ]);

  return (
    <Section>
      <div className="mb-8 flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-mist sm:text-base">{description}</p>
        </div>
        <Suspense>
          <FilterBar genres={genres ?? []} />
        </Suspense>
      </div>

      {page ? (
        <>
          <MediaGrid items={page.results} />
          <Pagination
            page={page.page}
            totalPages={page.totalPages}
            hrefFor={(target) => catalogHref(basePath, filters, target)}
          />
        </>
      ) : (
        <div className="rounded-lg border border-line bg-paper py-16 text-center">
          <p className="text-sm font-medium text-fg">Не удалось загрузить каталог</p>
          <p className="mt-1 text-sm text-mist">Проверьте соединение и обновите страницу.</p>
        </div>
      )}
    </Section>
  );
}
