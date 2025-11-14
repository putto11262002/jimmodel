"use client";

import { About } from "@/app/(public)/_components/about";
import { Cta } from "@/app/(public)/_components/cta";
import { FeaturedModels } from "@/app/(public)/_components/featured-models";
import { Footer } from "@/app/(public)/_components/footer";
import { Hero } from "@/app/(public)/_components/hero";
import { Portfolio } from "@/app/(public)/_components/portfolio";
import { Suspense } from "react";

export default function LandingPage() {
  return (
    <main className="w-full bg-white dark:bg-black overflow-hidden">
      <Suspense>
        <Hero />
        <FeaturedModels />
        <About />
        <Portfolio />
        <Cta />
        <Footer />
      </Suspense>
    </main>
  );
}
