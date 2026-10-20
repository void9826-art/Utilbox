/**
 * Calendar arithmetic on dates without times.
 *
 * Every date is handled as midnight UTC, so a daylight-saving change can never
 * make a "day" 23 or 25 hours long and push a result onto the wrong date.
 * Inputs and outputs are ISO strings, YYYY-MM-DD.
 */

const MS_PER_DAY = 86_400_000;

export function parseIsoDate(value: string): Date | null {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  // Rejects 2026-02-30 and similar, which Date would silently roll over.
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/**
 * Adds calendar months. When the day does not exist in the target month, the
 * result is that month's last day: 31 January + 1 month = 28 or 29 February.
 * This is how spreadsheets (EDATE) and most date libraries behave.
 */
export function addMonths(date: Date, months: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + months;
  const targetYear = year + Math.floor(month / 12);
  const targetMonth = ((month % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  return new Date(Date.UTC(targetYear, targetMonth, Math.min(date.getUTCDate(), lastDay)));
}

/** Holidays as YYYY-MM-DD strings; lines that are not valid dates are ignored. */
export function parseHolidays(text: string): Set<string> {
  const set = new Set<string>();
  for (const token of text.split(/[\s,;]+/)) {
    const date = parseIsoDate(token);
    if (date) set.add(toIsoDate(date));
  }
  return set;
}

function isWorkingDay(date: Date, holidays: Set<string>): boolean {
  return !isWeekend(date) && !holidays.has(toIsoDate(date));
}

/**
 * Moves forward (or back, for a negative count) by working days, skipping
 * Saturdays, Sundays and holidays. The start date itself is never counted,
 * as with Excel's WORKDAY: 1 working day after Friday is Monday.
 */
export function addWorkingDays(date: Date, count: number, holidays: Set<string> = new Set()): Date {
  const step = count < 0 ? -1 : 1;
  let remaining = Math.abs(Math.trunc(count));
  let current = date;
  while (remaining > 0) {
    current = addDays(current, step);
    if (isWorkingDay(current, holidays)) remaining -= 1;
  }
  return current;
}

export interface DateDifference {
  /** End minus start, in days; negative if the end is earlier. */
  calendarDays: number;
  /** Working days strictly after the start, up to and including the end. */
  workingDays: number;
  weekendDays: number;
  holidaysSkipped: number;
  weeks: number;
  remainderDays: number;
  years: number;
  months: number;
  days: number;
}

/**
 * The difference between two dates. Counting starts the day after the start
 * date and includes the end date — 1 to 2 March is 1 day. Pass includeStart
 * to count the start date as well, which is what Excel's NETWORKDAYS does.
 */
export function dateDifference(
  start: Date,
  end: Date,
  holidays: Set<string> = new Set(),
  includeStart = false,
): DateDifference {
  const sign = end.getTime() >= start.getTime() ? 1 : -1;
  const [from, to] = sign === 1 ? [start, end] : [end, start];
  const span = Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);

  let workingDays = 0;
  let weekendDays = 0;
  let holidaysSkipped = 0;
  const first = includeStart ? 0 : 1;
  for (let offset = first; offset <= span; offset += 1) {
    const day = addDays(from, offset);
    if (isWeekend(day)) weekendDays += 1;
    else if (holidays.has(toIsoDate(day))) holidaysSkipped += 1;
    else workingDays += 1;
  }

  // Whole months first (with the month-end rule of addMonths), then the
  // days left over: 31 January to 1 March is 1 month and 1 day.
  let totalMonths = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  if (addMonths(from, totalMonths).getTime() > to.getTime()) totalMonths -= 1;
  const anniversary = addMonths(from, totalMonths);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const days = Math.round((to.getTime() - anniversary.getTime()) / MS_PER_DAY);

  const counted = span + (includeStart ? 1 : 0);
  return {
    calendarDays: sign * counted,
    workingDays: sign * workingDays,
    weekendDays,
    holidaysSkipped,
    weeks: Math.floor(counted / 7),
    remainderDays: counted % 7,
    years,
    months,
    days,
  };
}
