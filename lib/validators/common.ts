/**
 * Common/shared Zod schemas
 *
 * Reusable validation schemas that can be composed into other schemas.
 */

import { z } from 'zod';

/**
 * Pagination schema for list queries
 */
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * Sorting schema for list queries
 */
export const sortingSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SortingInput = z.infer<typeof sortingSchema>;

/**
 * Search schema for filtering
 */
export const searchSchema = z.object({
  search: z.string().optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

/**
 * Combined pagination, sorting, and search schema
 */
export const paginatedQuerySchema = paginationSchema
  .merge(sortingSchema)
  .merge(searchSchema);

export type PaginatedQueryInput = z.infer<typeof paginatedQuerySchema>;

/**
 * ID parameter schemas
 */
export const uuidSchema = z.string().uuid('Invalid ID format');
export const idSchema = z.string().min(1, 'ID is required');

/**
 * Common field schemas
 */
export const emailSchema = z.string().email('Invalid email address');
export const urlSchema = z.string().url('Invalid URL');
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');

/**
 * Date range schema
 */
export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  }
);

export type DateRangeInput = z.infer<typeof dateRangeSchema>;
