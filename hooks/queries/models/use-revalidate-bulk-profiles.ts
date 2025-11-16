import { apiClient } from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";

type BulkRevalidateInput = InferRequestType<
  typeof apiClient.api.models.revalidate.bulk.$patch
>["json"];

/**
 * Hook to revalidate multiple model profile caches
 * Invalidates ["model", id] tags for each model on the public site
 */
export function useRevalidateBulkProfiles() {
  return useMutation({
    mutationFn: async (data: BulkRevalidateInput) => {
      const response = await apiClient.api.models.revalidate.bulk.$patch({
        json: data,
      });
      if (!response.ok) {
        throw new Error("Failed to revalidate model profile caches");
      }
      return response.json();
    },
  });
}
