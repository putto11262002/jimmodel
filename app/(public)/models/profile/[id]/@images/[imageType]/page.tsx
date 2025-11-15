import { notFound } from "next/navigation";
import { PortfolioImageGrid } from "../../_components/portfolio-image-grid";
import { fetchPublishedModel } from "../../_utils/fetch-model";

interface ImageTypePageProps {
  params: Promise<{
    id: string;
    imageType: string;
  }>;
}

const VALID_IMAGE_TYPES = ["book", "polaroid", "composite"] as const;
type ImageType = (typeof VALID_IMAGE_TYPES)[number];

function isValidImageType(type: string): type is ImageType {
  return VALID_IMAGE_TYPES.includes(type as ImageType);
}

// Generate static params using top-down approach
// Parent layout generates [id], this generates [imageType] for each id
export async function generateStaticParams({
  params,
}: {
  params: { id: string };
}) {
  // Receives each model id from parent layout
  // Note: We don't need to use the id value here

  // Return all valid image types for each model
  return VALID_IMAGE_TYPES.map((imageType) => ({
    imageType,
  }));
}

export default async function ImageTypePage({ params }: ImageTypePageProps) {
  "use cache";
  const { id, imageType } = await params;

  // Validate image type
  if (!isValidImageType(imageType)) {
    notFound();
  }

  const model = await fetchPublishedModel(id);

  // Filter images by type
  const filteredImages = model.images.filter((img) => img.type === imageType);

  return (
    <PortfolioImageGrid
      images={filteredImages}
      modelName={model.name}
      imageType={imageType}
    />
  );
}
