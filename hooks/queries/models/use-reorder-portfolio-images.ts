import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useReorderPortfolioImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      modelId,
      images,
    }: {
      modelId: string;
      images: Array<{ id: string; order: number }>;
    }) => {
      const response = await apiClient.api.models[":id"]["images"]["reorder"].$patch({
        param: { id: modelId },
        json: { images },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reorder images");
      }

      return response.json();
    },

    onSuccess: (_, variables) => {
      // Invalidate model detail (includes images)
      queryClient.invalidateQueries({
        queryKey: ["/api/models", variables.modelId],
      });
    },
  });
}
