import Image from "next/image";
import { profileUrl } from "@/lib/tmdb/image";
import type { WatchProvider, WatchProviders } from "@/lib/tmdb/types";

const REGION_NAMES: Record<string, string> = {
  RU: "России",
  US: "США",
  DE: "Германии",
  GB: "Великобритании",
};

function logoUrl(path: string | null) {
  // Provider logos live on the same TMDB image CDN as profiles (w185 works for both).
  return path ? profileUrl(path, "w185") : null;
}

function ProviderRow({
  label,
  providers,
  watchLink,
}: {
  label: string;
  providers: WatchProvider[];
  watchLink: string;
}) {
  if (!providers.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="w-40 shrink-0 text-sm text-mist-dark">{label}</span>
      <div className="flex flex-wrap gap-2">
        {providers.slice(0, 8).map((provider) => {
          const logo = logoUrl(provider.logoPath);
          return (
            <a
              key={provider.id}
              href={watchLink}
              target="_blank"
              rel="noreferrer"
              title={`Смотреть на ${provider.name}`}
              className="flex items-center gap-2 rounded-md border border-line-dark bg-ink-2 px-2 py-1.5 transition-colors hover:border-mist-dark"
            >
              {logo && (
                <Image
                  src={logo}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded"
                />
              )}
              <span className="text-xs font-medium text-white">{provider.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Legal watch options (TMDB/JustWatch): free with ads, subscription,
 * rent/buy — with a link to the full regional list on JustWatch.
 */
export function WatchProvidersBlock({ providers }: { providers: WatchProviders | null }) {
  if (!providers) return null;

  const regionName = REGION_NAMES[providers.region] ?? providers.region;

  return (
    <section className="mt-10 rounded-lg border border-line-dark p-5" aria-labelledby="watch-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="watch-heading" className="text-lg font-semibold tracking-tight text-white">
          Где посмотреть
        </h2>
        <a
          href={providers.link}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-mist-dark transition-colors hover:text-white"
        >
          Все варианты на JustWatch →
        </a>
      </div>
      <p className="mt-1 text-xs text-mist-dark">
        Легальные сервисы в {regionName} по данным JustWatch. Доступность зависит от вашей страны.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <ProviderRow label="Бесплатно (с рекламой)" providers={providers.free} watchLink={providers.link} />
        <ProviderRow label="По подписке" providers={providers.subscription} watchLink={providers.link} />
        <ProviderRow label="Аренда и покупка" providers={providers.rentOrBuy} watchLink={providers.link} />
      </div>
    </section>
  );
}
