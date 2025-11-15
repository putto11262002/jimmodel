import { PortfolioImageGrid } from "../_components/portfolio-image-grid";
import { fetchPublishedModel } from "../_utils/fetch-model";

interface ImagesDefaultProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ImagesDefault({ params }: ImagesDefaultProps) {
  "use cache";
  const { id } = await params;

  const model = await fetchPublishedModel(id);

  return (
    <PortfolioImageGrid images={model.images} modelName={model.name} />
  );
}
