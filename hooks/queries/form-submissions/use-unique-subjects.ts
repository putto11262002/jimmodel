import { apiClient } from "@/lib/api/client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

type UniqueSubjectsResponse = InferResponseType<
  typeof apiClient.api["form-submissions"]["subjects"]["$get"],
  200
>;

export function useUniqueSubjects(): UseQueryResult<UniqueSubjectsResponse> {
  return useQuery({
    queryKey: ["/api/form-submissions/subjects"],
    queryFn: async () => {
      const response = await apiClient.api["form-submissions"]["subjects"].$get();

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch unique subjects");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - subjects don't change frequently
  });
}
