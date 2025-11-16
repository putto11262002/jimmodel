import { z } from "zod";
import { FORM_SUBMISSION_SUBJECTS } from "@/lib/data/form-submission-subjects";

export const formSubmissionSearchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  subject: z.enum(FORM_SUBMISSION_SUBJECTS).optional(),
  status: z.enum(["new", "read", "responded"]).optional(),
});
