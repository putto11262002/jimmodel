import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useDeletePortfolioImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, modelId }: { id: string; modelId: string }) => {
      const response = await apiClient.api.models.images[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete image");
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
