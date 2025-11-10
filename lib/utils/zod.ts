import { z } from "zod";

/**
 * Sets any valid that is invalid to undefined
 */
export const orUndefined = <T extends z.ZodType>(
  field: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): z.ZodUnion<[T, z.ZodPipe<z.ZodAny, z.ZodTransform<undefined, any>>]> => {
  return field.or(z.any().transform(() => undefined));
};
