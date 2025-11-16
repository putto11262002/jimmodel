/**
 * Form submissions service input types
 * Platform-independent TypeScript types for form submission operations
 * Includes both public contact form submission and admin management operations
 */

import type { FormSubmissionSubject } from "@/lib/data/form-submission-subjects";

/**
 * Form submission status
 */
export type FormSubmissionStatus = "new" | "read" | "responded";

/**
 * Submit contact form input (public)
 */
export interface SubmitContactFormInput {
  name: string;
  email: string;
  phone?: string | null;
  subject: FormSubmissionSubject;
  message: string;
}

/**
 * List form submissions input with pagination, sorting, and filters
 */
export interface ListFormSubmissionsInput {
  page: number;
  limit: number;
  subject?: FormSubmissionSubject;
  status?: FormSubmissionStatus;
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Get form submission by ID input
 */
export interface GetFormSubmissionInput {
  id: string;
}

/**
 * Update form submission status input
 */
export interface UpdateFormSubmissionStatusInput {
  id: string;
  status: FormSubmissionStatus;
}

/**
 * Delete form submission input
 */
export interface DeleteFormSubmissionInput {
  id: string;
}

/**
 * Bulk delete form submissions input
 */
export interface BulkDeleteFormSubmissionsInput {
  ids: string[];
}
