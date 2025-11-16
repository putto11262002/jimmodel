/**
 * Core form submissions service
 * Platform-independent business logic for form submission operations
 * Includes both public contact form submission and admin management operations
 */

import { db } from "@/db";
import { formSubmissions } from "@/db/schema";
import { createPaginatedResult } from "@/lib/types/common";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import type {
  BulkDeleteFormSubmissionsInput,
  DeleteFormSubmissionInput,
  GetFormSubmissionInput,
  ListFormSubmissionsInput,
  SubmitContactFormInput,
  UpdateFormSubmissionStatusInput,
} from "./types";

/**
 * Submit a contact form (public)
 * Creates a new form submission record with status "new"
 */
export async function submitContactForm(input: SubmitContactFormInput) {
  const [submission] = await db
    .insert(formSubmissions)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      status: "new",
    })
    .returning();

  return submission;
}

/**
 * List form submissions with pagination, filtering, and search
 * Supports filtering by status and searching across name, email, and subject
 */
export async function listFormSubmissions(input: ListFormSubmissionsInput) {
  // Build WHERE conditions
  const conditions = [];

  // Status filter
  if (input.status) {
    conditions.push(eq(formSubmissions.status, input.status));
  }

  // Subject filter
  if (input.subject) {
    conditions.push(eq(formSubmissions.subject, input.subject));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Determine sort order (default: newest first)
  const sortOrder = input.sortOrder === "asc" ? "asc" : "desc";
  const orderBy =
    sortOrder === "asc"
      ? [formSubmissions.createdAt]
      : [desc(formSubmissions.createdAt)];

  // Fetch paginated results
  const items = await db
    .select()
    .from(formSubmissions)
    .where(whereClause)
    .orderBy(...orderBy)
    .limit(input.limit)
    .offset((input.page - 1) * input.limit);

  // Get total count
  const [{ total }] = await db
    .select({ total: count() })
    .from(formSubmissions)
    .where(whereClause);

  return createPaginatedResult(items, input.page, input.limit, total);
}

/**
 * Get a single form submission by ID
 */
export async function getFormSubmission(input: GetFormSubmissionInput) {
  const [submission] = await db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.id, input.id))
    .limit(1);

  if (!submission) {
    throw new Error("Form submission not found");
  }

  return submission;
}

/**
 * Update form submission status
 * Allows marking submissions as read or responded
 */
export async function updateFormSubmissionStatus(
  input: UpdateFormSubmissionStatusInput,
) {
  const [updatedSubmission] = await db
    .update(formSubmissions)
    .set({ status: input.status })
    .where(eq(formSubmissions.id, input.id))
    .returning();

  if (!updatedSubmission) {
    throw new Error("Form submission not found");
  }

  return updatedSubmission;
}

/**
 * Delete a form submission
 */
export async function deleteFormSubmission(input: DeleteFormSubmissionInput) {
  const [deletedSubmission] = await db
    .delete(formSubmissions)
    .where(eq(formSubmissions.id, input.id))
    .returning();

  if (!deletedSubmission) {
    throw new Error("Form submission not found");
  }

  return deletedSubmission;
}

/**
 * Bulk delete form submissions
 * Deletes multiple submissions by their IDs
 */
export async function bulkDeleteFormSubmissions(
  input: BulkDeleteFormSubmissionsInput,
) {
  if (input.ids.length === 0) {
    return { deletedCount: 0 };
  }

  const deletedSubmissions = await db
    .delete(formSubmissions)
    .where(inArray(formSubmissions.id, input.ids))
    .returning();

  return {
    deletedCount: deletedSubmissions.length,
    deletedIds: deletedSubmissions.map((s) => s.id),
  };
}

/**
 * Get all unique subjects from form submissions
 * Returns a list of all distinct subject values
 */
export async function getUniqueSubjects() {
  const results = await db
    .selectDistinct({ subject: formSubmissions.subject })
    .from(formSubmissions)
    .orderBy(formSubmissions.subject);

  return results.map((r) => r.subject);
}
