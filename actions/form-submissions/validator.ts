/**
 * Contact form action validators
 *
 * Zod schemas for validating contact form inputs.
 * Used at the platform boundary (server actions).
 */

import { z } from "zod";
import { FORM_SUBMISSION_SUBJECTS } from "@/lib/data/form-submission-subjects";

/**
 * Contact form subject categories enum (Zod)
 */
export const contactSubjectEnum = z.enum(FORM_SUBMISSION_SUBJECTS);

/**
 * Re-export the subjects array for UI components
 */
export const contactSubjects = FORM_SUBMISSION_SUBJECTS;

/**
 * Phone number validation regex
 * Allows various formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
 * Also accepts international formats with + prefix
 */
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

/**
 * Submit contact form schema
 */
export const submitContactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Please tell us your name")
    .max(255, "Name should be less than 255 characters"),
  email: z
    .string()
    .min(1, "Please provide your email address")
    .email("Please enter a valid email address")
    .max(255, "Email should be less than 255 characters"),
  phone: z
    .string()
    .refine(
      (val) => val === "" || phoneRegex.test(val),
      "Please enter a valid phone number (e.g., +1 (555) 000-0000)"
    )
    .optional()
    .nullable(),
  subject: contactSubjectEnum.refine(
    (val) => val && val.length > 0,
    "Please select a subject category"
  ),
  message: z
    .string()
    .min(10, "Message should be at least 10 characters long")
    .max(5000, "Message should be less than 5000 characters"),
});

export type SubmitContactFormInput = z.infer<typeof submitContactFormSchema>;
