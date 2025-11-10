/**
 * Model action validators
 *
 * Zod schemas for validating model action inputs.
 * Used at the platform boundary (server actions).
 */

import { models } from "@/db/schema";
import { CATEGORIES } from "@/lib/data/categories";
import { COUNTRIES } from "@/lib/data/countries";
import { EYE_COLORS } from "@/lib/data/eye-colors";
import { GENDERS } from "@/lib/data/genders";
import { HAIR_COLORS } from "@/lib/data/hair-colors";
import { IMAGE_TYPES } from "@/lib/data/image-types";
import { ColumnNames } from "@/lib/utils/drizzle";
import { paginationSchema, sortOrderSchema, uploadedImageSchema, uuidSchema } from "@/actions/common/validators";
import { z } from "zod";

// Field schemas - validation logic only, no .optional() or .nullable()
export const genderSchema = z.enum(GENDERS);
export const categorySchema = z.enum(CATEGORIES);
export const hairColorSchema = z.enum(HAIR_COLORS);
export const eyeColorSchema = z.enum(EYE_COLORS);
export const notionalitySchema = z.enum(COUNTRIES);

export const heightSchema = z.coerce
  .number()
  .positive("Height must be positive");

export const weightSchema = z.coerce
  .number()
  .positive("Weight must be positive");

export const hipsSchema = z.coerce.number().positive("Hips must be positive");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(255, "Name must be less than 255 characters");

export const nickNameSchema = z
  .string()
  .max(100, "Nickname must be less than 100 characters");

/**
 * Base model schema - shared fields for create/update
 */
const baseModelSchema = z.object({
  name: nameSchema,
  nickName: nickNameSchema.optional().nullable(),
  gender: genderSchema,
  dateOfBirth: z.coerce.date().optional().nullable(),
  nationality: notionalitySchema.optional().nullable(),
  talents: z.array(z.string()).optional().nullable(),
  bio: z.string().optional().nullable(),
  experiences: z.array(z.string()).optional().nullable(),
  local: z.boolean().default(false),
  inTown: z.boolean().default(false),
  published: z.boolean().default(false),
  height: heightSchema.optional().nullable(),
  weight: weightSchema.optional().nullable(),
  hips: hipsSchema.optional().nullable(),
  ethnicity: z.string().max(100).optional().nullable(),
  hairColor: hairColorSchema.optional().nullable(),
  eyeColor: eyeColorSchema.optional().nullable(),
});

/**
 * Create model schema
 * Category is computed automatically from dateOfBirth and gender
 */
export const createModelSchema = baseModelSchema;

export type CreateModelInput = z.infer<typeof createModelSchema>;

/**
 * Update model schema
 * All fields are optional, category is recomputed if dateOfBirth or gender changes
 */
export const updateModelSchema = z.object({
  id: uuidSchema,
  name: nameSchema.optional(),
  nickName: nickNameSchema.optional().nullable(),
  gender: genderSchema.optional(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  nationality: notionalitySchema.optional().nullable(),
  ethnicity: z.string().max(100).optional().nullable(),
  talents: z.array(z.string()).optional().nullable(),
  bio: z.string().optional().nullable(),
  experiences: z.array(z.string()).optional().nullable(),
  local: z.boolean().optional(),
  inTown: z.boolean().optional(),
  published: z.boolean().optional(),
  height: heightSchema.optional().nullable(),
  weight: weightSchema.optional().nullable(),
  hips: hipsSchema.optional().nullable(),
  hairColor: hairColorSchema.optional().nullable(),
  eyeColor: eyeColorSchema.optional().nullable(),
});

export type UpdateModelInput = z.infer<typeof updateModelSchema>;

/**
 * Get model by ID schema
 */
export const getModelSchema = z.object({
  id: uuidSchema,
});

export type GetModelInput = z.infer<typeof getModelSchema>;

/**
 * Delete model schema
 */
export const deleteModelSchema = z.object({
  id: uuidSchema,
});

export type DeleteModelInput = z.infer<typeof deleteModelSchema>;

export type ModelColumnNames = ColumnNames<typeof models>;

export const modelSortBySchema = z.enum(["createdAt", "updatedAt", "name"]);

/**
 * List models schema with pagination, sorting, search, and filters
 */
export const listModelsSchema = paginationSchema.extend({
  search: z.string().optional(),
  sortBy: modelSortBySchema.optional(),
  sortOrder: sortOrderSchema.optional(),
  category: categorySchema.optional(),
  local: z.boolean().optional(),
  inTown: z.boolean().optional(),
  published: z.boolean().optional(),
});

export type ListModelsInput = z.infer<typeof listModelsSchema>;

/**
 * Bulk publish/unpublish models schema
 */
export const bulkUpdatePublishedSchema = z.object({
  ids: z.array(uuidSchema).min(1, "At least one model ID is required"),
  published: z.boolean(),
});

export type BulkUpdatePublishedInput = z.infer<
  typeof bulkUpdatePublishedSchema
>;

// Image management schemas

export const imageTypeSchema = z.enum(IMAGE_TYPES);

/**
 * Upload profile image schema
 */
export const uploadProfileImageSchema = z.object({
  modelId: uuidSchema,
  file: uploadedImageSchema,
});

export type UploadProfileImageInput = z.infer<typeof uploadProfileImageSchema>;

/**
 * Upload model portfolio image schema
 */
export const uploadModelImageSchema = z.object({
  modelId: uuidSchema,
  file: uploadedImageSchema,
  type: imageTypeSchema.optional().nullable(),
  order: z.coerce.number().int().min(0).default(0),
});

export type UploadModelImageInput = z.infer<typeof uploadModelImageSchema>;

/**
 * Delete model image schema
 */
export const deleteModelImageSchema = z.object({
  id: uuidSchema,
});

export type DeleteModelImageInput = z.infer<typeof deleteModelImageSchema>;

/**
 * Reorder model images schema
 */
export const reorderModelImagesSchema = z.object({
  modelId: uuidSchema,
  images: z
    .array(
      z.object({
        id: uuidSchema,
        order: z.number().int().min(0),
      }),
    )
    .min(1, "At least one image is required"),
});

export type ReorderModelImagesInput = z.infer<typeof reorderModelImagesSchema>;
