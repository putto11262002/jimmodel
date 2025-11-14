import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { apiClient } from "@/lib/api/client";

type UpdateModelInput = InferRequestType<typeof apiClient.api.models[":id"]["$put"]>["json"];

export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateModelInput }) => {
      const response = await apiClient.api.models[":id"].$put({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update model");
      }

      return response.json();
    },

    onSuccess: (_, variables) => {
      // Invalidate specific model and nested resources
      queryClient.invalidateQueries({
        queryKey: ["/api/models", variables.id],
      });

      // Invalidate collection (item might appear in lists)
      queryClient.invalidateQueries({
        queryKey: ["/api/models"],
      });
    },
  });
}
