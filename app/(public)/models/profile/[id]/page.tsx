import { cacheComponentConfig } from "@/config/cache-component";
import { getModel } from "@/lib/core/models/service";
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

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  "use cache"; // define cache derieective here because need id for tag
  const { id } = await params;
  cacheLife(cacheComponentConfig.modelListing.profile);
  cacheTag(...cacheComponentConfig.modelProfile.tag(id));

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
  "use cache"; // define cache derieective here because need id for tag
  const { id } = await params;
  cacheLife(cacheComponentConfig.modelListing.profile);
  cacheTag(...cacheComponentConfig.modelProfile.tag(id));

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
