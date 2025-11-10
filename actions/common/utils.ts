/**
 * Server action utilities
 *
 * Helper functions for creating consistent action responses and handling errors.
 */

import { ActionState, ActionErrorCode } from "@/actions/common/types";

// Re-export ActionErrorCode for convenience
export { ActionErrorCode };

/**
 * Helper function to create a success result
 *
 * @param data - The successful result data
 * @returns ActionState with success: true
 *
 * @example
 * ```ts
 * const user = await db.query.users.findFirst();
 * return success(user);
 * ```
 */
export const success = <T>(data: T): ActionState<T> => ({
  success: true,
  data,
});

/**
 * Helper function to create an error result
 *
 * @param message - Human-readable error message
 * @param code - Error code for categorization
 * @param fieldErrors - Optional field-specific errors from validation
 * @returns ActionState with success: false
 *
 * @example
 * ```ts
 * return error('User not found', ActionErrorCode.NOT_FOUND);
 * ```
 */
export const error = (
  message: string,
  code: ActionErrorCode = ActionErrorCode.INTERNAL_ERROR,
  fieldErrors?: Record<string, string[]>,
): ActionState<never> => ({
  success: false,
  error: { message, code, fieldErrors },
});

/**
 * Handles errors from action handlers and maps them to ActionState errors
 *
 * This function provides centralized error handling with:
 * - Automatic logging
 * - Pattern matching for common database errors
 * - Consistent error formatting
 *
 * @param err - The caught error
 * @returns ActionState with error information
 *
 * @example
 * ```ts
 * try {
 *   await db.insert(users).values(data);
 * } catch (err) {
 *   return handleActionError(err);
 * }
 * ```
 */
export function handleActionError(err: unknown): ActionState<never> {
  // Log error for debugging
  console.error("Action error:", err);

  // Handle Error instances
  if (err instanceof Error) {
    // Database unique constraint violations
    if (
      err.message.includes("unique constraint") ||
      err.message.includes("duplicate key")
    ) {
      return error(
        "A record with this information already exists",
        ActionErrorCode.CONFLICT,
      );
    }

    // Database foreign key violations
    if (err.message.includes("foreign key")) {
      return error(
        "Referenced record does not exist",
        ActionErrorCode.NOT_FOUND,
      );
    }

    // Generic error with message
    return error(err.message, ActionErrorCode.INTERNAL_ERROR);
  }

  // Unknown error type
  return error("An unexpected error occurred", ActionErrorCode.INTERNAL_ERROR);
}
