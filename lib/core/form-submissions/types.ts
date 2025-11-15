/**
 * Form submissions service input types
 * Platform-independent TypeScript types for admin form submission operations
 */

/**
 * Form submission status
 */
export type FormSubmissionStatus = "new" | "read" | "responded";

/**
 * List form submissions input with pagination, sorting, and filters
 */
export interface ListFormSubmissionsInput {
  page: number;
  limit: number;
  subject?: string;
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
