/**
 * Attendance against a minimum percentage, such as the common 75% rule.
 *
 * Worked in whole percentages (75, not 0.75) so that values like 80% stay
 * exact: 1 − 0.8 is 0.19999999999999996 in floating point, which used to
 * turn "attend 5 more classes" into 6. A tiny tolerance absorbs what float
 * error remains for fractional requirements such as 72.5%.
 */

const TOLERANCE = 1e-9;

export interface AttendanceStatus {
  /** Current attendance, percent. */
  current: number;
  above: boolean;
  /** Classes that can be missed in a row while staying at or above the requirement. */
  canSkip: number;
  /** Classes that must be attended in a row to reach the requirement. */
  mustAttend: number;
}

export function attendanceStatus(held: number, attended: number, requiredPercent: number): AttendanceStatus | null {
  if (!(held > 0) || !(attended >= 0) || attended > held || !(requiredPercent > 0) || !(requiredPercent < 100)) return null;
  const current = (attended / held) * 100;
  // attended × 100 ≥ required × held, compared without dividing.
  const above = attended * 100 - requiredPercent * held >= -TOLERANCE;
  // attended ÷ (held + s) ≥ R/100  ⇔  s ≤ (100·attended − R·held) ÷ R
  const canSkip = above ? Math.max(0, Math.floor((attended * 100 - requiredPercent * held) / requiredPercent + TOLERANCE)) : 0;
  // (attended + x) ÷ (held + x) ≥ R/100  ⇔  x ≥ (R·held − 100·attended) ÷ (100 − R)
  const mustAttend = above ? 0 : Math.max(0, Math.ceil((requiredPercent * held - attended * 100) / (100 - requiredPercent) - TOLERANCE));
  return { current, above, canSkip, mustAttend };
}

/** Best final percentage if every one of the remaining classes is attended. */
export function bestPossible(held: number, attended: number, remaining: number): number {
  return ((attended + remaining) / (held + remaining)) * 100;
}
