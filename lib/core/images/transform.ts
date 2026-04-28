import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ImageOutputOptions, ImageTransform } from "@cloudflare/workers-types";
import type { StandardizeImageOptions } from "./types";

function getImagesBinding(): ImagesBinding {
  const ctx = getCloudflareContext();
  if (!ctx.env.IMAGES) {
    throw new Error("IMAGES binding not found. Ensure wrangler.jsonc has the images binding.");
  }
  return ctx.env.IMAGES;
}

function toTransformOptions(options: StandardizeImageOptions): ImageTransform {
  const transform: ImageTransform = {};

  if (options.width && options.height) {
    transform.width = options.width;
    transform.height = options.height;
    transform.fit = "cover";
  } else {
    if (options.maxWidth) transform.width = options.maxWidth;
    if (options.maxHeight) transform.height = options.maxHeight;
    transform.fit = "scale-down";
  }

  return transform;
}

function toOutputOptions(options: StandardizeImageOptions): ImageOutputOptions {
  return {
    format: options.format === "webp" ? "image/webp" : "image/jpeg",
    quality: options.quality,
  };
}

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
  options: StandardizeImageOptions,
): Promise<Buffer> {
  const images = getImagesBinding();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(image));
      controller.close();
    },
  });

  const result = await images
    .input(stream)
    .transform(toTransformOptions(options))
    .output(toOutputOptions(options));

  const response = result.response();
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
