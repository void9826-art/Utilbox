/**
 * Time card arithmetic: hours worked from start and end times, breaks,
 * weekly totals, overtime and pay.
 *
 * Everything is counted in whole minutes to avoid rounding drift, and only
 * converted to decimal hours for display and pay.
 */

/**
 * Reads 9, 9:30, 09:30, 9.30, 930, 9:30pm or 21:30. Returns minutes after
 * midnight, or null if the text is not a time.
 */
export function parseTime(value: string): number | null {
  const text = value.trim().toLowerCase().replace(/\s+/g, "");
  if (!text) return null;
  const match = text.match(/^(\d{1,2})(?:[:.h]?(\d{2}))?(am|pm|a|p)?$/);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3];
  if (minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (hours === 12) hours = 0;
    if (meridiem.startsWith("p")) hours += 12;
  } else if (hours > 24 || (hours === 24 && minutes > 0)) {
    return null;
  }
  return hours * 60 + minutes;
}

/**
 * Minutes worked in one shift. An end time earlier than the start is taken
 * to be the next day, so 22:00 to 06:00 is 8 hours. Equal times mean no shift.
 */
export function shiftMinutes(start: number, end: number, breakMinutes = 0): number {
  if (start === end) return 0;
  const span = end > start ? end - start : end + 24 * 60 - start;
  return Math.max(0, span - Math.max(0, breakMinutes));
}

export function formatHoursMinutes(minutes: number): string {
  const sign = minutes < 0 ? "−" : "";
  const abs = Math.abs(Math.round(minutes));
  return `${sign}${Math.floor(abs / 60)}:${String(abs % 60).padStart(2, "0")}`;
}

export function decimalHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

export interface PayResult {
  totalMinutes: number;
  regularMinutes: number;
  overtimeMinutes: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
}

/**
 * Weekly overtime: minutes above the threshold are paid at rate × multiplier.
 * A threshold of 0 means no overtime. Pay is rounded to the cent once, at the
 * end of each component.
 */
export function weeklyPay(
  totalMinutes: number,
  hourlyRate: number,
  overtimeThresholdHours: number,
  overtimeMultiplier: number,
): PayResult {
  const threshold = overtimeThresholdHours > 0 ? overtimeThresholdHours * 60 : Infinity;
  const regularMinutes = Math.min(totalMinutes, threshold);
  const overtimeMinutes = Math.max(0, totalMinutes - regularMinutes);
  const round = (value: number) => Math.round(value * 100) / 100;
  const regularPay = round((regularMinutes / 60) * hourlyRate);
  const overtimePay = round((overtimeMinutes / 60) * hourlyRate * overtimeMultiplier);
  return {
    totalMinutes,
    regularMinutes,
    overtimeMinutes,
    regularPay,
    overtimePay,
    totalPay: round(regularPay + overtimePay),
  };
}
