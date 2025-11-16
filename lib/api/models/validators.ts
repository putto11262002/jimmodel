/**
 * Model API validators
 *
 * Zod schemas for validating model API requests.
 * Used at the API boundary (Hono routes).
 */

import { models } from "@/db/schema";
import { CATEGORIES } from "@/lib/data/categories";
import { COUNTRIES } from "@/lib/data/countries";
import { EYE_COLORS } from "@/lib/data/eye-colors";
import { GENDERS } from "@/lib/data/genders";
import { HAIR_COLORS } from "@/lib/data/hair-colors";
import { IMAGE_TYPES } from "@/lib/data/image-types";
import { ColumnNames } from "@/lib/utils/drizzle";
import { z } from "zod";

// Common validators
export const uuidSchema = z.string().uuid("Invalid ID format");
export const uploadedImageSchema = z
  .instanceof(File, { message: "File is required" })
  .refine(
    (file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      return validTypes.includes(file.type);
    },
    {
      message: "File must be a valid image (JPEG, PNG, or WebP)",
    },
  )
  .refine(
    (file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      return file.size <= maxSize;
    },
    {
      message: "File size must be less than 10MB",
    },
  );

// Pagination schemas
export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const sortOrderSchema = z.enum(["asc", "desc"]).default("asc");

// Field schemas
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
 * All fields are optional, category can be provided or will be recomputed if dateOfBirth or gender changes
 */
export const updateModelSchema = z.object({
  name: nameSchema.optional(),
  nickName: nickNameSchema.optional().nullable(),
  gender: genderSchema.optional(),
  category: categorySchema.optional(),
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
 * List models schema for query parameters (coerces string values)
 */
export const listModelsQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  sortBy: modelSortBySchema.optional(),
  sortOrder: sortOrderSchema.optional(),
  category: categorySchema.optional(),
  local: z.coerce.boolean().optional(),
  inTown: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
});

export type ListModelsInput = z.infer<typeof listModelsQuerySchema>;

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
  file: uploadedImageSchema,
});

export type UploadProfileImageInput = z.infer<typeof uploadProfileImageSchema>;

/**
 * Upload model portfolio image schema
 */
export const uploadModelImageSchema = z.object({
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

/**
 * Bulk revalidate model profiles schema
 */
export const bulkRevalidateSchema = z.object({
  ids: z.array(uuidSchema).min(1, "At least one model ID is required"),
});

export type BulkRevalidateInput = z.infer<typeof bulkRevalidateSchema>;
