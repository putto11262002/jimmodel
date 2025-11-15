/**
 * Contact service input types
 * Platform-independent TypeScript types for contact form operations
 */

/**
 * Form submission status
 */
export type FormSubmissionStatus = "new" | "read" | "responded";

/**
 * Submit contact form input
 */
export interface SubmitContactFormInput {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}
