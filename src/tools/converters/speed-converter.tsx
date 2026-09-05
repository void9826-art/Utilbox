"use client";

import { SPEED_UNITS } from "@/lib/units";

import { UnitConverter } from "./_unit-converter";

const PRESETS = [
    { label: "km/h to mph", from: "kph", to: "mph" },
    { label: "mph to km/h", from: "mph", to: "kph" },
    { label: "m/s to km/h", from: "mps", to: "kph" },
    { label: "knots to km/h", from: "knot", to: "kph" },
    { label: "min/km to km/h", from: "minkm", to: "kph" },
];

export default function SpeedConverter() {
  return (
    <UnitConverter
      set={SPEED_UNITS}
      presets={PRESETS}
      footnote={
        <p>
          Mach uses the sea-level speed of sound at 15 °C (340.29 m/s). The speed of sound falls with air temperature, so Mach 1 at cruising altitude is a considerably slower ground speed.
        </p>
      }
    />
  );
}
