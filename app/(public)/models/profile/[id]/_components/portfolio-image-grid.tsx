import Image from "next/image";
import type { getModel } from "@/lib/core/models/service";

type Model = Awaited<ReturnType<typeof getModel>>;
type PortfolioImage = Model["images"][number];

interface PortfolioImageGridProps {
  images: PortfolioImage[];
  modelName: string;
  imageType?: string;
  className?: string;
}

function getImageTypeLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function EmptyState({ imageType }: { imageType?: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <svg
          className="w-12 h-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {imageType ? `No ${getImageTypeLabel(imageType)} Images` : "No Portfolio Images"}
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        {imageType
          ? `This model doesn't have any ${imageType} images in their portfolio yet.`
          : "This model doesn't have any portfolio images yet."}
      </p>
    </div>
  );
}

export function PortfolioImageGrid({
  images,
  modelName,
  imageType,
  className,
}: PortfolioImageGridProps) {
  if (images.length === 0) {
    return <EmptyState imageType={imageType} />;
  }

  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  const altText = imageType
    ? `${modelName} - ${getImageTypeLabel(imageType)}`
    : `${modelName} - Portfolio`;

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {sortedImages.map((image) => (
          <div
            key={image.id}
            className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted group"
          >
            <Image
              src={image.url}
              alt={altText}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
