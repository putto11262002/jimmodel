import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

/**
 * Better Auth Server Instance
 *
 * This is the server-side auth configuration using Better Auth with Drizzle ORM.
 * It handles email/password authentication with the following features:
 * - User registration and login
 * - Session management
 * - Password hashing (bcrypt)
 * - CSRF protection
 *
 * Environment Variables Required:
 * - BETTER_AUTH_SECRET: Random secret key (min 32 characters)
 * - BETTER_AUTH_URL: Base URL of the application
 * - BETTER_AUTH_TRUST_HOST: Set to true for local development
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true when email provider is configured
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24, // 1 day - update session if older than this
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "jimmodel",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  trustedOrigins: process.env.BETTER_AUTH_URL
    ? [process.env.BETTER_AUTH_URL]
    : [],
});

/**
 * Type-safe auth session type
 * Inferred from Better Auth configuration
 */
export type AuthSession = typeof auth.$Infer.Session;
