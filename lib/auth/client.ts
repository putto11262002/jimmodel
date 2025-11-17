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
 * import { signIn, signUp, useSession } from "@/lib/auth/client";
 *
 * function MyComponent() {
 *   const { data: session, isPending } = useSession();
 *
 *   const handleSignIn = async () => {
 *     await signIn.email({
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
  baseURL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000",
});

/**
 * Re-export commonly used auth methods and hooks for convenience
 */
export const { signIn, signUp, useSession } = authClient;
