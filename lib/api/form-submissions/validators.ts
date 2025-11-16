/**
 * Form submissions API validators
 *
 * Zod schemas for validating form submission API requests.
 * Used at the API boundary (Hono routes).
 */

import { z } from "zod";
import { FORM_SUBMISSION_SUBJECTS } from "@/lib/data/form-submission-subjects";

// Common validators
export const uuidSchema = z.string().uuid("Invalid ID format");

// Pagination schemas
export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const sortOrderSchema = z.enum(["asc", "desc"]).default("desc");

// Status schema
export const formSubmissionStatusSchema = z.enum(["new", "read", "responded"]);

// Subject schema
export const formSubmissionSubjectSchema = z.enum(FORM_SUBMISSION_SUBJECTS);

/**
 * List form submissions query schema
 * For GET /api/form-submissions
 */
export const listFormSubmissionsQuerySchema = paginationQuerySchema.extend({
  subject: formSubmissionSubjectSchema.optional(),
  status: formSubmissionStatusSchema.optional(),
  sortBy: z.enum(["createdAt"]).optional().default("createdAt"),
  sortOrder: sortOrderSchema.optional(),
});

/**
 * Update form submission status schema
 * For PATCH /api/form-submissions/:id
 */
export const updateFormSubmissionStatusSchema = z.object({
  status: formSubmissionStatusSchema,
});

/**
 * Bulk delete form submissions schema
 * For DELETE /api/form-submissions/bulk
 */
export const bulkDeleteFormSubmissionsSchema = z.object({
  ids: z.array(uuidSchema).min(1, "At least one ID is required"),
});
