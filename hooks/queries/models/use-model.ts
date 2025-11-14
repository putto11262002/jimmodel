import { apiClient } from "@/lib/api/client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

type ModelResponse = InferResponseType<typeof apiClient.api.models[":id"]["$get"], 200>;

export function useModel(id: string | undefined): UseQueryResult<ModelResponse> {
  return useQuery({
    queryKey: ["/api/models", id!],
    queryFn: async () => {
      const response = await apiClient.api.models[":id"].$get({
        param: { id: id! },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch model");
      }

      return response.json();
    },
    enabled: !!id, // Only run query when ID exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
