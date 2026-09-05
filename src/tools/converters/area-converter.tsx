"use client";

import { AREA_UNITS } from "@/lib/units";

import { UnitConverter } from "./_unit-converter";

const PRESETS = [
    { label: "m² to ft²", from: "m2", to: "ft2" },
    { label: "ft² to m²", from: "ft2", to: "m2" },
    { label: "acres to hectares", from: "acre", to: "ha" },
    { label: "hectares to acres", from: "ha", to: "acre" },
    { label: "km² to mi²", from: "km2", to: "mi2" },
];

export default function AreaConverter() {
  return (
    <UnitConverter
      set={AREA_UNITS}
      presets={PRESETS}
      footnote={
        <p>
          Area factors are the squares of the exact length definitions, so a square foot is exactly 0.09290304 m² and an acre exactly 4046.8564224 m².
        </p>
      }
    />
  );
}
