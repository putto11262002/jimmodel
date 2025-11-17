/**
 * Authorization Helper Utilities for Hono API Routes
 *
 * These helpers work with the auth middleware to enforce authorization in route handlers.
 * They abstract away Better Auth implementation details and provide a clean API.
 */

import type { Context } from "hono";

/**
 * Authorization error response factory
 * Returns a function that creates a 401 Unauthorized JSON response
 */
type AuthErrorResponse = () => Response;

/**
 * Checks if the current request is authenticated
 *
 * Returns null if authenticated, or an error response factory if not authenticated.
 * This pattern allows for early returns in route handlers.
 *
 * Usage:
 * ```typescript
 * export const protectedRoutes = new Hono()
 *   .use('*', authMiddleware)
 *   .get('/', (c) => {
 *     const authError = requireAuth(c)
 *     if (authError) return authError()
 *
 *     // User is authenticated, proceed with logic
 *     const user = c.var.user
 *   })
 * ```
 *
 * @param c - Hono context with auth variables (user, session)
 * @returns null if authenticated, or error response factory if not
 */
export function requireAuth(c: Context): AuthErrorResponse | null {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    return () => c.json({ error: "Unauthorized" }, 401);
  }

  return null;
}
