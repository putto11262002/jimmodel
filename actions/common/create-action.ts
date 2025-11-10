/**
 * Server action creation utilities
 *
 * This module provides helper functions to create type-safe server actions
 * with automatic validation, error handling, and consistent return types.
 */

import { z } from "zod";
import { ActionState } from "@/actions/common/types";
import { success, error, handleActionError, ActionErrorCode } from "@/actions/common/utils";

/**
 * Handler function type for server actions
 */
type ActionHandler<TInput, TOutput> = (
  input: TInput,
) => Promise<TOutput> | TOutput;

/**
 * Input mapper function that transforms raw input (e.g., FormData)
 * into a format suitable for Zod schema validation
 */
export type InputMapper<TRawInput = unknown, TMappedInput = unknown> = (
  input: TRawInput
) => TMappedInput | Promise<TMappedInput>;

/**
 * Creates a type-safe server action with automatic validation and error handling
 *
 * This function wraps your action logic with:
 * - Optional input mapping before validation (e.g., FormData to object)
 * - Automatic Zod schema validation
 * - Structured error handling
 * - Consistent return types (ActionState<T>)
 * - Type inference from schema to handler
 *
 * @param config - Configuration object
 * @param config.schema - Zod schema for validating input
 * @param config.mapper - Optional function to transform raw input before validation
 * @param config.handler - Async function that executes the action logic
 * @returns A server action function that returns ActionState<TOutput>
 *
 * @example
 * ```ts
 * // Example 1: Using Zod schema directly (traditional approach for JSON input)
 * const createUserSchema = z.object({
 *   email: z.string().email(),
 *   name: z.string().min(2),
 * });
 *
 * export const createUser = createAction({
 *   schema: createUserSchema,
 *   handler: async (input) => {
 *     // input is automatically typed and validated!
 *     const user = await db.insert(users).values(input);
 *     return user;
 *   }
 * });
 *
 * // Example 2: Using mapper for FormData with Zod schema
 * const uploadFileSchema = z.object({
 *   file: z.instanceof(File),
 *   title: z.string().min(3),
 *   description: z.string().optional(),
 * });
 *
 * export const uploadFile = createAction({
 *   schema: uploadFileSchema,
 *   mapper: (formData: FormData) => ({
 *     file: formData.get('file'),
 *     title: formData.get('title'),
 *     description: formData.get('description') || undefined,
 *   }),
 *   handler: async (input) => {
 *     // input is validated against uploadFileSchema
 *     const url = await uploadToStorage(input.file);
 *     return { url, title: input.title };
 *   }
 * });
 *
 * // Example 3: Complex FormData mapping with array handling
 * const createPostSchema = z.object({
 *   title: z.string().min(3),
 *   content: z.string().min(10),
 *   tags: z.array(z.string()),
 *   published: z.boolean(),
 * });
 *
 * export const createPost = createAction({
 *   schema: createPostSchema,
 *   mapper: (formData: FormData) => {
 *     // Handle array of tags from FormData
 *     const tagsString = formData.get('tags');
 *     const tags = typeof tagsString === 'string'
 *       ? tagsString.split(',').map(t => t.trim()).filter(Boolean)
 *       : [];
 *
 *     return {
 *       title: formData.get('title'),
 *       content: formData.get('content'),
 *       tags,
 *       published: formData.get('published') === 'true',
 *     };
 *   },
 *   handler: async (input) => {
 *     // Process the validated post data
 *     return await db.insert(posts).values(input);
 *   }
 * });
 * ```
 */
export function createAction<TSchema extends z.ZodObject<any>, TOutput>(config: {
  schema: TSchema;
  mapper?: InputMapper<any, any>;
  handler: ActionHandler<z.infer<TSchema>, TOutput>;
}): (rawInput: unknown) => Promise<ActionState<TOutput>> {
  return async (rawInput: unknown): Promise<ActionState<TOutput>> => {
    try {
      // Apply mapper if provided, otherwise use raw input
      const mappedInput = config.mapper ? await config.mapper(rawInput) : rawInput;

      // Validate with Zod schema
      const parseResult = config.schema.safeParse(mappedInput);

      if (!parseResult.success) {
        // Extract field-level errors from Zod
        const fieldErrors = parseResult.error.flatten().fieldErrors;
        return error(
          "Validation failed",
          ActionErrorCode.VALIDATION_ERROR,
          fieldErrors as Record<string, string[]>,
        );
      }

      // Execute handler with validated & typed input
      const result = await config.handler(parseResult.data);

      // Return success with data
      return success(result);
    } catch (err) {
      // Handle unexpected errors
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
 * @param config.mapper - Optional function to transform raw input before validation
 * @param config.handler - Async function with userId injected
 * @returns A server action that requires authentication
 *
 * @example
 * ```ts
 * // Example 1: With Zod schema (JSON input)
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
 *
 * // Example 2: With mapper for FormData
 * const uploadAvatarSchema = z.object({
 *   avatar: z.instanceof(File),
 *   altText: z.string().optional(),
 * });
 *
 * export const uploadAvatar = createAuthenticatedAction({
 *   schema: uploadAvatarSchema,
 *   mapper: (formData: FormData) => ({
 *     avatar: formData.get('avatar'),
 *     altText: formData.get('altText') || undefined,
 *   }),
 *   handler: async ({ avatar, altText, userId }) => {
 *     // userId is injected automatically
 *     const url = await uploadUserAvatar(userId, avatar);
 *     await db.update(users)
 *       .set({ avatarUrl: url, avatarAltText: altText })
 *       .where(eq(users.id, userId));
 *     return { avatarUrl: url };
 *   }
 * });
 * ```
 *
 * @todo Implement actual authentication check (e.g., with next-auth, clerk, etc.)
 */
export function createAuthenticatedAction<TSchema extends z.ZodObject<any>, TOutput>(config: {
  schema: TSchema;
  mapper?: InputMapper<any, any>;
  handler: ActionHandler<z.infer<TSchema> & { userId: string }, TOutput>;
}): (rawInput: unknown) => Promise<ActionState<TOutput>> {
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
      mapper: config.mapper,
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
