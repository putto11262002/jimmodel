import { apiClient } from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook to revalidate all model profile caches
 * Invalidates ["model"] tag on the public site
 */
export function useRevalidateAllProfiles() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.api.models.revalidate["all-profiles"].$patch();
      if (!response.ok) {
        throw new Error("Failed to revalidate all model profile caches");
      }
      return response.json();
    },
  });
}
