import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: [".env", ".env.local"] });

export default {
  schema: "./db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
