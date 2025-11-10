/**
 * Image storage utilities (platform-specific: Vercel Blob)
 * Handles upload and deletion from Vercel Blob storage
 */

import { del, put } from "@vercel/blob";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload an image buffer to Vercel Blob storage
 * Returns the URL of the uploaded image
 */

export async function uploadToBlob(
  buffer: Buffer,
  contentType: string,
  filename?: string,
  prefix?: string,
  options: {
    cacheControlMaxAge?: number;
  } = {
    cacheControlMaxAge: 31536000, // 1 year
  },
): Promise<string> {
  // Generate filename with UUID if not provided
  const extension = contentType.split("/")[1] || "bin";
  const finalFilename = filename || `${uuidv4()}.${extension}`;

  const pathname = path.join(
    ...[...(prefix ? [prefix] : []), finalFilename],
  );
  const blob = await put(pathname, buffer, {
    allowOverwrite: false,
    access: "public",
    contentType,
    addRandomSuffix: true,
    ...options,
  });

  return blob.url;
}

/**
 * Delete an image from Vercel Blob storage by URL
 */
export async function deleteFromBlob(url: string): Promise<void> {
  await del(url);
}
