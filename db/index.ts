import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

/**
 * Initialize the database connection
 * Must be called before using db in non-Next.js contexts (like scripts)
 * Next.js automatically loads env vars, so this is optional in that context
 */
export function initializeDb() {
  if (!dbInstance) {
    const sql = neon(process.env.DATABASE_URL!);
    dbInstance = drizzle({ client: sql, schema });
  }
  return dbInstance;
}

// Auto-initialize for Next.js contexts (env vars are already loaded)
// For scripts, call initializeDb() after loading env vars with dotenv
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(target, prop) {
    if (!dbInstance) {
      initializeDb();
    }
    return (dbInstance as any)[prop];
  },
});
