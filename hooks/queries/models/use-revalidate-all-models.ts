import { apiClient } from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook to revalidate all model caches (listing + all profiles)
 * Invalidates both ["models"] and ["model"] tags on the public site
 */
export function useRevalidateAllModels() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.api.models.revalidate.all.$patch();
      if (!response.ok) {
        throw new Error("Failed to revalidate all model caches");
      }
      return response.json();
    },
  });
}
