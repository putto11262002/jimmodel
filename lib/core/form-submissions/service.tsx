/**
 * Core form submissions service
 * Platform-independent business logic for form submission operations
 * Includes both public contact form submission and admin management operations
 */

import { db } from "@/db";
import { formSubmissions } from "@/db/schema";
import { createPaginatedResult } from "@/lib/types/common";
import { sendEmail, type EmailSendResult } from "@/lib/core/email/service";
import { ContactFormNotificationEmail, type ContactFormEmailData } from "@/lib/core/form-submissions/email-templates";
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
 * Send contact form notification email to admin recipients
 * This is a non-blocking operation - errors are logged but don't throw
 */
export async function sendContactFormNotificationToAdmins(
  formData: ContactFormEmailData,
  options?: {
    subject?: string;
    additionalRecipients?: string[];
  },
): Promise<EmailSendResult> {
  // Get admin notification emails from environment
  const adminEmails = process.env.ADMIN_NOTIFICATION_EMAILS?.split(",").map(email => email.trim()).filter(Boolean);

  if (!adminEmails || adminEmails.length === 0) {
    console.log("Email sending skipped: ADMIN_NOTIFICATION_EMAILS not configured");
    return {
      success: false,
      error: "No admin notification emails configured",
    };
  }

  const recipients = [
    ...adminEmails,
    ...(options?.additionalRecipients || []),
  ];

  if (recipients.length === 0) {
    return {
      success: false,
      error: "No recipients available",
    };
  }

  // Build from address from environment variables
  const fromEmail = process.env.FROM_EMAIL;
  const fromName = process.env.FROM_NAME;

  if (!fromEmail || !fromName) {
    console.warn("Email sending skipped: FROM_EMAIL and FROM_NAME environment variables not configured");
    return {
      success: false,
      error: "Email configuration incomplete - FROM_EMAIL and FROM_NAME required",
    };
  }

  const fromAddress = `${fromName} <${fromEmail}>`;

  return sendEmail({
    from: fromAddress,
    to: recipients,
    subject: options?.subject || `New Contact Form: ${formData.subject}`,
    replyTo: formData.email,
    react: <ContactFormNotificationEmail formData={formData} />,
  });
}

/**
 * Submit a contact form (public)
 * Creates a new form submission record with status "new"
 * Sends email notification to admin recipients after successful save
 */
export async function submitContactForm(input: SubmitContactFormInput) {
  // Save form submission to database
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

  // Send email notification to admins (non-blocking)
  // This runs in the background and doesn't affect form submission success
  try {
    await sendContactFormNotificationToAdmins({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      subject: submission.subject,
      message: submission.message,
      submittedAt: submission.createdAt,
    }).catch((error) => {
      // Log email error but don't fail the form submission
      console.error("Failed to send contact form notification email:", error);
    });
  } catch (error) {
    // Log any unexpected errors but don't fail the form submission
    console.error("Unexpected error sending contact form notification email:", error);
  }

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
