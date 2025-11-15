import { z } from "zod";

export const formSubmissionSearchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  subject: z.string().optional(),
  status: z.enum(["new", "read", "responded"]).optional(),
});
