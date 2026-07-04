export default function Loading() {
  return (
    <div className="bg-ink">
      <div className="h-[42vh] min-h-72 w-full skeleton-dark sm:h-[52vh]" />
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative z-10 -mt-36 flex flex-col gap-8 sm:-mt-44 md:flex-row">
          <div className="aspect-2/3 w-40 shrink-0 rounded-lg skeleton-dark sm:w-56" />
          <div className="max-w-2xl flex-1 md:pt-24">
            <div className="h-10 w-3/4 rounded skeleton-dark" />
            <div className="mt-4 h-4 w-1/2 rounded skeleton-dark" />
            <div className="mt-8 h-24 w-full rounded skeleton-dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
