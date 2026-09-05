"use client";

import { TIME_UNITS } from "@/lib/units";

import { UnitConverter } from "./_unit-converter";

const PRESETS = [
    { label: "hours to minutes", from: "h", to: "min" },
    { label: "days to hours", from: "d", to: "h" },
    { label: "minutes to seconds", from: "min", to: "s" },
    { label: "weeks to days", from: "wk", to: "d" },
    { label: "years to days", from: "yr", to: "d" },
];

export default function TimeConverter() {
  return (
    <UnitConverter
      set={TIME_UNITS}
      presets={PRESETS}
      footnote={
        <p>
          Units up to a week are exact. Months and years use the Gregorian mean — 365.2425 days a year, so a month is about 30.44 days. For the gap between two real dates, use the age calculator instead.
        </p>
      }
    />
  );
}
