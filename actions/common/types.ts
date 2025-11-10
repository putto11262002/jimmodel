/**
 * Core types for server actions
 *
 * This module provides type-safe return types and error handling
 * for all server actions in the application.
 */

/**
 * Discriminated union for action results
 *
 * All server actions should return this type to ensure
 * consistent error handling across the application.
 *
 * @example
 * ```ts
 * async function myAction(): Promise<ActionState<User>> {
 *   try {
 *     const user = await db.query.users.findFirst();
 *     return success(user);
 *   } catch (err) {
 *     return error('Failed to fetch user');
 *   }
 * }
 * ```
 */
export type ActionState<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

/**
 * Structured error type for action failures
 *
 * Includes:
 * - message: Human-readable error message
 * - code: Machine-readable error code for client-side handling
 * - fieldErrors: Optional field-specific validation errors (from Zod)
 */
export type ActionError = {
  message: string;
  code: ActionErrorCode;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Standard error codes for categorizing action failures
 *
 * Use these codes to handle different error types on the client side.
 */
export enum ActionErrorCode {
  /** Input validation failed (Zod schema validation) */
  VALIDATION_ERROR = "VALIDATION_ERROR",

  /** User is not authenticated or session is invalid */
  UNAUTHORIZED = "UNAUTHORIZED",

  /** User lacks permission to perform this action */
  FORBIDDEN = "FORBIDDEN",

  /** Requested resource does not exist */
  NOT_FOUND = "NOT_FOUND",

  /** Database operation failed */
  DATABASE_ERROR = "DATABASE_ERROR",

  /** Generic server error */
  INTERNAL_ERROR = "INTERNAL_ERROR",

  /** Business logic constraint violated */
  CONFLICT = "CONFLICT",
}

/**
 * Server action function type
 */
export type ServerAction<TInput, TOutputData> = (
  input: TInput,
) => Promise<ActionState<TOutputData>>;
