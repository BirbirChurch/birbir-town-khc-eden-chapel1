import { AgeGroup } from '../types/chapel';

/**
 * Pure helper to calculate AgeGroup without any circular imports
 */
export function calculateAgeGroup(age: number): AgeGroup {
  if (age <= 14) return '0-14';
  if (age <= 29) return '15-29';
  if (age <= 59) return '30-59';
  return '60+';
}
