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
      <div className="container mx-auto px-4 py-6 md:py-8">
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
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-3">
            Our Talent
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse roster of professional models across multiple categories.
            Find the perfect fit for your project.
          </p>
        </div>
      </div>

      {/* Category Hub Grid */}
      <div className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="space-y-12 md:space-y-16">
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
