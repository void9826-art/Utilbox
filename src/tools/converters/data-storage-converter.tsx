"use client";

import { DATA_UNITS } from "@/lib/units";

import { UnitConverter } from "./_unit-converter";

const PRESETS = [
    { label: "MB to GB", from: "MB", to: "GB" },
    { label: "GB to GiB", from: "GB", to: "GiB" },
    { label: "TB to GiB", from: "TB", to: "GiB" },
    { label: "MiB to MB", from: "MiB", to: "MB" },
    { label: "bytes to MB", from: "B", to: "MB" },
];

export default function DataStorageConverter() {
  return (
    <UnitConverter
      set={DATA_UNITS}
      presets={PRESETS}
      footnote={
        <p>
          Decimal units (kB, MB, GB) step in powers of 1,000 and are what drive manufacturers use. Binary units (KiB, MiB, GiB) step in powers of 1,024 and are what operating systems measure with. That is why a 1 TB drive reports as 931 GiB.
        </p>
      }
    />
  );
}
