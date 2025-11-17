"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/client";

/**
 * Session data type from Better Auth
 * Inferred from the Better Auth client
 */
type Session = {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
  } | null;
};

/**
 * React Query hook for Better Auth session management
 *
 * Wraps Better Auth's session fetching in React Query for consistent
 * cache management across the application.
 *
 * Usage:
 * ```tsx
 * const { data, isPending, error } = useSession();
 *
 * if (isPending || !data) {
 *   return <LoadingSkeleton />;
 * }
 *
 * if (!data.session || !data.user) {
 *   // User not authenticated
 *   redirect("/admin/signin");
 * }
 *
 * // User is authenticated
 * return <div>Welcome {data.user.name}</div>;
 * ```
 */
export function useSession(): UseQueryResult<Session> {
  return useQuery({
    queryKey: ["/api/auth/session"],
    queryFn: async () => {
      const response = await fetch("/api/auth/get-session", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }

      const data = await response.json();
      return data as Session;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - session data is moderately stable
    retry: 1, // Only retry once for auth failures
    refetchOnWindowFocus: true, // Check session when user returns to tab
  });
}
