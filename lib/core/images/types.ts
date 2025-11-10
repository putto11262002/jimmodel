/**
 * Image service types
 * Platform-independent TypeScript types for image operations
 */

/**
 * Supported image formats
 */
export type ImageFormat = "jpeg" | "webp";

/**
 * Image standardization options
 *
 * Two modes are supported:
 * 1. Exact dimensions: Provide both width AND height (crops to fit)
 * 2. Max dimensions: Provide maxWidth OR maxHeight (preserves aspect ratio)
 *
 * @example
 * ```typescript
 * // Exact dimensions (crops to fit)
 * const portraitOptions: StandardizeImageOptions = {
 *   width: 800,
 *   height: 1200,
 *   quality: 85,
 *   format: 'jpeg'
 * };
 *
 * // Max dimensions (preserves aspect ratio)
 * const galleryOptions: StandardizeImageOptions = {
 *   maxWidth: 2000,
 *   maxHeight: 2000,
 *   quality: 90,
 *   format: 'jpeg'
 * };
 * ```
 */
export interface StandardizeImageOptions {
  /** Exact width (requires height) - crops to fit */
  width?: number;
  /** Exact height (requires width) - crops to fit */
  height?: number;
  /** Maximum width (preserves aspect ratio) */
  maxWidth?: number;
  /** Maximum height (preserves aspect ratio) */
  maxHeight?: number;
  /** Image quality (1-100) */
  quality: number;
  /** Output format */
  format: ImageFormat;
}
