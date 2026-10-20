"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Field, Input, Segmented, Textarea } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import {
  addDays,
  addMonths,
  addWorkingDays,
  dateDifference,
  parseHolidays,
  parseIsoDate,
  toIsoDate,
} from "@/lib/date-math";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, NumberField, ResultCard, SelectField, Working } from "./_shared";

type Mode = "between" | "add";
type AddUnit = "days" | "weeks" | "months" | "years" | "workingDays";

const LONG_DATE = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function todayIso(): string {
  const now = new Date();
  return toIsoDate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

const plural = (count: number, word: string) => `${formatNumber(count)} ${word}${count === 1 ? "" : "s"}`;

export default function DateCalculator() {
  const [mode, setMode] = React.useState<Mode>("between");
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [includeStart, setIncludeStart] = React.useState(false);
  const [amount, setAmount] = React.useState("30");
  const [unit, setUnit] = React.useState<AddUnit>("days");
  const [direction, setDirection] = React.useState<"add" | "subtract">("add");
  const [holidayText, setHolidayText] = React.useState("");

  // Today's date in the visitor's time zone is not knowable on the server.
  React.useEffect(() => {
    const today = todayIso();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- today's date in the visitor's timezone is not knowable on the server
    setStart((current) => current || today);
    setEnd((current) => current || toIsoDate(addDays(parseIsoDate(today)!, 90)));
  }, []);

  const holidays = React.useMemo(() => parseHolidays(holidayText), [holidayText]);

  const between = React.useMemo(() => {
    const from = parseIsoDate(start);
    const to = parseIsoDate(end);
    if (!from || !to) return null;
    return { from, to, diff: dateDifference(from, to, holidays, includeStart) };
  }, [end, holidays, includeStart, start]);

  const added = React.useMemo(() => {
    const from = parseIsoDate(start);
    const count = Number(amount);
    if (!from || !Number.isFinite(count) || !Number.isInteger(count) || Math.abs(count) > 100_000) return null;
    const signed = direction === "add" ? count : -count;
    let result: Date;
    if (unit === "days") result = addDays(from, signed);
    else if (unit === "weeks") result = addDays(from, signed * 7);
    else if (unit === "months") result = addMonths(from, signed);
    else if (unit === "years") result = addMonths(from, signed * 12);
    else result = addWorkingDays(from, signed, holidays);
    return { from, result, count, signed };
  }, [amount, direction, holidays, start, unit]);

  const unitWord: Record<AddUnit, string> = {
    days: "day",
    weeks: "week",
    months: "month",
    years: "year",
    workingDays: "working day",
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="date-mode"
          ariaLabel="Calculation"
          value={mode}
          onChange={setMode}
          options={[
            { value: "between", label: "Days between dates" },
            { value: "add", label: "Add or subtract" },
          ]}
        />

        {mode === "between" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date" htmlFor="date-start">
              <Input id="date-start" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
            </Field>
            <Field label="End date" htmlFor="date-end">
              <Input id="date-end" type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Checkbox
                label="Count the start date as well"
                description="Counts both ends, as Excel's NETWORKDAYS does: 1 to 2 March becomes 2 days."
                checked={includeStart}
                onChange={(event) => setIncludeStart(event.target.checked)}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date" htmlFor="date-from">
              <Input id="date-from" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
            </Field>
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Direction</span>
              <Segmented
                name="date-direction"
                ariaLabel="Direction"
                value={direction}
                onChange={setDirection}
                options={[
                  { value: "add", label: "Add" },
                  { value: "subtract", label: "Subtract" },
                ]}
              />
            </div>
            <NumberField id="date-amount" label="Amount" value={amount} onChange={setAmount} min={0} step={1} inputMode="numeric" />
            <SelectField label="Unit" id="date-unit" value={unit} onChange={(value) => setUnit(value as AddUnit)}>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
              <option value="workingDays">Working days (Mon–Fri)</option>
            </SelectField>
          </div>
        )}

        <details className="rounded-lg border border-border bg-surface-sunken">
          <summary className="cursor-pointer px-3.5 py-2.5 text-[0.8125rem] font-medium text-fg">
            Public holidays to skip{holidays.size > 0 ? ` (${holidays.size})` : ""}
          </summary>
          <div className="px-3.5 pb-3.5">
            <Field
              label="Holiday dates"
              htmlFor="date-holidays"
              hint="One date per line as YYYY-MM-DD. Weekends are always skipped for working days."
            >
              <Textarea
                id="date-holidays"
                value={holidayText}
                rows={4}
                placeholder={"2026-12-25\n2026-12-28"}
                onChange={(event) => setHolidayText(event.target.value)}
                className="font-mono text-[0.8125rem]"
              />
            </Field>
          </div>
        </details>

        {mode === "between" ? (
          between ? (
            <div className="space-y-4">
              <ResultCard
                label="Calendar days"
                value={formatNumber(between.diff.calendarDays)}
                sublabel={`${LONG_DATE.format(between.from)} → ${LONG_DATE.format(between.to)}`}
                breakdown={[
                  { label: "Working days (Mon–Fri)", value: formatNumber(between.diff.workingDays) },
                  {
                    label: "In weeks",
                    value: `${plural(between.diff.weeks, "week")}, ${plural(between.diff.remainderDays, "day")}`,
                  },
                ]}
              />
              <StatGrid className="sm:grid-cols-4">
                <Stat label="Years, months, days" value={`${between.diff.years}y ${between.diff.months}m ${between.diff.days}d`} />
                <Stat label="Weekend days" value={formatNumber(between.diff.weekendDays)} />
                <Stat label="Holidays skipped" value={formatNumber(between.diff.holidaysSkipped)} />
                <Stat label="Hours" value={formatNumber(Math.abs(between.diff.calendarDays) * 24)} />
              </StatGrid>
              <Working
                lines={[
                  includeStart
                    ? "Both the start and end dates are counted."
                    : "Counting starts the day after the start date and includes the end date.",
                  `${formatNumber(Math.abs(between.diff.calendarDays))} days = ${formatNumber(Math.abs(between.diff.workingDays))} working + ${formatNumber(between.diff.weekendDays)} weekend + ${formatNumber(between.diff.holidaysSkipped)} holiday`,
                ]}
              />
            </div>
          ) : (
            <EmptyResult message="Choose a start date and an end date." />
          )
        ) : added ? (
          <ResultCard
            label="Result"
            value={LONG_DATE.format(added.result)}
            sublabel={`${LONG_DATE.format(added.from)} ${direction === "add" ? "+" : "−"} ${plural(added.count, unitWord[unit])}`}
            breakdown={[
              { label: "ISO date", value: toIsoDate(added.result) },
              {
                label: "Calendar days apart",
                value: formatNumber(Math.round((added.result.getTime() - added.from.getTime()) / 86_400_000)),
              },
            ]}
          />
        ) : (
          <EmptyResult message="Choose a start date and a whole number to add or subtract." />
        )}
      </div>
    </ToolFrame>
  );
}
