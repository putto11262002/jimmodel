import { ModelProfileSection } from "../_components/model-profile-section";
import { fetchPublishedModel } from "../_utils/fetch-model";

interface ProfileProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfileSlot({ params }: ProfileProps) {
  "use cache";

  const { id } = await params;
  const model = await fetchPublishedModel(id);

  return (
    <div className="bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <ModelProfileSection model={model} variant="compact" className="space-y-6" />
        </div>
      </div>
    </div>
  );
}
