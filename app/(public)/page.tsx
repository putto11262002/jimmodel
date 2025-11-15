import { About } from "@/app/(public)/_components/about";
import { Cta } from "@/app/(public)/_components/cta";
import { FeaturedModels } from "@/app/(public)/_components/featured-models";
import { FeaturedModelsSkeleton } from "@/app/(public)/_components/featured-models-skeleton";
import { Footer } from "@/app/(public)/_components/footer";
import { Hero } from "@/app/(public)/_components/hero";
import { Portfolio } from "@/app/(public)/_components/portfolio";
import { listModels } from "@/lib/core/models/service";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

async function FeaturedModelsData() {
  "use cache";
  cacheLife("weeks");

  // Fetch published models, sorted by creation date
  // Fetching 20 models to split between two carousel rows (10 each)
  const result = await listModels({
    published: true,
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return <FeaturedModels models={result.items} />;
}

export default function LandingPage() {
  return (
    <main className="w-full bg-white dark:bg-black overflow-hidden">
      <Suspense>
        <Hero />
        <Suspense fallback={<FeaturedModelsSkeleton />}>
          <FeaturedModelsData />
        </Suspense>
        <About />
        <Portfolio />
        <Cta />
        <Footer />
      </Suspense>
    </main>
  );
}
