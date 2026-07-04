import { PosterCard } from "@/components/ui/poster-card";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/components/ui/stagger";
import type { MediaItem } from "@/lib/tmdb/types";

export function MediaGrid({ items }: { items: MediaItem[] }) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-line bg-paper py-16 text-center">
        <p className="text-sm font-medium text-fg">Ничего не найдено</p>
        <p className="mt-1 text-sm text-mist">Попробуйте изменить фильтры или запрос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item, index) => (
        <Reveal key={`${item.mediaType}-${item.id}`} delay={staggerDelay(index % 6)}>
          <PosterCard
            item={item}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
          />
        </Reveal>
      ))}
    </div>
  );
}
