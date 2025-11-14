import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { apiClient } from "@/lib/api/client";

type BulkUpdatePublishedInput = InferRequestType<typeof apiClient.api.models["bulk-publish"]["$patch"]>["json"];

export function useBulkUpdatePublished() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkUpdatePublishedInput) => {
      const response = await apiClient.api.models["bulk-publish"].$patch({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update models");
      }

      return response.json();
    },

    onSuccess: () => {
      // Invalidate all model queries (lists and details)
      queryClient.invalidateQueries({
        queryKey: ["/api/models"],
      });
    },
  });
}
