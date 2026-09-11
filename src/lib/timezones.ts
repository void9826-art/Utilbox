/**
 * Time-zone arithmetic on top of the browser's Intl time-zone database, so
 * daylight saving and half- and quarter-hour offsets come from the same IANA
 * rules the operating system uses, for the actual date in question.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

export const CITIES: Array<{ name: string; zone: string }> = [
  { name: "Honolulu", zone: "Pacific/Honolulu" },
  { name: "Anchorage", zone: "America/Anchorage" },
  { name: "Los Angeles", zone: "America/Los_Angeles" },
  { name: "Vancouver", zone: "America/Vancouver" },
  { name: "Denver", zone: "America/Denver" },
  { name: "Chicago", zone: "America/Chicago" },
  { name: "Mexico City", zone: "America/Mexico_City" },
  { name: "New York", zone: "America/New_York" },
  { name: "Toronto", zone: "America/Toronto" },
  { name: "São Paulo", zone: "America/Sao_Paulo" },
  { name: "London", zone: "Europe/London" },
  { name: "Dublin", zone: "Europe/Dublin" },
  { name: "Lisbon", zone: "Europe/Lisbon" },
  { name: "Lagos", zone: "Africa/Lagos" },
  { name: "Paris", zone: "Europe/Paris" },
  { name: "Berlin", zone: "Europe/Berlin" },
  { name: "Madrid", zone: "Europe/Madrid" },
  { name: "Amsterdam", zone: "Europe/Amsterdam" },
  { name: "Warsaw", zone: "Europe/Warsaw" },
  { name: "Johannesburg", zone: "Africa/Johannesburg" },
  { name: "Cairo", zone: "Africa/Cairo" },
  { name: "Athens", zone: "Europe/Athens" },
  { name: "Istanbul", zone: "Europe/Istanbul" },
  { name: "Nairobi", zone: "Africa/Nairobi" },
  { name: "Moscow", zone: "Europe/Moscow" },
  { name: "Dubai", zone: "Asia/Dubai" },
  { name: "Karachi", zone: "Asia/Karachi" },
  { name: "Mumbai / Delhi", zone: "Asia/Kolkata" },
  { name: "Kathmandu", zone: "Asia/Kathmandu" },
  { name: "Dhaka", zone: "Asia/Dhaka" },
  { name: "Bangkok", zone: "Asia/Bangkok" },
  { name: "Jakarta", zone: "Asia/Jakarta" },
  { name: "Singapore", zone: "Asia/Singapore" },
  { name: "Hong Kong", zone: "Asia/Hong_Kong" },
  { name: "Shanghai", zone: "Asia/Shanghai" },
  { name: "Manila", zone: "Asia/Manila" },
  { name: "Seoul", zone: "Asia/Seoul" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Brisbane", zone: "Australia/Brisbane" },
  { name: "Sydney", zone: "Australia/Sydney" },
  { name: "Melbourne", zone: "Australia/Melbourne" },
  { name: "Auckland", zone: "Pacific/Auckland" },
];

export function isValidTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/** Minutes east of UTC for a zone at a given instant, e.g. 330 for India. */
export function offsetMinutes(timeZone: string, date: Date): number {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3] ?? 0);
  return match[1] === "-" ? -minutes : minutes;
}

export function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? "−" : "+";
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const rest = absolute % 60;
  return `UTC${sign}${hours}${rest ? `:${String(rest).padStart(2, "0")}` : ""}`;
}

export interface LocalTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 0 is Sunday. */
  weekday: number;
}

export function localTime(timeZone: string, date: Date): LocalTime {
  const shifted = new Date(date.getTime() + offsetMinutes(timeZone, date) * 60_000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    weekday: shifted.getUTCDay(),
  };
}

/** The UTC instant of a wall-clock time in a zone. Two passes settle offsets that change around the time. */
export function zonedTimeToUtc(timeZone: string, year: number, month: number, day: number, hour: number, minute = 0): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  let guess = naive - offsetMinutes(timeZone, new Date(naive)) * 60_000;
  guess = naive - offsetMinutes(timeZone, new Date(guess)) * 60_000;
  return new Date(guess);
}

export type SlotStatus = "work" | "edge" | "night" | "weekend";

/** A one-hour slot is "work" only if the whole hour sits inside working hours on a weekday. */
export function slotStatus(local: LocalTime, workStart: number, workEnd: number): SlotStatus {
  if (local.weekday === 0 || local.weekday === 6) return "weekend";
  const minutes = local.hour * 60 + local.minute;
  if (minutes >= workStart * 60 && minutes + 60 <= workEnd * 60) return "work";
  if (minutes >= 7 * 60 && minutes < 22 * 60) return "edge";
  return "night";
}

export interface PlannedHour {
  utc: Date;
  slots: Array<{ zone: string; local: LocalTime; status: SlotStatus }>;
  allWork: boolean;
}

/** 24 hourly slots across the date in the first zone, with each zone's local time and status. */
export function planDay(
  zones: string[],
  date: { year: number; month: number; day: number },
  workStart: number,
  workEnd: number,
): PlannedHour[] {
  if (zones.length === 0) return [];
  return Array.from({ length: 24 }, (_, hour) => {
    const utc = zonedTimeToUtc(zones[0], date.year, date.month, date.day, hour);
    const slots = zones.map((zone) => {
      const local = localTime(zone, utc);
      return { zone, local, status: slotStatus(local, workStart, workEnd) };
    });
    return { utc, slots, allWork: slots.every((slot) => slot.status === "work") };
  });
}
