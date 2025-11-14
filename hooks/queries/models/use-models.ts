import { apiClient, toQueryParams } from "@/lib/api/client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

type ModelsResponse = InferResponseType<typeof apiClient.api.models["$get"], 200>;

interface UseModelsOptions {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  category?: string;
  published?: boolean;
  local?: boolean;
  inTown?: boolean;
}

export function useModels(
  options?: UseModelsOptions,
): UseQueryResult<ModelsResponse> {
  const queryKey = options ? ["/api/models", options] : ["/api/models"];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.api.models.$get({
        query: options ? (toQueryParams(options) as any) : undefined, // Type assertion: toQueryParams converts to strings
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch models");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
