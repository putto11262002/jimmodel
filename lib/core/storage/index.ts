import { getCloudflareContext } from "@opennextjs/cloudflare";
import path from "path";
import { v4 as uuidv4 } from "uuid";

function getR2Bucket(): R2Bucket {
  const ctx = getCloudflareContext();
  const bucket = (ctx.env as Record<string, unknown>).R2_STORE as R2Bucket | undefined;
  if (!bucket) {
    throw new Error("R2_STORE binding not found. Ensure wrangler.jsonc has the R2 bucket binding.");
  }
  return bucket;
}

function getPublicUrl(key: string): string {
  const publicDomain = process.env.R2_PUBLIC_DOMAIN;
  if (publicDomain) {
    return `https://${publicDomain}/${key}`;
  }
  return key;
}

export async function uploadToBlob(
  buffer: Buffer,
  contentType: string,
  filename?: string,
  prefix?: string,
  options: {
    cacheControlMaxAge?: number;
  } = {
    cacheControlMaxAge: 31536000,
  },
): Promise<string> {
  const extension = contentType.split("/")[1] || "bin";
  const finalFilename = filename || `${uuidv4()}.${extension}`;

  const key = path.join(
    ...[...(prefix ? [prefix] : []), finalFilename],
  );

  const bucket = getR2Bucket();
  await bucket.put(key, buffer, {
    httpMetadata: {
      contentType,
      cacheControl: `public, max-age=${options.cacheControlMaxAge}`,
    },
  });

  return getPublicUrl(key);
}

export async function deleteFromBlob(url: string): Promise<void> {
  const publicDomain = process.env.R2_PUBLIC_DOMAIN;
  let key: string;

  if (publicDomain) {
    key = url.replace(`https://${publicDomain}/`, "");
  } else {
    const urlObj = new URL(url);
    key = urlObj.pathname.startsWith("/")
      ? urlObj.pathname.slice(1)
      : urlObj.pathname;
  }

  const bucket = getR2Bucket();
  await bucket.delete(key);
}
