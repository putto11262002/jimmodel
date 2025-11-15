import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface UpdateSubmissionStatusInput {
  id: string;
  status: "new" | "read" | "responded";
}

export function useUpdateSubmissionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateSubmissionStatusInput) => {
      const response = await apiClient.api["form-submissions"][":id"].$patch({
        param: { id },
        json: { status },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update submission status");
      }

      return response.json();
    },

    onSuccess: (_, { id }) => {
      // Invalidate specific submission
      queryClient.invalidateQueries({
        queryKey: ["/api/form-submissions", id],
      });

      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: ["/api/form-submissions"],
      });
    },
  });
}
