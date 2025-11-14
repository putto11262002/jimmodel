import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { apiClient } from "@/lib/api/client";

type CreateModelInput = InferRequestType<typeof apiClient.api.models["$post"]>["json"];

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateModelInput) => {
      const response = await apiClient.api.models.$post({ json: data });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create model");
      }

      return response.json();
    },

    onSuccess: () => {
      // Invalidate all model list queries
      queryClient.invalidateQueries({
        queryKey: ["/api/models"],
      });
    },
  });
}
