/**
 * Server action for contact form submission
 * Thin wrapper around core contact service
 */

"use server";

import { submitContactFormSchema, type SubmitContactFormInput } from "./validator";
import * as formSubmissionsService from "@/lib/core/form-submissions/service";
import { ActionErrorCode, error } from "@/actions";
import { success } from "@/actions/common/utils";
import type { ServerAction } from "@/actions/common/types";

/**
 * Submit contact form
 * Public action - no authentication required
 * Creates a new form submission with status "new"
 */
export const submitContactForm: ServerAction<
  SubmitContactFormInput,
  Awaited<ReturnType<typeof formSubmissionsService.submitContactForm>>
> = async (input) => {
  try {
    // Validate with Zod schema
    const parseResult = submitContactFormSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // Execute service (no authentication required for public contact form)
    const result = await formSubmissionsService.submitContactForm(parseResult.data);
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to submit contact form";
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};
