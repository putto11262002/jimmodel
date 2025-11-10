export const EYE_COLORS = [
  "brown",
  "blue",
  "green",
  "hazel",
  "grey",
  "amber",
  "other",
] as const;

export type EyeColor = (typeof EYE_COLORS)[number];
