import { api } from "@/lib/api";
import { handle } from "hono/vercel";

// Export handlers for Next.js App Router
export const GET = handle(api);
export const POST = handle(api);
export const PUT = handle(api);
export const DELETE = handle(api);
export const PATCH = handle(api);
