"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Field, Input } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, ResultCard, Working } from "./_shared";

function toDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  // Reject impossible dates such as 2025-02-30, which Date silently rolls over.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

function todayString(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

interface AgeParts {
  years: number;
  months: number;
  days: number;
}

/**
 * Counts whole years, then whole months, then the remaining days — borrowing
 * from the real previous calendar month so month lengths are respected.
 */
function exactAge(from: Date, to: Date): AgeParts {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    // Day 0 of the target's month is the last day of the month before it.
    const daysInPreviousMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

const MS_PER_DAY = 86_400_000;

function wholeDaysBetween(from: Date, to: Date): number {
  // Compare at UTC midnight so daylight-saving shifts cannot round a day away.
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / MS_PER_DAY);
}

function nextBirthday(birth: Date, reference: Date): { date: Date; daysAway: number; turning: number } {
  const month = birth.getMonth();
  const day = birth.getDate();

  let candidate = new Date(reference.getFullYear(), month, day);
  // 29 February in a common year is observed on 1 March.
  if (candidate.getMonth() !== month) candidate = new Date(reference.getFullYear(), month + 1, 1);

  if (wholeDaysBetween(reference, candidate) < 0) {
    candidate = new Date(reference.getFullYear() + 1, month, day);
    if (candidate.getMonth() !== month) candidate = new Date(reference.getFullYear() + 1, month + 1, 1);
  }

  return {
    date: candidate,
    daysAway: wholeDaysBetween(reference, candidate),
    turning: candidate.getFullYear() - birth.getFullYear(),
  };
}

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function AgeCalculator() {
  const [birth, setBirth] = React.useState("");
  const [reference, setReference] = React.useState("");

  // Set today's date after mount: doing it during render would differ between
  // the server-rendered HTML and the client.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- today's date in the visitor's timezone is not knowable on the server
  React.useEffect(() => setReference(todayString()), []);

  const birthDate = toDateOnly(birth);
  const referenceDate = toDateOnly(reference);

  const invalidBirth = birth.length > 0 && !birthDate;
  const invalidReference = reference.length > 0 && !referenceDate;
  const reversed = birthDate && referenceDate && wholeDaysBetween(birthDate, referenceDate) < 0;

  const result = React.useMemo(() => {
    if (!birthDate || !referenceDate || reversed) return null;

    const age = exactAge(birthDate, referenceDate);
    const totalDays = wholeDaysBetween(birthDate, referenceDate);
    const birthday = nextBirthday(birthDate, referenceDate);
    const totalMonths = age.years * 12 + age.months;

    return { age, totalDays, birthday, totalMonths };
  }, [birthDate, referenceDate, reversed]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Date of birth"
            htmlFor="age-birth"
            error={invalidBirth ? "Please enter a real date." : null}
          >
            <Input
              id="age-birth"
              type="date"
              value={birth}
              max={reference || undefined}
              onChange={(event) => setBirth(event.target.value)}
              className="tabular"
            />
          </Field>

          <Field
            label="Age at this date"
            htmlFor="age-reference"
            hint="Defaults to today. Change it to work out an age on any date."
            error={
              invalidReference
                ? "Please enter a real date."
                : reversed
                  ? "This date is before the date of birth."
                  : null
            }
          >
            <Input
              id="age-reference"
              type="date"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              className="tabular"
            />
          </Field>
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Exact age"
              value={
                <>
                  {result.age.years}
                  <span className="text-xl font-medium text-fg-muted"> y </span>
                  {result.age.months}
                  <span className="text-xl font-medium text-fg-muted"> m </span>
                  {result.age.days}
                  <span className="text-xl font-medium text-fg-muted"> d</span>
                </>
              }
              sublabel={`Born on ${DATE_FORMAT.format(birthDate!)}`}
              breakdown={[
                {
                  label: "Next birthday",
                  value: `${result.birthday.daysAway === 0 ? "Today" : `${formatNumber(result.birthday.daysAway)} days`}`,
                },
                { label: "Turning", value: `${result.birthday.turning}` },
              ]}
            />

            <StatGrid>
              <Stat label="Total days" value={formatNumber(result.totalDays)} />
              <Stat label="Total weeks" value={formatNumber(Math.floor(result.totalDays / 7))} />
              <Stat label="Total months" value={formatNumber(result.totalMonths)} />
              <Stat label="Total hours" value={formatNumber(result.totalDays * 24)} />
            </StatGrid>

            <Working
              lines={[
                `Years  : ${referenceDate!.getFullYear()} − ${birthDate!.getFullYear()} = ${result.age.years} (after adjusting for the birthday)`,
                `Months : whole months since the last birthday = ${result.age.months}`,
                `Days   : days since that month boundary = ${result.age.days}`,
                `Total  : ${formatNumber(result.totalDays)} days between the two dates`,
                `Next birthday: ${DATE_FORMAT.format(result.birthday.date)}`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult
            message={
              reversed
                ? "The second date must be on or after the date of birth."
                : "Enter a date of birth to work out an exact age."
            }
          />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setBirth("");
              setReference(todayString());
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
