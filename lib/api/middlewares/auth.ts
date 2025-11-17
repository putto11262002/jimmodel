/**
 * Authentication Middleware for Hono API Routes
 *
 * This middleware integrates Better Auth with Hono to provide session-based authentication.
 * It retrieves the current session and user from Better Auth and stores them in the Hono context.
 *
 * Usage:
 * ```typescript
 * import { authMiddleware } from '@/lib/api/middlewares/auth'
 *
 * export const protectedRoutes = new Hono()
 *   .use('*', authMiddleware)
 *   .get('/', (c) => {
 *     const user = c.var.user
 *     const session = c.var.session
 *     // ... route handler
 *   })
 * ```
 *
 * Context Variables Added:
 * - c.var.user - Current authenticated user (or null if not authenticated)
 * - c.var.session - Current session (or null if not authenticated)
 */

import { auth } from "@/lib/auth";
import { createMiddleware } from "hono/factory";

/**
 * Type definition for auth context variables
 * These are available in route handlers via c.var.user and c.var.session
 */
type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

/**
 * Auth middleware that retrieves session and stores user/session in context
 *
 * This middleware does NOT block requests - it simply adds user/session to context.
 * Use requireAuth() helper in route handlers to enforce authentication.
 */
export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    // Get session from Better Auth using request headers
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    // Store user and session in context (null if not authenticated)
    c.set("user", session?.user ?? null);
    c.set("session", session?.session ?? null);

    await next();
  },
);
