import type { Category } from "@/lib/core/models/types";

type PatternType = "pattern1" | "pattern2" | "pattern3" | "pattern4" | "pattern5";

const PATTERN_MAP: Record<Category, PatternType> = {
  female: "pattern1",
  male: "pattern2",
  "non-binary": "pattern3",
  kids: "pattern4",
  seniors: "pattern5",
};

export function getCategoryPattern(category: Category): PatternType {
  return PATTERN_MAP[category];
}
