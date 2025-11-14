/**
 * Server actions for model management
 * Thin wrappers around core model service
 *
 * @deprecated These server actions have been migrated to Hono API endpoints.
 * Please use the REST API at /api/models instead.
 * See: lib/api/models/routes.ts
 *
 * Migration path:
 * - createModel() → POST /api/models
 * - updateModel() → PUT /api/models/:id
 * - getModel() → GET /api/models/:id
 * - listModels() → GET /api/models
 * - deleteModel() → DELETE /api/models/:id
 * - bulkUpdatePublished() → PATCH /api/models/bulk-publish
 * - uploadProfileImage() → POST /api/models/:id/profile-image
 * - uploadModelImage() → POST /api/models/:id/images
 * - deleteModelImage() → DELETE /api/models/images/:id
 * - reorderModelImages() → PATCH /api/models/:id/images/reorder
 */

"use server";

import {
  bulkUpdatePublishedSchema,
  createModelSchema,
  deleteModelSchema,
  getModelSchema,
  listModelsSchema,
  updateModelSchema,
  uploadProfileImageSchema,
  uploadModelImageSchema,
  deleteModelImageSchema,
  reorderModelImagesSchema,
  type CreateModelInput,
  type UpdateModelInput,
  type GetModelInput,
  type ListModelsInput,
  type DeleteModelInput,
  type BulkUpdatePublishedInput,
  type DeleteModelImageInput,
  type ReorderModelImagesInput,
} from "@/actions/models/validator";
import * as modelService from "@/lib/core/models/service";
import { ActionErrorCode, error } from "@/actions";
import { success } from "@/actions/common/utils";
import type { ServerAction } from "@/actions/common/types";

/**
 * Create a new model
 * Authenticated action - requires login
 * Automatically computes category from dateOfBirth and gender
 */
export const createModel: ServerAction<
  CreateModelInput,
  Awaited<ReturnType<typeof modelService.createModel>>
> = async (input) => {
  try {
    // Validate with Zod schema
    const parseResult = createModelSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // TODO: Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }

    // Execute service
    const result = await modelService.createModel(parseResult.data);
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create model";
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Update an existing model
 * Authenticated action - requires login
 * Recomputes category if dateOfBirth or gender changes
 */
export const updateModel: ServerAction<
  UpdateModelInput & { id: string },
  Awaited<ReturnType<typeof modelService.updateModel>>
> = async (input) => {
  try {
    // Validate with Zod schema (excluding id from validation)
    const { id, ...data } = input;
    const parseResult = updateModelSchema.safeParse(data);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // TODO: Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }

    // Execute service
    const result = await modelService.updateModel({ id, ...parseResult.data });
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update model";
    if (message === "Model not found") {
      return error(message, ActionErrorCode.NOT_FOUND);
    }
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Get a single model by ID
 * Authenticated action - requires login
 * Includes all portfolio images
 */
export const getModel: ServerAction<
  GetModelInput,
  Awaited<ReturnType<typeof modelService.getModel>>
> = async (input) => {
  try {
    // Validate with Zod schema
    const parseResult = getModelSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // TODO: Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }

    // Execute service
    const result = await modelService.getModel(parseResult.data);
    return success(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get model";
    if (message === "Model not found") {
      return error(message, ActionErrorCode.NOT_FOUND);
    }
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};

/**
 * List models with pagination, filtering, and search
 * Public action - no authentication required
 */
export const listModels: ServerAction<
  ListModelsInput,
  Awaited<ReturnType<typeof modelService.listModels>>
> = async (input) => {
  try {
    // Validate with Zod schema
    const parseResult = listModelsSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // Execute service (no authentication required)
    const result = await modelService.listModels(parseResult.data);
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to list models";
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Delete a model
 * Authenticated action - requires login
 * Also deletes all associated images from Vercel Blob storage
 */
export const deleteModel: ServerAction<
  DeleteModelInput,
  Awaited<ReturnType<typeof modelService.deleteModel>>
> = async (input) => {
  try {
    // Validate with Zod schema
    const parseResult = deleteModelSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // TODO: Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }

    // Execute service
    const result = await modelService.deleteModel(parseResult.data);
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete model";
    if (message === "Model not found") {
      return error(message, ActionErrorCode.NOT_FOUND);
    }
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Bulk update published status for multiple models
 * Authenticated action - requires login
 */
export const bulkUpdatePublished: ServerAction<
  BulkUpdatePublishedInput,
  Awaited<ReturnType<typeof modelService.bulkUpdatePublished>>
> = async (input) => {
  try {
    // Validate with Zod schema
    const parseResult = bulkUpdatePublishedSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // TODO: Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }

    // Execute service
    const result = await modelService.bulkUpdatePublished(parseResult.data);
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to bulk update models";
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Upload and set profile image for a model
 * Authenticated action - requires login
 * Processes image with Sharp and uploads to Vercel Blob
 * Updates model's profileImageURL field
 */
export const uploadProfileImage: ServerAction<
  FormData,
  Awaited<ReturnType<typeof modelService.uploadProfileImage>>
> = async (formData) => {
  try {
    // Map FormData to schema input
    const input = {
      modelId: formData.get("modelId"),
      file: formData.get("file"),
    };

    // Validate with Zod schema
    const parseResult = uploadProfileImageSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // TODO: Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }

    // Execute service
    const result = await modelService.uploadProfileImage(parseResult.data);
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload profile image";
    if (message === "Model not found") {
      return error(message, ActionErrorCode.NOT_FOUND);
    }
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Upload a portfolio image for a model
 * Authenticated action - requires login
 * Processes image with Sharp and uploads to Vercel Blob
 * Creates a new modelImages record
 */
export const uploadModelImage: ServerAction<
  FormData,
  Awaited<ReturnType<typeof modelService.addPortfolioImage>>
> = async (formData) => {
  try {
    // Map FormData to schema input
    const input = {
      modelId: formData.get("modelId"),
      file: formData.get("file"),
      type: formData.get("type") || undefined,
      order: formData.get("order"),
    };

    // Validate with Zod schema
    const parseResult = uploadModelImageSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // TODO: Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }

    // Execute service
    const result = await modelService.addPortfolioImage(parseResult.data);
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload image";
    if (message === "Model not found") {
      return error(message, ActionErrorCode.NOT_FOUND);
    }
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Delete a portfolio image
 * Authenticated action - requires login
 * Deletes from both database and Vercel Blob storage
 */
export const deleteModelImage: ServerAction<
  DeleteModelImageInput,
  Awaited<ReturnType<typeof modelService.deletePortfolioImage>>
> = async (input) => {
  try {
    // Validate with Zod schema
    const parseResult = deleteModelImageSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // TODO: Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }

    // Execute service
    const result = await modelService.deletePortfolioImage(parseResult.data);
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete image";
    if (message === "Image not found") {
      return error(message, ActionErrorCode.NOT_FOUND);
    }
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Reorder portfolio images for a model
 * Authenticated action - requires login
 * Updates the order field for multiple images in a single transaction
 */
export const reorderModelImages: ServerAction<
  ReorderModelImagesInput,
  Awaited<ReturnType<typeof modelService.reorderPortfolioImages>>
> = async (input) => {
  try {
    // Validate with Zod schema
    const parseResult = reorderModelImagesSchema.safeParse(input);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return error(
        "Validation failed",
        ActionErrorCode.VALIDATION_ERROR,
        fieldErrors as Record<string, string[]>,
      );
    }

    // TODO: Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    // }

    // Execute service
    const result = await modelService.reorderPortfolioImages(parseResult.data);
    return success(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to reorder images";
    if (message.includes("do not exist") || message === "Model not found") {
      return error(message, ActionErrorCode.NOT_FOUND);
    }
    return error(message, ActionErrorCode.INTERNAL_ERROR);
  }
};
