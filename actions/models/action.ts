/**
 * Server actions for model management
 * Thin wrappers around core model service
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
} from "@/actions/models/validator";
import * as modelService from "@/lib/core/models/service";
import {
  ActionErrorCode,
  createAction,
  createAuthenticatedAction,
  error,
} from "@/actions";

/**
 * Create a new model
 * Authenticated action - requires login
 * Automatically computes category from dateOfBirth and gender
 */
export const createModel = createAuthenticatedAction({
  schema: createModelSchema,
  handler: async (input) => {
    try {
      return await modelService.createModel(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create model";
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});

/**
 * Update an existing model
 * Authenticated action - requires login
 * Recomputes category if dateOfBirth or gender changes
 */
export const updateModel = createAuthenticatedAction({
  schema: updateModelSchema,
  handler: async (input) => {
    try {
      return await modelService.updateModel(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update model";
      if (message === "Model not found") {
        return error(message, ActionErrorCode.NOT_FOUND);
      }
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});

/**
 * Get a single model by ID
 * Authenticated action - requires login
 * Includes all portfolio images
 */
export const getModel = createAuthenticatedAction({
  schema: getModelSchema,
  handler: async (input) => {
    try {
      return await modelService.getModel(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get model";
      if (message === "Model not found") {
        return error(message, ActionErrorCode.NOT_FOUND);
      }
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});

/**
 * List models with pagination, filtering, and search
 * Public action - no authentication required
 */
export const listModels = createAction({
  schema: listModelsSchema,
  handler: async (input) => {
    try {
      return await modelService.listModels(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to list models";
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});

/**
 * Delete a model
 * Authenticated action - requires login
 * Also deletes all associated images from Vercel Blob storage
 */
export const deleteModel = createAuthenticatedAction({
  schema: deleteModelSchema,
  handler: async (input) => {
    try {
      return await modelService.deleteModel(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete model";
      if (message === "Model not found") {
        return error(message, ActionErrorCode.NOT_FOUND);
      }
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});

/**
 * Bulk update published status for multiple models
 * Authenticated action - requires login
 */
export const bulkUpdatePublished = createAuthenticatedAction({
  schema: bulkUpdatePublishedSchema,
  handler: async (input) => {
    try {
      return await modelService.bulkUpdatePublished(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to bulk update models";
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});

/**
 * Upload and set profile image for a model
 * Authenticated action - requires login
 * Processes image with Sharp and uploads to Vercel Blob
 * Updates model's profileImageURL field
 */
export const uploadProfileImage = createAuthenticatedAction({
  schema: uploadProfileImageSchema,
  handler: async (input) => {
    try {
      return await modelService.uploadProfileImage(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload profile image";
      if (message === "Model not found") {
        return error(message, ActionErrorCode.NOT_FOUND);
      }
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});

/**
 * Upload a portfolio image for a model
 * Authenticated action - requires login
 * Processes image with Sharp and uploads to Vercel Blob
 * Creates a new modelImages record
 */
export const uploadModelImage = createAuthenticatedAction({
  schema: uploadModelImageSchema,
  handler: async (input) => {
    try {
      return await modelService.addPortfolioImage(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload image";
      if (message === "Model not found") {
        return error(message, ActionErrorCode.NOT_FOUND);
      }
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});

/**
 * Delete a portfolio image
 * Authenticated action - requires login
 * Deletes from both database and Vercel Blob storage
 */
export const deleteModelImage = createAuthenticatedAction({
  schema: deleteModelImageSchema,
  handler: async (input) => {
    try {
      return await modelService.deletePortfolioImage(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete image";
      if (message === "Image not found") {
        return error(message, ActionErrorCode.NOT_FOUND);
      }
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});

/**
 * Reorder portfolio images for a model
 * Authenticated action - requires login
 * Updates the order field for multiple images in a single transaction
 */
export const reorderModelImages = createAuthenticatedAction({
  schema: reorderModelImagesSchema,
  handler: async (input) => {
    try {
      return await modelService.reorderPortfolioImages(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reorder images";
      if (message.includes("do not exist") || message === "Model not found") {
        return error(message, ActionErrorCode.NOT_FOUND);
      }
      return error(message, ActionErrorCode.INTERNAL_ERROR);
    }
  },
});
