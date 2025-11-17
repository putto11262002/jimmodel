import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { AuthSessionData } from "./types";

/**
 * Core Auth Service
 *
 * Platform-independent authentication service functions.
 * These functions provide a clean interface to auth operations
 * and can be used in Server Actions, API routes, and Server Components.
 */

/**
 * Get the current authenticated session
 *
 * @returns AuthSessionData if authenticated, null otherwise
 *
 * Usage in Server Components:
 * ```tsx
 * const session = await getCurrentSession();
 * if (!session) {
 *   redirect('/login');
 * }
 * ```
 */
export async function getCurrentSession(): Promise<AuthSessionData | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
      image: session.user.image ?? null,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
    },
    session: {
      id: session.session.id,
      userId: session.session.userId,
      expiresAt: session.session.expiresAt,
    },
  };
}

/**
 * Get the current authenticated user
 *
 * @returns User if authenticated, null otherwise
 *
 * Usage:
 * ```tsx
 * const user = await getCurrentUser();
 * if (!user) {
 *   return <div>Please log in</div>;
 * }
 * ```
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

/**
 * Require authentication - throws error if not authenticated
 *
 * @returns AuthSessionData
 * @throws Error if not authenticated
 *
 * Usage in Server Actions:
 * ```tsx
 * export async function deleteModel(id: string) {
 *   const session = await requireAuth();
 *   // User is guaranteed to be authenticated here
 *   // Proceed with delete operation
 * }
 * ```
 */
export async function requireAuth(): Promise<AuthSessionData> {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error("Authentication required");
  }

  return session;
}

/**
 * Check if a user is authenticated
 *
 * @returns boolean indicating if user is authenticated
 *
 * Usage:
 * ```tsx
 * const isAuthenticated = await isAuth();
 * ```
 */
export async function isAuth(): Promise<boolean> {
  const session = await getCurrentSession();
  return session !== null;
}

/**
 * Get user by ID
 *
 * @param userId - User ID to fetch
 * @returns User data or null if not found
 *
 * Note: This function uses the database directly and does not check authentication.
 * Use getCurrentUser() if you need the currently authenticated user.
 */
export async function getUserById(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.id !== userId) {
    return null;
  }

  return session.user;
}
