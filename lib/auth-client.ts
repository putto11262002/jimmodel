"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client Instance
 *
 * This is the client-side auth instance for use in React components.
 * It provides hooks and methods for authentication operations:
 *
 * Hooks:
 * - useSession() - Get current session and user data
 * - useActiveOrganization() - Get active organization (if multi-tenancy is enabled)
 *
 * Methods:
 * - signIn.email({ email, password }) - Sign in with email/password
 * - signUp.email({ email, password, name }) - Sign up new user
 * - signOut() - Sign out current user
 * - updateUser({ name, image }) - Update user profile
 *
 * Usage:
 * ```tsx
 * import { authClient } from "@/lib/auth-client";
 *
 * function MyComponent() {
 *   const { data: session, isPending } = authClient.useSession();
 *
 *   const handleSignIn = async () => {
 *     await authClient.signIn.email({
 *       email: "user@example.com",
 *       password: "password123"
 *     });
 *   };
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

/**
 * Re-export commonly used hooks for convenience
 */
export const { useSession } = authClient;
