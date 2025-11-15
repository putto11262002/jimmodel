export function FeaturedModelsSkeleton() {
  return (
    <section className="relative w-full py-20 sm:py-28 bg-background overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-12 sm:mb-16 px-6">
        <div className="h-12 sm:h-14 md:h-16 bg-muted rounded w-96 mx-auto mb-4 animate-pulse" />
        <div className="h-6 sm:h-7 bg-muted/50 rounded w-2/3 mx-auto animate-pulse" />
      </div>

      <div className="space-y-6">
        {/* Top Row Skeleton */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-flex gap-4 px-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`top-${i}`}
                className="inline-block w-48 flex-shrink-0"
              >
                <div className="relative overflow-hidden rounded-lg bg-muted aspect-[3/4] animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row Skeleton */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-flex gap-4 px-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`bottom-${i}`}
                className="inline-block w-48 flex-shrink-0"
              >
                <div className="relative overflow-hidden rounded-lg bg-muted aspect-[3/4] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
