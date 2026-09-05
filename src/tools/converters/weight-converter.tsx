"use client";

import { WEIGHT_UNITS } from "@/lib/units";

import { UnitConverter } from "./_unit-converter";

const PRESETS = [
    { label: "kg to lb", from: "kg", to: "lb" },
    { label: "lb to kg", from: "lb", to: "kg" },
    { label: "kg to stone", from: "kg", to: "st" },
    { label: "g to oz", from: "g", to: "oz" },
    { label: "tonnes to lb", from: "t", to: "lb" },
];

export default function WeightConverter() {
  return (
    <UnitConverter
      set={WEIGHT_UNITS}
      presets={PRESETS}
      footnote={
        <p>
          The avoirdupois pound is exactly 0.45359237 kg. Note that the three units called a ton are all different sizes and are listed separately.
        </p>
      }
    />
  );
}
