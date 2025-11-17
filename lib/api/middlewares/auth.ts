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
 * Use isAuth middleware on routes that require authentication.
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

/**
 * Auth guard middleware that ensures a request is authenticated
 *
 * This middleware checks if user and session exist in context.
 * If authentication fails, it responds with 401 Unauthorized and stops execution.
 *
 * Usage:
 * ```typescript
 * import { isAuth } from '@/lib/api/middlewares/auth'
 *
 * export const routes = new Hono()
 *   .get('/public', (c) => c.json({ message: 'Public route' }))
 *   .post('/protected', isAuth, (c) => {
 *     const user = c.var.user // Guaranteed to exist
 *     return c.json({ user })
 *   })
 * ```
 */
export const isAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const user = c.get("user");
    const session = c.get("session");

    if (!user || !session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await next();
  },
);
