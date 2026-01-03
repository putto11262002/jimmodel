import type { Category } from "@/lib/core/models/types";

interface CategoryOverlayProps {
  category: Category;
}

export function CategoryOverlay({ category }: CategoryOverlayProps) {
  const categoryDisplay =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-b from-black/40 via-black/50 to-black/60 backdrop-blur-sm">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
        {categoryDisplay}
      </h2>
    </div>
  );
}
