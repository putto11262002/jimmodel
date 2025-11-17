import { cacheComponentConfig } from "@/config/cache-component";
import { getModel, listModels } from "@/lib/core/models/service";
import { CATEGORIES } from "@/lib/data/categories";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ModelProfileSection } from "./_components/model-profile-section";
import { PortfolioTabs } from "./_components/portfolio-tabs";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const _getModel = cache(async (id: string) => {
  "use cache"; // define cache derieective here because need id for tag
  cacheLife(cacheComponentConfig.modelProfile.profile);
  cacheTag(...cacheComponentConfig.modelProfile.tag(id));
  const model = await getModel({ id });
  if (!model.published) {
    notFound();
  }
  return model;
});

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return Promise.all(
    CATEGORIES.map(async (category) => {
      return listModels({
        category: category,
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    }),
  ).then((models) =>
    models.map((model) => model.items.map((m) => ({ id: m.id }))).flat(),
  );
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const model = await _getModel(id);

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

export default async function ModelProfilePage({ params }: PageProps) {
  "use cache"; // define cache derieective here because need id for tag
  const { id } = await params;
  cacheLife(cacheComponentConfig.modelProfile.profile);
  cacheTag(...cacheComponentConfig.modelProfile.tag(id));

  // Fetch published model
  const model = await _getModel(id);

  // Calculate image counts by type
  const counts = {
    all: model.images.length,
    book: model.images.filter((img) => img.type === "book").length,
    polaroid: model.images.filter((img) => img.type === "polaroid").length,
    composite: model.images.filter((img) => img.type === "composite").length,
  };

  return (
    <div>
      {/* Profile Section */}
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            <ModelProfileSection model={model} />

            {/* Portfolio Gallery Section with Tabs */}
            <PortfolioTabs
              images={model.images}
              modelName={model.name}
              counts={counts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
