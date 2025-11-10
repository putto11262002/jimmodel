/**
 * Image processing utilities (platform-independent)
 * Uses Sharp for image optimization and transformations
 */

import sharp from "sharp";
import type { StandardizeImageOptions } from "./types";

/**
 * Generic image standardization presets
 * Use these for common image transformation scenarios
 */

/**
 * Portrait orientation preset
 * Crops to exact 800x1200 dimensions (vertical)
 * Best for: Headshots, profile photos, vertical images
 */
export const PORTRAIT_PRESET = {
  width: 800,
  height: 1200,
  quality: 85,
  format: "jpeg",
} as const;

/**
 * Gallery/adaptive preset
 * Preserves aspect ratio within 2000x2000 max dimensions
 * Best for: Photo galleries, portfolios with mixed orientations
 */
export const GALLERY_PRESET = {
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 90,
  format: "jpeg",
} as const;

/**
 * Landscape orientation preset
 * Crops to exact 1200x800 dimensions (horizontal)
 * Best for: Wide photos, banners, horizontal images
 */
export const LANDSCAPE_PRESET = {
  width: 1200,
  height: 800,
  quality: 85,
  format: "jpeg",
} as const;

/**
 * Square/thumbnail preset
 * Crops to exact 600x600 dimensions
 * Best for: Avatars, thumbnails, grid layouts
 */
export const SQUARE_PRESET = {
  width: 600,
  height: 600,
  quality: 85,
  format: "jpeg",
} as const;


/**
 * Standardize an image with flexible resize options
 *
 * @param image - Input image buffer
 * @param options - Standardization options (should be validated at platform boundary)
 * @returns Processed image buffer
 *
 * @remarks
 * - Use width AND height for exact dimensions (crops to fit, e.g., portrait images)
 * - Use maxWidth OR maxHeight for max dimensions (preserves aspect ratio, no upscaling, e.g., gallery images)
 * - Consider using presets: PORTRAIT_PRESET, GALLERY_PRESET, LANDSCAPE_PRESET, SQUARE_PRESET
 * - Options must be validated at the platform boundary before calling this function
 *
 * @example
 * ```typescript
 * // Using a preset (recommended)
 * const processed = await standardizeImage(buffer, PORTRAIT_PRESET);
 *
 * // Custom options
 * const custom = await standardizeImage(buffer, {
 *   maxWidth: 1500,
 *   maxHeight: 1500,
 *   quality: 85,
 *   format: 'webp'
 * });
 * ```
 */
export async function standardizeImage(
  image: Buffer,
  options: StandardizeImageOptions
): Promise<Buffer> {
  // Options should already be validated at the platform boundary

  // Start Sharp pipeline
  let pipeline = sharp(image);

  // Determine resize mode
  if (options.width && options.height) {
    // Mode 1: Exact dimensions - crop to fit
    pipeline = pipeline.resize(options.width, options.height, {
      fit: "cover",
      position: "center",
    });
  } else if (options.maxWidth || options.maxHeight) {
    // Mode 2: Max dimensions - preserve aspect ratio, prevent upscaling
    pipeline = pipeline.resize(options.maxWidth, options.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Apply format conversion and quality
  if (options.format === "jpeg") {
    pipeline = pipeline.jpeg({ quality: options.quality });
  } else {
    pipeline = pipeline.webp({ quality: options.quality });
  }

  // Return processed buffer
  return pipeline.toBuffer();
}


