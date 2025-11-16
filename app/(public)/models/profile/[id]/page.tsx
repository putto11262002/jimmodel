import { getModel, listModels } from "@/lib/core/models/service";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { ModelProfileSection } from "./_components/model-profile-section";
import { PortfolioTabs } from "./_components/portfolio-tabs";
import { fetchPublishedModel } from "./_utils/fetch-model";

interface PageProps {
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

export default async function ModelProfilePage({ params }: PageProps) {
  "use cache";
  const { id } = await params;
  cacheLife("weeks");
  cacheTag("models", "profile", id);

  // Fetch published model
  const model = await fetchPublishedModel(id);

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
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto">
          <ModelProfileSection model={model} variant="full" />
        </div>
      </div>

      {/* Portfolio Gallery Section with Tabs */}
      <div className="bg-muted/20 py-6 md:py-8 lg:py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
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
