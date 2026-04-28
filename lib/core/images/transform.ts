import type { StandardizeImageOptions } from "./types";

export const PORTRAIT_PRESET = {
  width: 800,
  height: 1200,
  quality: 85,
  format: "jpeg",
} as const;

export const GALLERY_PRESET = {
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 90,
  format: "jpeg",
} as const;

export const LANDSCAPE_PRESET = {
  width: 1200,
  height: 800,
  quality: 85,
  format: "jpeg",
} as const;

export const SQUARE_PRESET = {
  width: 600,
  height: 600,
  quality: 85,
  format: "jpeg",
} as const;

export async function standardizeImage(
  image: Buffer,
  _options: StandardizeImageOptions
): Promise<Buffer> {
  return image;
}
