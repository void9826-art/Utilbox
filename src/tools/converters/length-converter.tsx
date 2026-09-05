"use client";

import { LENGTH_UNITS } from "@/lib/units";

import { UnitConverter } from "./_unit-converter";

const PRESETS = [
    { label: "cm to inches", from: "cm", to: "in" },
    { label: "metres to feet", from: "m", to: "ft" },
    { label: "km to miles", from: "km", to: "mi" },
    { label: "inches to cm", from: "in", to: "cm" },
    { label: "feet to metres", from: "ft", to: "m" },
    { label: "miles to km", from: "mi", to: "km" },
];

export default function LengthConverter() {
  return (
    <UnitConverter
      set={LENGTH_UNITS}
      presets={PRESETS}
      footnote={
        <p>
          Every factor comes from the international definitions: an inch is exactly 25.4 mm, a mile exactly 1609.344 m, and a nautical mile exactly 1852 m.
        </p>
      }
    />
  );
}
