import { apiClient } from "@/lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ modelId, file }: { modelId: string; file: File }) => {
      const response = await apiClient.api.models[":id"]["profile-image"].$post(
        {
          param: { id: modelId },
          form: {
            file,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload profile image");
      }

      return response.json();
    },

    onSuccess: (_, variables) => {
      // Invalidate model detail (includes profile image URL)
      queryClient.invalidateQueries({
        queryKey: ["/api/models", variables.modelId],
      });

      // Invalidate collection (model might appear in lists with profile image)
      queryClient.invalidateQueries({
        queryKey: ["/api/models"],
      });
    },
  });
}
