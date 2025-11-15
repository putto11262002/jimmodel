import { cacheLife } from "next/cache";
import { ModelProfileSection } from "../_components/model-profile-section";
import { fetchPublishedModel } from "../_utils/fetch-model";

interface ProfileProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfileSlot({ params }: ProfileProps) {
  "use cache";
  cacheLife({
    stale: 60 * 60 * 24 * 30, // 30 days - revalidate monthly
    revalidate: 60 * 60 * 24 * 30, // 30 days
  });

  const { id } = await params;
  const model = await fetchPublishedModel(id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <ModelProfileSection model={model} variant="full" />
        </div>
      </div>
    </div>
  );
}
