/// <reference types="@cloudflare/workers-types" />

import type { CloudflareEnv } from "@opennextjs/cloudflare";

declare module "@opennextjs/cloudflare" {
  interface CloudflareEnv {
    R2_STORE?: R2Bucket;
  }
}

export {};
