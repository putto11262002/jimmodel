/**
 * Server action creation utilities
 *
 * This module provides helper functions to create type-safe server actions
 * with automatic validation, error handling, and consistent return types.
 */

import { z } from "zod";
import { ActionState, ActionErrorCode, success, error } from "./types";

/**
 * Handler function type for server actions
 */
type ActionHandler<TInput, TOutput> = (
  input: TInput,
) => Promise<TOutput> | TOutput;

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
  return error(
    "An unexpected error occurred",
    ActionErrorCode.INTERNAL_ERROR,
  );
}

/**
 * Creates a type-safe server action with automatic validation and error handling
 *
 * This function wraps your action logic with:
 * - Automatic Zod schema validation
 * - Structured error handling
 * - Consistent return types (ActionState<T>)
 * - Type inference from schema to handler
 *
 * @param config - Configuration object
 * @param config.schema - Zod schema for validating input
 * @param config.handler - Async function that executes the action logic
 * @returns A server action function that returns ActionState<TOutput>
 *
 * @example
 * ```ts
 * // Define your schema
 * const createUserSchema = z.object({
 *   email: z.string().email(),
 *   name: z.string().min(2),
 * });
 *
 * // Create the action
 * export const createUser = createAction({
 *   schema: createUserSchema,
 *   handler: async (input) => {
 *     // input is automatically typed and validated!
 *     const user = await db.insert(users).values(input);
 *     return user;
 *   }
 * });
 *
 * // Use in client component
 * const result = await createUser({ email: 'test@example.com', name: 'John' });
 * if (result.success) {
 *   console.log(result.data); // typed as User
 * } else {
 *   console.log(result.error.message);
 * }
 * ```
 */
export function createAction<TInput extends z.ZodTypeAny, TOutput>(config: {
  schema: TInput;
  handler: ActionHandler<z.infer<TInput>, TOutput>;
}) {
  return async (rawInput: unknown): Promise<ActionState<TOutput>> => {
    try {
      // 1. Validate input with Zod schema
      const parseResult = config.schema.safeParse(rawInput);

      if (!parseResult.success) {
        // Extract field-level errors from Zod
        const fieldErrors = parseResult.error.flatten().fieldErrors;
        return error(
          "Validation failed",
          ActionErrorCode.VALIDATION_ERROR,
          fieldErrors as Record<string, string[]>,
        );
      }

      // 2. Execute handler with validated & typed input
      const result = await config.handler(parseResult.data);

      // 3. Return success with data
      return success(result);
    } catch (err) {
      // 4. Handle unexpected errors
      return handleActionError(err);
    }
  };
}

/**
 * Creates an authenticated server action that requires a valid user session
 *
 * Similar to createAction, but automatically:
 * - Checks for authentication
 * - Injects userId into handler input
 * - Returns UNAUTHORIZED error if not authenticated
 *
 * @param config - Configuration object
 * @param config.schema - Zod schema for validating input
 * @param config.handler - Async function with userId injected
 * @returns A server action that requires authentication
 *
 * @example
 * ```ts
 * export const updateProfile = createAuthenticatedAction({
 *   schema: z.object({ name: z.string() }),
 *   handler: async ({ name, userId }) => {
 *     // userId is automatically available and typed!
 *     await db.update(users)
 *       .set({ name })
 *       .where(eq(users.id, userId));
 *     return { success: true };
 *   }
 * });
 * ```
 *
 * @todo Implement actual authentication check (e.g., with next-auth, clerk, etc.)
 */
export function createAuthenticatedAction<
  TInput extends z.ZodTypeAny,
  TOutput,
>(config: {
  schema: TInput;
  handler: ActionHandler<z.infer<TInput> & { userId: string }, TOutput>;
}) {
  return async (rawInput: unknown): Promise<ActionState<TOutput>> => {
    // TODO: Replace with your actual authentication logic
    // Example with next-auth:
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }
    // const userId = session.user.id;

    // Mock authentication for now
    const userId = "mock-user-id";

    // If not authenticated, return early
    if (!userId) {
      return error("You must be logged in", ActionErrorCode.UNAUTHORIZED);
    }

    // Reuse createAction logic with userId injected
    return createAction({
      schema: config.schema,
      handler: (input) => config.handler({ ...input, userId }),
    })(rawInput);
  };
}

/**
 * Creates a server action without input validation (use sparingly!)
 *
 * Use this only when:
 * - The action takes no input
 * - Input validation is handled elsewhere
 * - You need maximum flexibility
 *
 * @param handler - Async function that executes the action logic
 * @returns A server action function
 *
 * @example
 * ```ts
 * export const getCurrentUser = createUnsafeAction(async () => {
 *   const session = await getServerSession();
 *   return session?.user ?? null;
 * });
 * ```
 */
export function createUnsafeAction<TOutput>(
  handler: ActionHandler<void, TOutput>,
) {
  return async (): Promise<ActionState<TOutput>> => {
    try {
      const result = await handler();
      return success(result);
    } catch (err) {
      return handleActionError(err);
    }
  };
}
