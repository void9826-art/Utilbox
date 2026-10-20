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

/* -------------------------------------------------------------------------- */
/* Durations                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Reads a duration in seconds: 1:30:15, 1h 30m, 90m, 45s, 1.5h, or a
 * two-part value such as 1:30, read as hours:minutes or minutes:seconds.
 */
export function parseDuration(value: string, twoPart: "hm" | "ms" = "hm"): number | null {
  const text = value.trim().toLowerCase().replace(/,/g, ".");
  if (!text) return null;
  const negative = text.startsWith("-");
  const body = negative ? text.slice(1).trim() : text;

  let seconds: number | null = null;
  const colon = body.match(/^(\d+):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?$/);
  if (colon) {
    const [, a, b, c] = colon;
    if (Number(b) > 59 || (c !== undefined && Number(c) >= 60)) return null;
    if (c !== undefined) seconds = Number(a) * 3600 + Number(b) * 60 + Number(c);
    else seconds = twoPart === "hm" ? Number(a) * 3600 + Number(b) * 60 : Number(a) * 60 + Number(b);
  } else if (/^\d+(\.\d+)?$/.test(body)) {
    // A bare number is minutes, the most common way people type a duration.
    seconds = Number(body) * 60;
  } else {
    // "1h30" means 1 hour 30 minutes.
    const compact = body.match(/^(\d+)\s*h\s*(\d{1,2})$/);
    if (compact) return (Number(compact[1]) * 3600 + Number(compact[2]) * 60) * (negative ? -1 : 1);
    // Longer unit names first, so "hours" is not read as "h" followed by junk.
    const units = [...body.matchAll(/(\d+(?:\.\d+)?)\s*(days?|d|hours?|hrs|hr|h|minutes?|mins|min|m|seconds?|secs|sec|s)(?![a-z])/g)];
    const consumed = units.map((match) => match[0]).join("").replace(/\s/g, "");
    if (units.length === 0 || consumed !== body.replace(/\s/g, "")) return null;
    seconds = units.reduce((total, [, amount, unit]) => {
      const factor = unit.startsWith("d") ? 86400 : unit.startsWith("h") ? 3600 : unit.startsWith("m") ? 60 : 1;
      return total + Number(amount) * factor;
    }, 0);
  }
  return seconds === null ? null : Math.round(seconds) * (negative ? -1 : 1);
}

/** 5025 → "1:23:45". Hours keep counting past 24 rather than rolling into days. */
export function formatDuration(totalSeconds: number, showSeconds = true): string {
  const sign = totalSeconds < 0 ? "−" : "";
  let rest = Math.abs(Math.round(totalSeconds));
  if (!showSeconds) rest = Math.round(rest / 60) * 60;
  const hours = Math.floor(rest / 3600);
  const minutes = Math.floor((rest % 3600) / 60);
  const seconds = rest % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return showSeconds ? `${sign}${hours}:${pad(minutes)}:${pad(seconds)}` : `${sign}${hours}:${pad(minutes)}`;
}

/** A clock time plus or minus minutes, wrapping round midnight. */
export function addToClock(minutesOfDay: number, deltaMinutes: number): { minutes: number; dayOffset: number } {
  const total = minutesOfDay + deltaMinutes;
  const day = 24 * 60;
  return { minutes: ((total % day) + day) % day, dayOffset: Math.floor(total / day) };
}
