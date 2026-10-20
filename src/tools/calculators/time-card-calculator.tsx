"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Input } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatMoney } from "@/lib/money";
import { decimalHours, formatHoursMinutes, parseTime, shiftMinutes, weeklyPay } from "@/lib/timecard";

import { CurrencySelect, NumberField, ResultCard, Working, parseNumber } from "./_shared";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Row {
  start: string;
  end: string;
  breakMinutes: string;
}

const DEFAULT_ROWS: Row[] = DAYS.map((_, index) =>
  index < 5 ? { start: "09:00", end: "17:30", breakMinutes: "30" } : { start: "", end: "", breakMinutes: "" },
);

export default function TimeCardCalculator() {
  const [rows, setRows] = React.useState<Row[]>(DEFAULT_ROWS);
  const [rate, setRate] = React.useState("18");
  const [threshold, setThreshold] = React.useState("40");
  const [multiplier, setMultiplier] = React.useState("1.5");
  const [currency, setCurrency] = React.useState("USD");

  const update = (index: number, patch: Partial<Row>) =>
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)));

  const days = rows.map((row) => {
    const start = parseTime(row.start);
    const end = parseTime(row.end);
    const breakMinutes = parseNumber(row.breakMinutes) ?? 0;
    if (start === null || end === null) return { minutes: 0, filled: Boolean(row.start || row.end), valid: !row.start && !row.end };
    return { minutes: shiftMinutes(start, end, breakMinutes), filled: true, valid: true, overnight: end < start };
  });

  const totalMinutes = days.reduce((sum, day) => sum + day.minutes, 0);
  const hourlyRate = parseNumber(rate);
  const pay =
    hourlyRate !== null && hourlyRate >= 0
      ? weeklyPay(totalMinutes, hourlyRate, parseNumber(threshold) ?? 0, parseNumber(multiplier) ?? 1)
      : null;
  const money = (value: number) => formatMoney(value, currency);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <ul className="divide-y divide-border rounded-lg border border-border" aria-label="Hours for each day">
          {rows.map((row, index) => (
            <li key={DAYS[index]} className="grid grid-cols-2 items-end gap-2 px-3 py-2.5 sm:grid-cols-[6rem_1fr_1fr_6rem_5rem]">
              <div className="col-span-2 flex items-baseline justify-between sm:col-span-1 sm:block">
                <span className="text-[0.8125rem] font-semibold text-fg">{DAYS[index]}</span>
                <span className="tabular text-[0.8125rem] text-fg-muted sm:hidden" aria-hidden="true">
                  {days[index].minutes > 0 ? formatHoursMinutes(days[index].minutes) : "—"}
                </span>
              </div>
              <label className="space-y-1">
                <span className="block text-xs text-fg-muted">Start</span>
                <Input
                  type="time"
                  aria-label={`${DAYS[index]} start time`}
                  value={row.start}
                  onChange={(event) => update(index, { start: event.target.value })}
                  className="h-9 px-2"
                />
              </label>
              <label className="space-y-1">
                <span className="block text-xs text-fg-muted">Finish</span>
                <Input
                  type="time"
                  aria-label={`${DAYS[index]} finish time`}
                  value={row.end}
                  onChange={(event) => update(index, { end: event.target.value })}
                  className="h-9 px-2"
                />
              </label>
              <label className="space-y-1">
                <span className="block text-xs text-fg-muted">Break (min)</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  aria-label={`${DAYS[index]} unpaid break in minutes`}
                  value={row.breakMinutes}
                  onChange={(event) => update(index, { breakMinutes: event.target.value })}
                  className="h-9 px-2"
                />
              </label>
              <p className="tabular hidden text-right text-[0.8125rem] text-fg sm:block">
                <span className="sr-only">{DAYS[index]} hours: </span>
                {days[index].minutes > 0 ? formatHoursMinutes(days[index].minutes) : "—"}
                {days[index].overnight ? <span className="block text-xs text-fg-subtle">overnight</span> : null}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-fg-subtle">
          A finish time earlier than the start counts as the next morning, for night shifts. Leave a day blank if not worked.
        </p>

        <div className="grid gap-4 sm:grid-cols-4">
          <NumberField id="tc-rate" label="Hourly rate" value={rate} onChange={setRate} min={0} />
          <NumberField
            id="tc-threshold"
            label="Overtime after"
            value={threshold}
            onChange={setThreshold}
            suffix="h/week"
            min={0}
            hint="0 for no overtime."
          />
          <NumberField id="tc-multiplier" label="Overtime rate" value={multiplier} onChange={setMultiplier} suffix="×" min={1} step={0.25} />
          <CurrencySelect value={currency} onChange={setCurrency} id="tc-currency" />
        </div>

        <ResultCard
          label="Total hours this week"
          value={formatHoursMinutes(totalMinutes)}
          sublabel={`${decimalHours(totalMinutes)} hours in decimal, for timesheets and payroll.`}
          breakdown={
            pay
              ? [
                  { label: "Gross pay", value: money(pay.totalPay) },
                  { label: "Overtime hours", value: formatHoursMinutes(pay.overtimeMinutes) },
                ]
              : undefined
          }
        />

        {pay ? (
          <StatGrid className="sm:grid-cols-4">
            <Stat label="Regular hours" value={formatHoursMinutes(pay.regularMinutes)} />
            <Stat label="Regular pay" value={money(pay.regularPay)} />
            <Stat label="Overtime pay" value={money(pay.overtimePay)} />
            <Stat label="Total" value={money(pay.totalPay)} emphasis />
          </StatGrid>
        ) : null}

        {pay ? (
          <Working
            lines={[
              `total = ${days.filter((day) => day.minutes > 0).map((day) => formatHoursMinutes(day.minutes)).join(" + ") || "0:00"} = ${formatHoursMinutes(totalMinutes)} (${decimalHours(totalMinutes)} h)`,
              `regular pay = ${decimalHours(pay.regularMinutes)} h × ${money(hourlyRate ?? 0)} = ${money(pay.regularPay)}`,
              `overtime pay = ${decimalHours(pay.overtimeMinutes)} h × ${money(hourlyRate ?? 0)} × ${parseNumber(multiplier) ?? 1} = ${money(pay.overtimePay)}`,
            ]}
          />
        ) : null}

        <div className="flex justify-end">
          <ResetButton onReset={() => setRows(DAYS.map(() => ({ start: "", end: "", breakMinutes: "" })))}>
            Clear all days
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
