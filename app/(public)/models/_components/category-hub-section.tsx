"use client";

import Link from "next/link";
import type { Category, Model, ModelImage } from "@/lib/core/models/types";
import { CategoryOverlay } from "./category-overlay";
import {
  Pattern1Female,
  Pattern1FeatureMobile,
  Pattern2Male,
  Pattern2MaleMobile,
  Pattern3NonBinary,
  Pattern3NonBinaryMobile,
  Pattern4Kids,
  Pattern4KidsMobile,
  Pattern5Seniors,
  Pattern5SeniorsMobile,
} from "./bento-grid-patterns";

type PatternType = "pattern1" | "pattern2" | "pattern3" | "pattern4" | "pattern5";

interface CategoryHubSectionProps {
  category: Category;
  models: (Model & { images: ModelImage[] })[];
  count: number;
  pattern: PatternType;
}

function getPatternComponents(
  pattern: PatternType,
): {
  desktop: React.ComponentType<{ images: (ModelImage & { modelName?: string })[] }>;
  mobile: React.ComponentType<{ images: (ModelImage & { modelName?: string })[] }>;
} {
  switch (pattern) {
    case "pattern1":
      return { desktop: Pattern1Female, mobile: Pattern1FeatureMobile };
    case "pattern2":
      return { desktop: Pattern2Male, mobile: Pattern2MaleMobile };
    case "pattern3":
      return { desktop: Pattern3NonBinary, mobile: Pattern3NonBinaryMobile };
    case "pattern4":
      return { desktop: Pattern4Kids, mobile: Pattern4KidsMobile };
    case "pattern5":
      return { desktop: Pattern5Seniors, mobile: Pattern5SeniorsMobile };
  }
}

export function CategoryHubSection({
  category,
  models,
  count,
  pattern,
}: CategoryHubSectionProps) {
  const { desktop: DesktopPattern, mobile: MobilePattern } =
    getPatternComponents(pattern);

  // Prepare images for bento grid with model names
  const imagesWithNames = models.map((model) => ({
    ...model.images[0],
    modelName: model.name,
  }));

  return (
    <Link href={`/models/${category}`} className="group block">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
        {/* Desktop Pattern */}
        <DesktopPattern images={imagesWithNames} />

        {/* Mobile Pattern */}
        <MobilePattern images={imagesWithNames} />

        {/* Overlay */}
        <CategoryOverlay category={category} count={count} showCount />
      </div>
    </Link>
  );
}
