import { sortOrderSchema } from "@/actions/common/validators";
import { categorySchema, modelSortBySchema } from "@/actions/models/validator";
import { orUndefined } from "@/lib/utils/zod";
import { z } from "zod";
export const modelSearchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  category: orUndefined(categorySchema),
  sortBy: orUndefined(modelSortBySchema),
  sortOrder: orUndefined(sortOrderSchema),
  published: z
    .string()
    .optional()
    .transform((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),
  local: z
    .string()
    .optional()
    .transform((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),
  inTown: z
    .string()
    .optional()
    .transform((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),
});
