import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { PosterCard } from "@/components/ui/poster-card";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/components/ui/stagger";
import { SectionHeading } from "@/components/ui/section";
import { safe } from "@/lib/tmdb/client";
import type { MediaItem, Paginated } from "@/lib/tmdb/types";

/**
 * Home page carousel row. Awaits its own data so each row streams in
 * independently under a Suspense boundary; a failed request hides the row
 * instead of breaking the page.
 */
export async function MediaRow({
  title,
  href,
  itemsPromise,
  onDark = false,
}: {
  title: string;
  href?: string;
  itemsPromise: Promise<Paginated<MediaItem>>;
  onDark?: boolean;
}) {
  const page = await safe(itemsPromise);
  const items = page?.results.filter((item) => item.posterPath).slice(0, 20) ?? [];
  if (!items.length) return null;

  return (
    <div>
      <SectionHeading title={title} href={href} onDark={onDark} />
      <Carousel onDark={onDark}>
        {items.map((item, index) => (
          <CarouselItem key={`${item.mediaType}-${item.id}`}>
            <Reveal delay={staggerDelay(index)}>
              <PosterCard item={item} onDark={onDark} />
            </Reveal>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
}
