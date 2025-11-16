import { apiClient } from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook to revalidate a specific model profile cache
 * Invalidates ["model", id] tags on the public site
 */
export function useRevalidateModelProfile() {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await apiClient.api.models[":id"].revalidate.$patch({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("Failed to revalidate model profile cache");
      }
      return response.json();
    },
  });
}
