import { DualCta } from "@/app/(public)/_components/dual-cta";
import { Hero } from "@/app/(public)/_components/hero";
import { PortfolioShowcase } from "@/app/(public)/_components/portfolio-showcase";
import { TrustIndicators } from "@/app/(public)/_components/trust-indicators";
import { cacheComponentConfig } from "@/config/cache-component";
import { cacheLife, cacheTag } from "next/cache";
import { ModelBand } from "./_components/models-band";

export default async function LandingPage() {
  "use cache";
  cacheLife(cacheComponentConfig.ladingPage.profile);
  cacheTag(...cacheComponentConfig.ladingPage.tag);
  return (
    <main className="w-full bg-background">
      <Hero />
      <TrustIndicators />
      <ModelBand />
      <div className="hidden lg:block">
        <PortfolioShowcase />
      </div>
      <DualCta />
    </main>
  );
}
