/**
 * Model header validators
 * Used by components in the admin header (e.g., create model dialog)
 */

import { createModelSchema } from "@/actions/models/validator";
import { z } from "zod";

/**
 * Create model form schema
 * Minimal schema for the create dialog - only requires name and gender
 * Other fields can be added after creation in the full form
 */
export const createModelFormSchema = createModelSchema.pick({
  name: true,
  gender: true,
});

export type CreateModelFormInput = z.infer<typeof createModelFormSchema>;
