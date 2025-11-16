import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { listModels } from "@/lib/core/models/service";
import type { Category } from "@/lib/data/categories";
import { CATEGORIES } from "@/lib/data/categories";
import { Users } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { ModelCard } from "./_components/model-card";
import { Pagination } from "./_components/pagination";

interface PageProps {
  params: Promise<{
    category: string;
    page?: string[];
  }>;
}

// Generate static params for all categories with first page
export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    category,
    page: ["1"],
  }));
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  "use cache";
  const { category } = await params;

  // Capitalize category for title
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${categoryTitle} Models | JimModel`,
    description: `Browse our collection of ${categoryTitle.toLowerCase()} models. Professional modeling agency with diverse talent.`,
  };
}

export default async function ModelListingPage({ params }: PageProps) {
  "use cache";
  const { category, page: pageParam } = await params;
  cacheLife("weeks");
  cacheTag("models", category);

  // Validate category
  if (!CATEGORIES.includes(category as Category)) {
    notFound();
  }

  // Parse page number - use first item in array, default to "1" if undefined
  const pageString = pageParam?.[0] ?? "1";
  const page = parseInt(pageString, 10);
  const limit = 12; // 12 models per page

  // Validate page number
  if (isNaN(page) || page < 1) {
    notFound();
  }

  // Fetch models from service (server-side)
  const result = await listModels({
    category: category as Category,
    published: true, // Only show published models on public pages
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // If page number exceeds total pages, show 404
  if (page > result.totalPages && result.totalPages > 0) {
    notFound();
  }

  // Capitalize category for display
  const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-3 md:py-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem key="home">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator key="sep-1" />
              <BreadcrumbItem key="models">
                <BreadcrumbLink href="/models">Models</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator key="sep-2" />
              <BreadcrumbItem key="category">
                <BreadcrumbPage>{categoryDisplay}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Model Grid */}
        {result.items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No Models Found
            </h2>
            <p className="text-muted-foreground">
              We don&apos;t have any {categoryDisplay.toLowerCase()} models
              available at the moment. Please check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {result.items.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>

            {/* Pagination */}
            {result.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={result.page}
                  totalPages={result.totalPages}
                  category={category}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
