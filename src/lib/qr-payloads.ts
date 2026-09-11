/**
 * Text payloads for special-purpose QR codes: Wi-Fi join records, vCard
 * contacts, and iCalendar events. Each format has its own escaping rules; get
 * them wrong and a password containing a semicolon silently stops working.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

export type WifiSecurity = "WPA" | "WEP" | "nopass";

/** The Wi-Fi QR format (from ZXing) escapes backslash, semicolon, comma, colon and double quote. */
export function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export function wifiPayload(input: { ssid: string; password: string; security: WifiSecurity; hidden: boolean }): string | null {
  if (!input.ssid) return null;
  const parts = [`T:${input.security}`, `S:${escapeWifi(input.ssid)}`];
  if (input.security !== "nopass") parts.push(`P:${escapeWifi(input.password)}`);
  if (input.hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}

/** vCard (RFC 2426/6350) and iCalendar (RFC 5545) text escaping. */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export interface VCardInput {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  mobile: string;
  workPhone: string;
  email: string;
  website: string;
  street: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  note: string;
}

export function vcardPayload(input: VCardInput): string | null {
  const fullName = [input.firstName, input.lastName].map((part) => part.trim()).filter(Boolean).join(" ") || input.organization.trim();
  if (!fullName) return null;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeText(input.lastName.trim())};${escapeText(input.firstName.trim())};;;`,
    `FN:${escapeText(fullName)}`,
  ];
  const push = (condition: string, line: string) => {
    if (condition.trim()) lines.push(line);
  };
  push(input.organization, `ORG:${escapeText(input.organization.trim())}`);
  push(input.title, `TITLE:${escapeText(input.title.trim())}`);
  push(input.mobile, `TEL;TYPE=CELL:${oneLine(input.mobile)}`);
  push(input.workPhone, `TEL;TYPE=WORK,VOICE:${oneLine(input.workPhone)}`);
  push(input.email, `EMAIL;TYPE=INTERNET:${oneLine(input.email)}`);
  push(input.website, `URL:${oneLine(input.website)}`);
  const address = [input.street, input.city, input.region, input.postcode, input.country];
  if (address.some((part) => part.trim())) {
    lines.push(`ADR;TYPE=WORK:;;${address.map((part) => escapeText(part.trim())).join(";")}`);
  }
  push(input.note, `NOTE:${escapeText(input.note.trim())}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function formatIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export interface EventInput {
  title: string;
  location: string;
  description: string;
  /** "YYYY-MM-DDTHH:mm" in the visitor's local time, or "YYYY-MM-DD" for all-day events. */
  start: string;
  end: string;
  allDay: boolean;
}

export function eventPayload(input: EventInput): string | null {
  if (!input.title.trim() || !input.start) return null;
  const lines = ["BEGIN:VEVENT", `SUMMARY:${escapeText(input.title.trim())}`];

  if (input.allDay) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.start)) return null;
    const lastDay = /^\d{4}-\d{2}-\d{2}$/.test(input.end) && input.end >= input.start ? input.end : input.start;
    lines.push(`DTSTART;VALUE=DATE:${input.start.replace(/-/g, "")}`);
    // DTEND is exclusive for all-day events, so it is the day after the last day.
    lines.push(`DTEND;VALUE=DATE:${addDays(lastDay, 1).replace(/-/g, "")}`);
  } else {
    const start = new Date(input.start);
    const end = input.end ? new Date(input.end) : new Date(start.getTime() + 60 * 60 * 1000);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return null;
    // UTC times, so the event lands at the right moment in every scanner's time zone.
    lines.push(`DTSTART:${formatIcsUtc(start)}`, `DTEND:${formatIcsUtc(end)}`);
  }

  if (input.location.trim()) lines.push(`LOCATION:${escapeText(input.location.trim())}`);
  if (input.description.trim()) lines.push(`DESCRIPTION:${escapeText(input.description.trim())}`);
  lines.push("END:VEVENT");
  return lines.join("\r\n");
}

export function menuPayload(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}
