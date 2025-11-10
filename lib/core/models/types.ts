/**
 * Model service input types
 * Platform-independent TypeScript types for model operations
 */

import { CATEGORIES } from "@/lib/data/categories";
import { COUNTRIES } from "@/lib/data/countries";
import { EYE_COLORS } from "@/lib/data/eye-colors";
import { GENDERS } from "@/lib/data/genders";
import { HAIR_COLORS } from "@/lib/data/hair-colors";
import { IMAGE_TYPES } from "@/lib/data/image-types";

/**
 * Type aliases for enum values
 */
export type Gender = (typeof GENDERS)[number];
export type Category = (typeof CATEGORIES)[number];
export type HairColor = (typeof HAIR_COLORS)[number];
export type EyeColor = (typeof EYE_COLORS)[number];
export type Nationality = (typeof COUNTRIES)[number];
export type ImageType = (typeof IMAGE_TYPES)[number];

/**
 * Model sort options
 */
export type ModelSortBy = "createdAt" | "updatedAt" | "name";
export type SortOrder = "asc" | "desc";

/**
 * Create model input
 * Category is computed automatically from dateOfBirth and gender
 */
export interface CreateModelInput {
  name: string;
  nickName?: string | null;
  gender: Gender;
  dateOfBirth?: Date | null;
  nationality?: Nationality | null;
  talents?: string[] | null;
  bio?: string | null;
  experiences?: string[] | null;
  local?: boolean;
  inTown?: boolean;
  published?: boolean;
  height?: number | null;
  weight?: number | null;
  hips?: number | null;
  ethnicity?: string | null;
  hairColor?: HairColor | null;
  eyeColor?: EyeColor | null;
}

/**
 * Update model input
 * All fields are optional, category is recomputed if dateOfBirth or gender changes
 */
export interface UpdateModelInput {
  id: string;
  name?: string;
  nickName?: string | null;
  gender?: Gender;
  dateOfBirth?: Date | null;
  nationality?: Nationality | null;
  ethnicity?: string | null;
  talents?: string[] | null;
  bio?: string | null;
  experiences?: string[] | null;
  local?: boolean;
  inTown?: boolean;
  published?: boolean;
  height?: number | null;
  weight?: number | null;
  hips?: number | null;
  hairColor?: HairColor | null;
  eyeColor?: EyeColor | null;
}

/**
 * Get model by ID input
 */
export interface GetModelInput {
  id: string;
}

/**
 * Delete model input
 */
export interface DeleteModelInput {
  id: string;
}

/**
 * List models input with pagination, sorting, search, and filters
 */
export interface ListModelsInput {
  page: number;
  limit: number;
  search?: string;
  sortBy?: ModelSortBy;
  sortOrder?: SortOrder;
  category?: Category;
  local?: boolean;
  inTown?: boolean;
  published?: boolean;
}

/**
 * Bulk update published status input
 */
export interface BulkUpdatePublishedInput {
  ids: string[];
  published: boolean;
}

/**
 * Upload profile image input
 */
export interface UploadProfileImageInput {
  modelId: string;
  file: File;
}

/**
 * Upload model portfolio image input
 */
export interface UploadModelImageInput {
  modelId: string;
  file: File;
  type?: ImageType | null;
  order?: number;
}

/**
 * Delete model image input
 */
export interface DeleteModelImageInput {
  id: string;
}

/**
 * Image order update
 */
export interface ImageOrderUpdate {
  id: string;
  order: number;
}

/**
 * Reorder model images input
 */
export interface ReorderModelImagesInput {
  modelId: string;
  images: ImageOrderUpdate[];
}
