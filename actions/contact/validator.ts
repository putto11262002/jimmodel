/**
 * Contact form action validators
 *
 * Zod schemas for validating contact form inputs.
 * Used at the platform boundary (server actions).
 */

import { z } from "zod";

/**
 * Contact form subject categories
 */
export const contactSubjects = [
  "Model Application / Join Our Agency",
  "Book a Model / Client Inquiry",
  "General Question",
  "Partnership / Collaboration",
  "Media / Press Inquiry",
  "Current Model Support",
  "Other",
] as const;

export const contactSubjectEnum = z.enum(contactSubjects);

/**
 * Submit contact form schema
 */
export const submitContactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .max(50, "Phone must be less than 50 characters")
    .optional()
    .nullable(),
  subject: contactSubjectEnum,
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
});

export type SubmitContactFormInput = z.infer<typeof submitContactFormSchema>;
