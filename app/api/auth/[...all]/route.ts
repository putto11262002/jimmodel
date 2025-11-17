import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API Route Handler
 *
 * This catch-all route handles all Better Auth operations:
 * - POST /api/auth/sign-up/email - Register new user
 * - POST /api/auth/sign-in/email - Sign in with email/password
 * - POST /api/auth/sign-out - Sign out current user
 * - GET /api/auth/session - Get current session
 * - POST /api/auth/update-user - Update user profile
 * - POST /api/auth/change-password - Change user password
 * - POST /api/auth/forget-password - Request password reset
 * - POST /api/auth/reset-password - Reset password with token
 *
 * All authentication logic is handled by Better Auth.
 * The toNextJsHandler adapter converts Better Auth handlers to Next.js route handlers.
 */
export const { GET, POST } = toNextJsHandler(auth);
