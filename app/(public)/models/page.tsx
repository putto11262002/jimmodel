import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cacheComponentConfig } from "@/config/cache-component";
import { getModelsForCategoryHub } from "@/lib/core/models/service";
import { CategoryHubSection } from "./_components/category-hub-section";
import { getCategoryPattern } from "./_utils/pattern-mapper";

export const metadata: Metadata = {
  title: "Models",
  description:
    "Discover our diverse roster of models across different categories. Browse female, male, kids, seniors, and non-binary talent.",
};

export default async function ModelsPage() {
  "use cache";
  const { stale, revalidate, expire } = cacheComponentConfig.categoryHub.profile;

  // This tells Next.js to cache this page
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  stale, revalidate, expire;

  const categoryData = await getModelsForCategoryHub();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Models</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-2">
            Our Talent
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse roster of professional models across all categories.
          </p>
        </div>
      </div>

      {/* Category Hub Grid */}
      <div className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categoryData.map((category) => (
            <CategoryHubSection
              key={category.category}
              category={category.category}
              models={category.models}
              count={category.count}
              pattern={getCategoryPattern(category.category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
