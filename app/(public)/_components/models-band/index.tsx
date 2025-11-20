import { listModels } from "@/lib/core/models/service";
import { ModelBandClient } from "./client";

export async function ModelBand() {
  const result = await listModels({
    published: true,
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return <ModelBandClient models={result.items} />;
}
