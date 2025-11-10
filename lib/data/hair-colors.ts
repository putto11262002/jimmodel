export const HAIR_COLORS = [
  "black",
  "brown",
  "blonde",
  "red",
  "grey",
  "white",
  "other",
] as const;

export type HairColor = (typeof HAIR_COLORS)[number];
