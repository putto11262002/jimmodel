/**
 * Core computation functions for models
 * Platform-independent business logic
 */

import { Category } from "@/lib/data/categories";
import { Gender } from "@/lib/data/genders";

/**
 * Compute category from date of birth and gender
 * - If age < 18: "kids"
 * - If age >= 60: "seniors"
 * - Otherwise: use gender value
 *
 * Pure function with no side effects - safe to use anywhere
 */
export function computeCategory(
  dateOfBirth: Date | null | undefined,
  gender: Gender,
): Category {
  if (!dateOfBirth) return gender;

  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 18) return "kids";
  if (age >= 60) return "seniors";
  return gender;
}
