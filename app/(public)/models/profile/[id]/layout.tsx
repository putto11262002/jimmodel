import { getModel, listModels } from "@/lib/core/models/service";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import type { ReactNode } from "react";
import { PortfolioNavigation } from "./_components/portfolio-navigation";

interface LayoutProps {
  children: ReactNode;
  profile: ReactNode;
  images: ReactNode;
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for existing models
export async function generateStaticParams() {
  const params = await getModelsIds();

  return params;
}

async function getModelsIds() {
  let more = true;
  let page = 1;
  const limit = 12;
  const modelsIds: { id: string }[] = [];
  while (more) {
    const result = await listModels({
      published: true,
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    more = page * limit < result.totalCount;
    page++;
    result.items.forEach((model) => {
      modelsIds.push({ id: model.id });
    });
  }
  return modelsIds;
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  "use cache";
  const { id } = await params;

  try {
    const model = await getModel({ id });

    return {
      title: `${model.name} | J.I.M. Model Profile`,
      description: model.bio || `View ${model.name}'s portfolio and details.`,
      openGraph: {
        title: `${model.name} | J.I.M. Model Profile`,
        description: model.bio || `View ${model.name}'s portfolio and details.`,
        images: model.profileImageURL ? [model.profileImageURL] : [],
      },
    };
  } catch {
    return {
      title: "Model Not Found | JimModel",
    };
  }
}

export default async function ModelDetailLayout({
  profile,
  images,
  params,
}: LayoutProps) {
  "use cache";
  const { id } = await params;
  cacheLife("weeks");
  cacheTag("models", "profile", id);

  // Fetch model to calculate image counts
  let model;
  try {
    model = await getModel({ id });
  } catch {
    // If model fetch fails, use zero counts
    model = null;
  }

  // Calculate image counts by type
  const counts = {
    all: model?.images.length || 0,
    book: model?.images.filter((img) => img.type === "book").length || 0,
    polaroid:
      model?.images.filter((img) => img.type === "polaroid").length || 0,
    composite:
      model?.images.filter((img) => img.type === "composite").length || 0,
  };

  return (
    <div>
      {/* Profile Section */}
      {profile}

      {/* Portfolio Gallery Section with Navigation */}
      <div className="bg-muted/20 py-6 md:py-8 lg:py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Navigation for image types */}
            <PortfolioNavigation modelId={id} counts={counts} />

            {/* Images slot - renders based on route */}
            <div className="min-h-[400px]">{images}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
