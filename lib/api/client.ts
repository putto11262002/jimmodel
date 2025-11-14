import { hc } from "hono/client";
import type { Api } from ".";

export const apiClient = hc<Api>(
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000",
);

/**
 * Convert query parameters to RPC-compatible format.
 *
 * Hono RPC client only accepts `string | string[] | undefined` for query parameters.
 * This helper converts numbers, booleans, and other types to strings.
 *
 * @param params - Object with query parameters (numbers, booleans, strings, etc.)
 * @returns Object with all values converted to strings or undefined
 *
 * @example
 * ```typescript
 * const filters = { page: 1, limit: 20, published: true, search: "john" };
 * const response = await apiClient.api.models.$get({
 *   query: toQueryParams(filters),
 * });
 * ```
 */
export function toQueryParams(
  params: Record<string, any>,
): Record<string, string | undefined> {
  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value === undefined || value === null) {
        acc[key] = undefined;
      } else {
        acc[key] = String(value);
      }
      return acc;
    },
    {} as Record<string, string | undefined>,
  );
}
