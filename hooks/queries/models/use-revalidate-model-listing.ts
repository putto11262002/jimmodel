import { apiClient } from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook to revalidate model listing cache
 * Invalidates ["models"] tag on the public site
 */
export function useRevalidateModelListing() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.api.models.revalidate.listing.$patch();
      if (!response.ok) {
        throw new Error("Failed to revalidate model listing cache");
      }
      return response.json();
    },
  });
}
