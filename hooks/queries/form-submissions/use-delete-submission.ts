import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.api["form-submissions"][":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete submission");
      }

      return response.json();
    },

    onSuccess: (_, id) => {
      // Remove specific item from cache
      queryClient.removeQueries({
        queryKey: ["/api/form-submissions", id],
      });

      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: ["/api/form-submissions"],
      });
    },
  });
}
