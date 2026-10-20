/**
 * Standard five-field cron expressions: parsing, plain-English descriptions
 * and upcoming run times.
 *
 * The rules follow the classic Unix cron (Vixie cron) that most servers,
 * crontab files and CI schedulers use:
 *   minute hour day-of-month month day-of-week
 * with *, lists (1,15), ranges (1-5), steps (*\/15, 0-30/10), month and day
 * names (JAN, MON), 0 or 7 for Sunday, and the @daily-style shortcuts.
 * When both day-of-month and day-of-week are restricted, a day matches if
 * EITHER matches — the rule that surprises people most.
 */

export type CronFieldName = "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";

interface FieldSpec {
  name: CronFieldName;
  label: string;
  min: number;
  max: number;
  names?: string[];
}

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const FIELDS: FieldSpec[] = [
  { name: "minute", label: "minute", min: 0, max: 59 },
  { name: "hour", label: "hour", min: 0, max: 23 },
  { name: "dayOfMonth", label: "day of the month", min: 1, max: 31 },
  { name: "month", label: "month", min: 1, max: 12, names: MONTH_NAMES },
  // 7 is accepted as Sunday and folded to 0 after parsing.
  { name: "dayOfWeek", label: "day of the week", min: 0, max: 7, names: DAY_NAMES },
];

const MACROS: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

export interface CronField {
  values: number[];
  /** The field was written starting with *, which matters for the day rule. */
  star: boolean;
  source: string;
}

export interface ParsedCron {
  expression: string;
  minute: CronField;
  hour: CronField;
  dayOfMonth: CronField;
  month: CronField;
  dayOfWeek: CronField;
}

export type CronParseResult = { ok: true; cron: ParsedCron } | { ok: false; message: string };

function parseValue(token: string, spec: FieldSpec): number {
  const upper = token.toUpperCase();
  if (spec.names) {
    const index = spec.names.indexOf(upper);
    if (index >= 0) return spec.name === "month" ? index + 1 : index;
  }
  if (!/^\d+$/.test(token)) {
    throw new Error(`“${token}” is not a valid ${spec.label}.`);
  }
  const value = Number(token);
  if (value < spec.min || value > spec.max) {
    throw new Error(`${spec.label[0].toUpperCase()}${spec.label.slice(1)} ${value} is out of range (${spec.min}–${spec.max === 7 ? 6 : spec.max}).`);
  }
  return value;
}

function parseField(source: string, spec: FieldSpec): CronField {
  // Month and day names contain L and W, so strip them before looking for
  // the Quartz-only symbols.
  const withoutNames = (spec.names ?? []).reduce(
    (text, name) => text.replaceAll(name, ""),
    source.toUpperCase(),
  );
  if (/[?LW#]/.test(withoutNames)) {
    throw new Error(
      `“${source}” uses Quartz-style symbols (? L W #). Standard cron does not support them; use * or explicit values instead.`,
    );
  }
  const values = new Set<number>();
  for (const part of source.split(",")) {
    if (part === "") throw new Error(`The ${spec.label} field has an empty item in its list.`);
    const [rangePart, stepPart] = part.split("/");
    if (part.split("/").length > 2) throw new Error(`“${part}” has more than one step.`);
    let step = 1;
    if (stepPart !== undefined) {
      if (!/^\d+$/.test(stepPart) || Number(stepPart) === 0) {
        throw new Error(`The step in “${part}” must be a whole number greater than 0.`);
      }
      step = Number(stepPart);
    }

    let start: number;
    let end: number;
    if (rangePart === "*") {
      start = spec.min;
      end = spec.name === "dayOfWeek" ? 6 : spec.max;
    } else if (rangePart.includes("-")) {
      const [from, to] = rangePart.split("-");
      start = parseValue(from, spec);
      end = parseValue(to, spec);
      if (end < start) throw new Error(`The range “${rangePart}” runs backwards.`);
    } else {
      start = parseValue(rangePart, spec);
      // "5/15" means from 5 to the end of the range in steps of 15.
      end = stepPart !== undefined ? (spec.name === "dayOfWeek" ? 6 : spec.max) : start;
    }

    for (let value = start; value <= end; value += step) {
      values.add(spec.name === "dayOfWeek" && value === 7 ? 0 : value);
    }
  }
  return { values: [...values].sort((a, b) => a - b), star: source.startsWith("*"), source };
}

export function parseCron(input: string): CronParseResult {
  const trimmed = input.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: false, message: "Enter a cron expression, such as 0 9 * * 1-5." };

  const lower = trimmed.toLowerCase();
  if (lower === "@reboot") {
    return { ok: false, message: "@reboot runs once when the machine starts, so it has no schedule to show." };
  }
  const expression = MACROS[lower] ?? trimmed;
  if (expression.startsWith("@")) {
    return { ok: false, message: `“${trimmed}” is not a cron shortcut. Try @hourly, @daily, @weekly, @monthly or @yearly.` };
  }

  const parts = expression.split(" ");
  if (parts.length === 6 || parts.length === 7) {
    return {
      ok: false,
      message: `This has ${parts.length} fields. Standard cron has five (minute hour day month weekday); six or seven usually means a seconds or year field from Quartz or Spring. Remove them to check the rest.`,
    };
  }
  if (parts.length !== 5) {
    return { ok: false, message: `A cron expression has five fields separated by spaces; this has ${parts.length}.` };
  }

  try {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts.map((part, index) => parseField(part, FIELDS[index]));
    return { ok: true, cron: { expression, minute, hour, dayOfMonth, month, dayOfWeek } };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "That expression could not be read." };
  }
}

/* -------------------------------------------------------------------------- */
/* Matching and next runs                                                     */
/* -------------------------------------------------------------------------- */

export function dayMatches(cron: ParsedCron, date: Date): boolean {
  if (!cron.month.values.includes(date.getMonth() + 1)) return false;
  const domMatch = cron.dayOfMonth.values.includes(date.getDate());
  const dowMatch = cron.dayOfWeek.values.includes(date.getDay());
  // Vixie cron: if either day field starts with *, only the other one counts.
  if (cron.dayOfMonth.star || cron.dayOfWeek.star) return domMatch && dowMatch;
  return domMatch || dowMatch;
}

/** The next run times after `from`, in the local time zone of the Date object. */
export function nextRuns(cron: ParsedCron, from: Date, count: number): Date[] {
  const results: Date[] = [];
  const day = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  // Five years covers every valid schedule, including 29 February.
  for (let offset = 0; offset < 366 * 5 && results.length < count; offset += 1) {
    const current = new Date(day.getFullYear(), day.getMonth(), day.getDate() + offset);
    if (!dayMatches(cron, current)) continue;
    for (const hour of cron.hour.values) {
      for (const minute of cron.minute.values) {
        const run = new Date(current.getFullYear(), current.getMonth(), current.getDate(), hour, minute);
        // Skips times that do not exist on a daylight-saving change day.
        if (run.getHours() !== hour) continue;
        if (run.getTime() > from.getTime()) {
          results.push(run);
          if (results.length === count) return results;
        }
      }
    }
  }
  return results;
}

/* -------------------------------------------------------------------------- */
/* Description                                                                */
/* -------------------------------------------------------------------------- */

const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function listWords(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function ordinal(value: number): string {
  const tens = value % 100;
  if (tens >= 11 && tens <= 13) return `${value}th`;
  return `${value}${["th", "st", "nd", "rd"][value % 10] ?? "th"}`;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** Recognises a whole field written as a step from the start, e.g. *\/15. */
function stepOf(field: CronField, min: number): number | null {
  const match = field.source.match(/^(?:\*|0|1)\/(\d+)$/);
  if (!match) return null;
  const start = field.source.startsWith("*") ? min : Number(field.source[0]);
  return start === min ? Number(match[1]) : null;
}

/** Collapses consecutive values into ranges for readable lists. */
function ranges(values: number[], name: (value: number) => string): string[] {
  const out: string[] = [];
  let start = values[0];
  let previous = values[0];
  for (let index = 1; index <= values.length; index += 1) {
    const value = values[index];
    if (value === previous + 1) {
      previous = value;
      continue;
    }
    if (previous - start >= 2) out.push(`${name(start)} through ${name(previous)}`);
    else if (previous === start) out.push(name(start));
    else out.push(name(start), name(previous));
    start = value;
    previous = value;
  }
  return out;
}

function describeTime(cron: ParsedCron): string {
  const minutes = cron.minute.values;
  const hours = cron.hour.values;
  const allMinutes = minutes.length === 60;
  const allHours = hours.length === 24;
  const minuteStep = stepOf(cron.minute, 0);
  const hourStep = stepOf(cron.hour, 0);

  if (allMinutes && allHours) return "Every minute";
  if (allMinutes) return `Every minute during ${listWords(ranges(hours, (h) => `${pad(h)}:00–${pad(h)}:59`))}`;

  if (allHours) {
    if (minuteStep) return `Every ${minuteStep} minutes`;
    if (minutes.length === 1) return minutes[0] === 0 ? "Every hour, on the hour" : `Every hour at ${minutes[0]} minutes past`;
    return `Every hour at ${listWords(minutes.map(String))} minutes past`;
  }

  if (minutes.length === 1 && hours.length <= 6) {
    return `At ${listWords(hours.map((hour) => `${pad(hour)}:${pad(minutes[0])}`))}`;
  }
  if (minutes.length === 1 && hourStep) {
    const at = minutes[0] === 0 ? "on the hour" : `at ${minutes[0]} minutes past`;
    const sample = hours.slice(0, 4).map((h) => `${pad(h)}:${pad(minutes[0])}`);
    return `Every ${hourStep} hours, ${at} (${listWords(sample)}${hours.length > 4 ? " …" : ""})`;
  }

  const minutePart = minuteStep
    ? `every ${minuteStep} minutes`
    : minutes.length === 1
      ? minutes[0] === 0
        ? "every hour, on the hour"
        : `at ${minutes[0]} minutes past each hour`
      : `at minutes ${listWords(minutes.map(String))} of each hour`;
  const contiguous = hours.every((hour, index) => index === 0 || hour === hours[index - 1] + 1);
  const hourPart = contiguous
    ? `between ${pad(hours[0])}:00 and ${pad(hours[hours.length - 1])}:59`
    : `during hours ${listWords(hours.map(pad))}`;
  return `${minutePart[0].toUpperCase()}${minutePart.slice(1)}, ${hourPart}`;
}

function describeDays(cron: ParsedCron): string {
  const dom = cron.dayOfMonth;
  const dow = cron.dayOfWeek;
  const domAll = dom.values.length === 31;
  const dowAll = dow.values.length === 7;

  const domText = `on the ${listWords(ranges(dom.values, ordinal))} of the month`;
  const weekdays = dow.values.join(",") === "1,2,3,4,5";
  const weekend = dow.values.join(",") === "0,6";
  const dowText = weekdays
    ? "on weekdays (Monday to Friday)"
    : weekend
      ? "at weekends"
      : `on ${listWords(ranges(dow.values, (d) => DAY_LONG[d]))}`;

  if (dom.star && dow.star) {
    if (domAll && dowAll) return "every day";
    if (!domAll && !dowAll) return `${domText}, if it is also ${dowText.replace(/^on /, "a ").replace(/^at /, "")}`;
    return domAll ? dowText : domText;
  }
  if (dom.star) return dowText;
  if (dow.star) return domText;
  return `${domText}, or ${dowText}`;
}

export function describeCron(cron: ParsedCron): string {
  const time = describeTime(cron);
  const days = describeDays(cron);
  const months = cron.month.values.length === 12 ? "" : `, in ${listWords(ranges(cron.month.values, (m) => MONTH_LONG[m - 1]))}`;
  return `${time}, ${days}${months}.`;
}

/** Field-by-field breakdown for the explanation table. */
export function explainFields(cron: ParsedCron): Array<{ field: string; source: string; meaning: string }> {
  const describe = (field: CronField, total: number, name: (value: number) => string, unit: string) => {
    if (field.values.length === total) return `every ${unit}`;
    return listWords(ranges(field.values, name));
  };
  return [
    { field: "Minute", source: cron.minute.source, meaning: describe(cron.minute, 60, String, "minute") },
    { field: "Hour", source: cron.hour.source, meaning: describe(cron.hour, 24, String, "hour") },
    { field: "Day of month", source: cron.dayOfMonth.source, meaning: describe(cron.dayOfMonth, 31, String, "day") },
    { field: "Month", source: cron.month.source, meaning: describe(cron.month, 12, (m) => MONTH_LONG[m - 1], "month") },
    { field: "Day of week", source: cron.dayOfWeek.source, meaning: describe(cron.dayOfWeek, 7, (d) => DAY_LONG[d], "day of the week") },
  ];
}
