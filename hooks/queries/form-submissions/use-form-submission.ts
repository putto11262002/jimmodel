import { apiClient } from "@/lib/api/client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

type FormSubmissionResponse = InferResponseType<
  typeof apiClient.api["form-submissions"][":id"]["$get"],
  200
>;

export function useFormSubmission(
  id: string | undefined,
): UseQueryResult<FormSubmissionResponse> {
  return useQuery({
    queryKey: ["/api/form-submissions", id!],
    queryFn: async () => {
      const response = await apiClient.api["form-submissions"][":id"].$get({
        param: { id: id! },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch form submission");
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
