import { apiClient, toQueryParams } from "@/lib/api/client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

type FormSubmissionsResponse = InferResponseType<
  typeof apiClient.api["form-submissions"]["$get"],
  200
>;

interface UseFormSubmissionsOptions {
  page?: number;
  limit?: number;
  subject?: string;
  status?: "new" | "read" | "responded";
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
}

export function useFormSubmissions(
  options?: UseFormSubmissionsOptions,
): UseQueryResult<FormSubmissionsResponse> {
  const queryKey = options
    ? ["/api/form-submissions", options]
    : ["/api/form-submissions"];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.api["form-submissions"].$get({
        query: options ? (toQueryParams(options) as any) : undefined,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch form submissions");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
