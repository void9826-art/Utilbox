"use client";

import * as React from "react";
import { X } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { CITIES, formatOffset, isValidTimeZone, offsetMinutes, planDay, type SlotStatus } from "@/lib/timezones";
import { cn } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";

const STATUS_STYLE: Record<SlotStatus, string> = {
  work: "bg-accent-soft font-semibold text-fg",
  edge: "bg-surface text-fg-muted",
  night: "bg-bg-muted text-fg-subtle",
  weekend: "bg-bg-muted text-fg-subtle italic",
};

const STATUS_LABEL: Record<SlotStatus, string> = {
  work: "working hours",
  edge: "early or late",
  night: "night",
  weekend: "weekend",
};

const cityName = (zone: string) => CITIES.find((city) => city.zone === zone)?.name ?? zone.split("/").pop()?.replace(/_/g, " ") ?? zone;
const pad = (value: number) => String(value).padStart(2, "0");

/** Every IANA zone the browser knows, for the search suggestions. Older browsers lack the API. */
const ALL_ZONES: string[] = (() => {
  try {
    return (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf?.("timeZone") ?? [];
  } catch {
    return [];
  }
})();

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function TimezoneMeetingPlanner() {
  const [zones, setZones] = React.useState<string[]>(["Europe/London", "America/New_York", "Asia/Kolkata"]);
  const [date, setDate] = React.useState(todayIso);
  const [workStart, setWorkStart] = React.useState("9");
  const [workEnd, setWorkEnd] = React.useState("17");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<number | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const [year, month, day] = date.split("-").map(Number);
  const validDate = Boolean(year && month && day);
  const start = Number(workStart);
  const end = Number(workEnd);
  const plan = React.useMemo(
    () => (validDate && end > start ? planDay(zones, { year, month, day }, start, end) : []),
    [day, end, month, start, validDate, year, zones],
  );
  const overlap = plan.map((hour, index) => (hour.allWork ? index : -1)).filter((index) => index >= 0);

  const addZone = (value: string) => {
    const match = CITIES.find((city) => city.name.toLowerCase() === value.trim().toLowerCase())?.zone ?? value.trim();
    if (!isValidTimeZone(match)) {
      setNotice(`“${value}” is not a city in the list or a time zone name such as America/Bogota.`);
      return;
    }
    if (zones.includes(match)) {
      setNotice(`${cityName(match)} is already in the planner.`);
      return;
    }
    setZones((previous) => [...previous, match]);
    setSearch("");
    setNotice(null);
  };

  const describeHour = (index: number) => {
    const hour = plan[index];
    if (!hour) return "";
    const when = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: zones[0] }).format(hour.utc);
    const times = hour.slots
      .map((slot) => {
        const zoneName = new Intl.DateTimeFormat("en-US", { timeZone: slot.zone, timeZoneName: "short" })
          .formatToParts(hour.utc)
          .find((part) => part.type === "timeZoneName")?.value;
        const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: slot.zone }).format(hour.utc);
        return `${pad(slot.local.hour)}:${pad(slot.local.minute)} ${weekday} ${cityName(slot.zone)} (${zoneName})`;
      })
      .join("\n");
    return `Meeting — ${when}, reference ${cityName(zones[0])}\n${times}`;
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Meeting date" htmlFor="tz-date">
            <Input id="tz-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </Field>
          <SelectField label="Working day starts" id="tz-start" value={workStart} onChange={setWorkStart}>
            {Array.from({ length: 13 }, (_, hour) => hour + 5).map((hour) => (
              <option key={hour} value={hour}>
                {pad(hour)}:00
              </option>
            ))}
          </SelectField>
          <SelectField label="Working day ends" id="tz-end" value={workEnd} onChange={setWorkEnd}>
            {Array.from({ length: 13 }, (_, hour) => hour + 12).map((hour) => (
              <option key={hour} value={hour}>
                {pad(hour)}:00
              </option>
            ))}
          </SelectField>
          <form
            className="space-y-1.5"
            onSubmit={(event) => {
              event.preventDefault();
              addZone(search);
            }}
          >
            <label htmlFor="tz-add" className="block text-[0.8125rem] font-medium text-fg">
              Add a city or time zone
            </label>
            <div className="flex gap-1.5">
              <Input id="tz-add" list="tz-options" value={search} placeholder="e.g. Tokyo" onChange={(event) => setSearch(event.target.value)} />
              <Button type="submit" variant="secondary">
                Add
              </Button>
            </div>
            <datalist id="tz-options">
              {CITIES.map((city) => (
                <option key={city.zone} value={city.name} />
              ))}
              {ALL_ZONES.map((zone) => (
                <option key={zone} value={zone} />
              ))}
            </datalist>
          </form>
        </div>

        {notice ? (
          <p role="status" className="text-[0.8125rem] font-medium text-fg">
            {notice}
          </p>
        ) : null}

        {end <= start ? <Alert tone="warning">The working day must end after it starts.</Alert> : null}

        {plan.length > 0 ? (
          <>
            <p className="text-sm text-fg" aria-live="polite">
              {overlap.length > 0
                ? `${overlap.length} hour${overlap.length === 1 ? "" : "s"} fall within working hours everywhere: ${overlap
                    .map((index) => `${pad(index)}:00`)
                    .join(", ")} ${cityName(zones[0])} time.`
                : "No hour falls within working hours in every city on this date. Look for early-or-late slots as a compromise."}
            </p>

            <div className="scrollbar-slim overflow-x-auto rounded-lg border border-border" role="region" aria-label="Hour-by-hour comparison" tabIndex={0}>
              <table className="w-full border-collapse text-xs">
                <caption className="sr-only">Local time in each city for each hour of the day in {cityName(zones[0])}</caption>
                <thead>
                  <tr>
                    <th scope="col" className="sticky left-0 z-10 min-w-40 border-b border-border bg-surface-sunken px-2 py-1.5 text-left font-semibold text-fg">
                      City
                    </th>
                    {plan.map((hour, index) => (
                      <th key={index} scope="col" className="border-b border-l border-border bg-surface-sunken px-1 py-1.5 text-center font-semibold text-fg">
                        <button
                          type="button"
                          aria-pressed={selected === index}
                          aria-label={`Select ${pad(index)}:00 ${cityName(zones[0])}${hour.allWork ? ", working hours everywhere" : ""}`}
                          onClick={() => setSelected(index)}
                          className={cn("w-full rounded px-0.5", selected === index && "bg-fg text-bg")}
                        >
                          {hour.allWork ? "✓" : "·"}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone, zoneIndex) => (
                    <tr key={zone}>
                      <th scope="row" className="sticky left-0 z-10 border-b border-border bg-surface px-2 py-1.5 text-left font-medium text-fg">
                        <span className="flex items-center justify-between gap-1">
                          <span>
                            {cityName(zone)}
                            <span className="block text-[0.6875rem] font-normal text-fg-subtle">
                              {plan[0] ? formatOffset(offsetMinutes(zone, plan[12].utc)) : ""}
                              {zoneIndex === 0 ? " · reference" : ""}
                            </span>
                          </span>
                          {zones.length > 1 ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Remove ${cityName(zone)}`}
                              onClick={() => setZones((previous) => previous.filter((item) => item !== zone))}
                            >
                              <X className="size-3.5" aria-hidden="true" />
                            </Button>
                          ) : null}
                        </span>
                      </th>
                      {plan.map((hour, index) => {
                        const slot = hour.slots[zoneIndex];
                        return (
                          <td
                            key={index}
                            title={`${pad(slot.local.hour)}:${pad(slot.local.minute)} — ${STATUS_LABEL[slot.status]}`}
                            className={cn(
                              "tabular border-b border-l border-border px-1 py-1.5 text-center",
                              STATUS_STYLE[slot.status],
                              selected === index && "outline-2 -outline-offset-2 outline-fg",
                            )}
                          >
                            {pad(slot.local.hour)}
                            {slot.local.minute ? <span className="text-[0.625rem]">:{pad(slot.local.minute)}</span> : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-fg-subtle">
              Bold, shaded hours are working hours; plain hours are early or late (07:00–22:00); faded hours are night;
              italic hours fall on a weekend. ✓ marks hours that suit everyone.
            </p>

            {selected !== null ? (
              <div className="space-y-2 rounded-lg border border-accent-soft-border bg-accent-soft p-3.5">
                <pre className="font-sans text-sm whitespace-pre-wrap text-fg">{describeHour(selected)}</pre>
                <CopyButton value={describeHour(selected)} label="Copy times" />
              </div>
            ) : (
              <p className="text-sm text-fg-muted">Select an hour in the top row to see it in every city and copy the times.</p>
            )}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
