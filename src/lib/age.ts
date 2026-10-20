/**
 * Exact ages in years, months and days, on the real calendar.
 *
 * Dates are local calendar dates (Date objects at local midnight). Whole
 * years are counted first, then whole months, then the days left over:
 *   - A 29 February birthday falls on 1 March in common years, the most
 *     widely used convention (and the one the age pages describe).
 *   - Adding a month to a day the next month does not have lands on that
 *     month's last day, so 31 January + 1 month is 28 or 29 February.
 * Days are never negative, which the older borrow-from-last-month method
 * produced for dates such as 31 January → 1 March.
 */

export interface AgeParts {
  years: number;
  months: number;
  days: number;
}

const MS_PER_DAY = 86_400_000;

/** Parses YYYY-MM-DD to a local date, rejecting impossible dates such as 2025-02-30. */
export function parseLocalDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

/** Whole days between two local dates, immune to daylight-saving changes. */
export function wholeDaysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / MS_PER_DAY);
}

/** The birthday in a given year: 29 February becomes 1 March in common years. */
export function birthdayInYear(birth: Date, year: number): Date {
  const candidate = new Date(year, birth.getMonth(), birth.getDate());
  if (candidate.getMonth() !== birth.getMonth()) return new Date(year, birth.getMonth() + 1, 1);
  return candidate;
}

/** Adds calendar months, clamping to the last day of a shorter month. */
export function addMonthsClamped(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

export function exactAge(birth: Date, on: Date): AgeParts {
  if (wholeDaysBetween(birth, on) < 0) return { years: 0, months: 0, days: 0 };

  let years = on.getFullYear() - birth.getFullYear();
  if (wholeDaysBetween(birthdayInYear(birth, birth.getFullYear() + years), on) < 0) years -= 1;
  // Months are counted on from the last birthday; months that are too short
  // for its day clamp to their last day.
  const base = birthdayInYear(birth, birth.getFullYear() + years);

  let months = 0;
  while (months < 11 && wholeDaysBetween(addMonthsClamped(base, months + 1), on) >= 0) months += 1;
  const days = wholeDaysBetween(addMonthsClamped(base, months), on);
  return { years, months, days };
}

export interface NextBirthday {
  date: Date;
  daysAway: number;
  turning: number;
}

export function nextBirthday(birth: Date, reference: Date): NextBirthday {
  let candidate = birthdayInYear(birth, reference.getFullYear());
  if (wholeDaysBetween(reference, candidate) < 0) candidate = birthdayInYear(birth, reference.getFullYear() + 1);
  return {
    date: candidate,
    daysAway: wholeDaysBetween(reference, candidate),
    turning: candidate.getFullYear() - birth.getFullYear(),
  };
}
