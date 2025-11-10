export const CATEGORIES = [
  "male",
  "female",
  "non-binary",
  "kids",
  "seniors",
] as const;

export type Category = (typeof CATEGORIES)[number];
