/**
 * Common validators for server actions
 *
 * Reusable validation schemas that can be composed into action validators.
 * These validators are used at the platform boundary (actions, search params).
 */

import { z } from "zod";

/**
 * Pagination schema for list queries
 */
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export const sortOrderSchema = z.enum(["asc", "desc"]).default("asc");

export type SortOrder = z.infer<typeof sortOrderSchema>;

/**
 * Search schema for filtering
 */
export const searchSchema = z.object({
  search: z.string().optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

/**
 * ID parameter schemas
 */
export const uuidSchema = z.string().uuid("Invalid ID format");
export const idSchema = z.string().min(1, "ID is required");

/**
 * Common field schemas
 */
export const emailSchema = z.string().email("Invalid email address");
export const urlSchema = z.string().url("Invalid URL");
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number");

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
