"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Field, Input, Segmented, Textarea } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { addToClock, formatDuration, formatHoursMinutes, parseDuration, parseTime, shiftMinutes } from "@/lib/timecard";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, ResultCard, SelectField } from "./_shared";

type Mode = "between" | "add" | "sum";

const pad = (value: number) => String(value).padStart(2, "0");
const clock = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

export default function TimeDurationCalculator() {
  const [mode, setMode] = React.useState<Mode>("between");
  const [start, setStart] = React.useState("09:15");
  const [end, setEnd] = React.useState("17:40");
  const [base, setBase] = React.useState("22:30");
  const [amount, setAmount] = React.useState("3h 45m");
  const [direction, setDirection] = React.useState<"add" | "subtract">("add");
  const [list, setList] = React.useState("1:45\n2:30\n0:50\n1h 15m");
  const [twoPart, setTwoPart] = React.useState<"hm" | "ms">("hm");

  const between = React.useMemo(() => {
    const a = parseTime(start);
    const b = parseTime(end);
    if (a === null || b === null) return null;
    return { minutes: shiftMinutes(a, b), overnight: b < a };
  }, [end, start]);

  const added = React.useMemo(() => {
    const from = parseTime(base);
    const seconds = parseDuration(amount);
    if (from === null || seconds === null) return null;
    const delta = Math.round(seconds / 60) * (direction === "add" ? 1 : -1);
    return addToClock(from, delta);
  }, [amount, base, direction]);

  const summed = React.useMemo(() => {
    const lines = list.split("\n").map((line) => line.trim()).filter(Boolean);
    const parsed = lines.map((line) => ({ line, seconds: parseDuration(line, twoPart) }));
    const total = parsed.reduce((sum, entry) => sum + (entry.seconds ?? 0), 0);
    return { parsed, total, invalid: parsed.filter((entry) => entry.seconds === null).map((entry) => entry.line) };
  }, [list, twoPart]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="duration-mode"
          ariaLabel="Calculation"
          value={mode}
          onChange={setMode}
          options={[
            { value: "between", label: "Between times" },
            { value: "add", label: "Add / subtract" },
            { value: "sum", label: "Add up" },
          ]}
        />

        {mode === "between" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start time" htmlFor="dur-start">
                <Input id="dur-start" type="time" value={start} onChange={(event) => setStart(event.target.value)} />
              </Field>
              <Field label="End time" htmlFor="dur-end" hint="Earlier than the start? It counts as the next day.">
                <Input id="dur-end" type="time" value={end} onChange={(event) => setEnd(event.target.value)} />
              </Field>
            </div>
            {between ? (
              <ResultCard
                label="Duration"
                value={`${Math.floor(between.minutes / 60)} h ${between.minutes % 60} min`}
                sublabel={between.overnight ? "Across midnight into the next day." : `From ${start} to ${end}.`}
                breakdown={[
                  { label: "Decimal hours", value: formatNumber(between.minutes / 60, { maximumFractionDigits: 2 }) },
                  { label: "Total minutes", value: formatNumber(between.minutes) },
                ]}
              />
            ) : (
              <EmptyResult message="Choose a start and an end time." />
            )}
          </>
        ) : null}

        {mode === "add" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Start time" htmlFor="dur-base">
                <Input id="dur-base" type="time" value={base} onChange={(event) => setBase(event.target.value)} />
              </Field>
              <SelectField label="Add or subtract" id="dur-direction" value={direction} onChange={(value) => setDirection(value as "add" | "subtract")}>
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
              </SelectField>
              <Field label="Duration" htmlFor="dur-amount" hint="e.g. 3h 45m, 2:30 or 90 (minutes)">
                <Input id="dur-amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
              </Field>
            </div>
            {added ? (
              <ResultCard
                label="Result"
                value={clock(added.minutes)}
                sublabel={
                  added.dayOffset === 0
                    ? "Same day."
                    : `${Math.abs(added.dayOffset)} day${Math.abs(added.dayOffset) === 1 ? "" : "s"} ${added.dayOffset > 0 ? "later" : "earlier"}.`
                }
              />
            ) : (
              <EmptyResult message="Enter a start time and a duration such as 1h 30m or 1:30." />
            )}
          </>
        ) : null}

        {mode === "sum" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
              <Field label="Durations, one per line" htmlFor="dur-list" hint="1:30, 1h 30m, 90m, 45s or 1:02:03.">
                <Textarea id="dur-list" rows={7} value={list} onChange={(event) => setList(event.target.value)} className="font-mono text-[0.8125rem]" />
              </Field>
              <SelectField label="Two-part values like 1:30 mean" id="dur-two-part" value={twoPart} onChange={(value) => setTwoPart(value as "hm" | "ms")}>
                <option value="hm">hours:minutes</option>
                <option value="ms">minutes:seconds</option>
              </SelectField>
            </div>
            <ResultCard
              label="Total"
              value={formatDuration(summed.total, summed.total % 60 !== 0)}
              sublabel={`${summed.parsed.length - summed.invalid.length} of ${summed.parsed.length} lines added.`}
              breakdown={[
                { label: "Decimal hours", value: formatNumber(summed.total / 3600, { maximumFractionDigits: 2 }) },
                { label: "Total minutes", value: formatNumber(summed.total / 60, { maximumFractionDigits: 2 }) },
              ]}
            />
            {summed.invalid.length > 0 ? (
              <p className="text-sm text-fg-muted" role="status">
                Not understood, so left out: {summed.invalid.map((line) => `“${line}”`).join(", ")}
              </p>
            ) : null}
            <StatGrid className="sm:grid-cols-3">
              <Stat label="Hours and minutes" value={formatHoursMinutes(Math.round(summed.total / 60))} />
              <Stat label="Days" value={formatNumber(summed.total / 86400, { maximumFractionDigits: 2 })} />
              <Stat label="Average" value={summed.parsed.length - summed.invalid.length > 0 ? formatDuration(summed.total / (summed.parsed.length - summed.invalid.length)) : "—"} />
            </StatGrid>
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
