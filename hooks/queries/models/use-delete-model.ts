import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.api.models[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete model");
      }

      return response.json();
    },

    onSuccess: (_, id) => {
      // Remove specific item from cache
      queryClient.removeQueries({
        queryKey: ["/api/models", id],
      });

      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: ["/api/models"],
      });
    },
  });
}
