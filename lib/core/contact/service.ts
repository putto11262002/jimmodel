/**
 * Contact service
 * Platform-independent business logic for contact form submissions
 */

import { db } from "@/db";
import { formSubmissions } from "@/db/schema";
import type { SubmitContactFormInput } from "./types";

/**
 * Submit a contact form
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
