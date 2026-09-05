"use client";

import { VOLUME_UNITS } from "@/lib/units";

import { UnitConverter } from "./_unit-converter";

const PRESETS = [
    { label: "litres to US gallons", from: "l", to: "gal_us" },
    { label: "litres to UK gallons", from: "l", to: "gal_uk" },
    { label: "ml to US cups", from: "ml", to: "cup_us" },
    { label: "US cups to ml", from: "cup_us", to: "ml" },
    { label: "tbsp to ml", from: "tbsp_us", to: "ml" },
];

export default function VolumeConverter() {
  return (
    <UnitConverter
      set={VOLUME_UNITS}
      presets={PRESETS}
      footnote={
        <p>
          US and imperial units of the same name are different sizes — a US gallon is 3.785 L against an imperial 4.546 L — so they are listed as separate entries. Check which one your recipe or fuel figure means.
        </p>
      }
    />
  );
}
