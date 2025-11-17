/**
 * Signin form validators
 * Used by the admin signin page
 */

import { z } from "zod";

/**
 * Signin form schema
 * Email and password validation for Better Auth authentication
 */
export const signinFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export type SigninFormInput = z.infer<typeof signinFormSchema>;
