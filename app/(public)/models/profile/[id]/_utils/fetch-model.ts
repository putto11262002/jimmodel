import { getModel } from "@/lib/core/models/service";
import { notFound } from "next/navigation";

/**
 * Fetches a model by ID and validates it's published
 * @param id - Model ID
 * @returns Published model or calls notFound()
 */
export async function fetchPublishedModel(id: string) {
  let model;
  try {
    model = await getModel({ id });
  } catch {
    notFound();
  }

  // Verify model is published
  if (!model.published) {
    notFound();
  }

  return model;
}
