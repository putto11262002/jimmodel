export const GENDERS = ["male", "female", "non-binary"] as const;

export type Gender = (typeof GENDERS)[number];
