export function PosterSkeleton({ onDark = false }: { onDark?: boolean }) {
  return (
    <div
      className={`aspect-2/3 rounded-lg ${onDark ? "skeleton-dark" : "skeleton"}`}
      aria-hidden
    />
  );
}

export function CarouselSkeleton({ onDark = false, count = 8 }: { onDark?: boolean; count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden pb-1">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-36 shrink-0 sm:w-44">
          <PosterSkeleton onDark={onDark} />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <PosterSkeleton key={index} />
      ))}
    </div>
  );
}

export function SectionTitleSkeleton({ onDark = false }: { onDark?: boolean }) {
  return <div className={`mb-6 h-7 w-56 rounded ${onDark ? "skeleton-dark" : "skeleton"}`} aria-hidden />;
}
