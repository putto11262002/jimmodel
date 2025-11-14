import { apiClient } from "@/lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadPortfolioImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      modelId,
      file,
      type,
      order,
    }: {
      modelId: string;
      file: File;
      type?: string;
      order?: number;
    }) => {
      const response = await apiClient.api.models[":id"].images.$post({
        param: { id: modelId },
        form: {
          file,
          type,
          order: order !== undefined ? String(order) : undefined,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
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
