import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useBulkDeleteSubmissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await apiClient.api["form-submissions"]["bulk-delete"].$post({
        json: { ids },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to bulk delete submissions");
      }

      return response.json();
    },

    onSuccess: (_, ids) => {
      // Remove specific items from cache
      ids.forEach((id) => {
        queryClient.removeQueries({
          queryKey: ["/api/form-submissions", id],
        });
      });

      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: ["/api/form-submissions"],
      });
    },
  });
}
