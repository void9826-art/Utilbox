"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import {
  SHOE_SYSTEMS,
  footLengthFromSize,
  sizeFromFootLength,
  type ShoeSystem,
} from "@/lib/sizing";

import {
  EmptyResult,
  NumberField,
  ResultCard,
  ScheduleTable,
  SelectField,
  parseNumber,
} from "../calculators/_shared";

type Mode = "size" | "foot";

const CHART_LENGTHS = Array.from({ length: 21 }, (_, index) => 21 + index * 0.5);

function formatSize(value: number, unit: string): string {
  const number = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return unit ? `${number} ${unit}` : number;
}

export default function ShoeSizeConverter() {
  const [mode, setMode] = React.useState<Mode>("size");
  const [system, setSystem] = React.useState<ShoeSystem>("us-men");
  const [size, setSize] = React.useState("9");
  const [foot, setFoot] = React.useState("26");
  const [footUnit, setFootUnit] = React.useState<"cm" | "in">("cm");

  const selected = SHOE_SYSTEMS.find((entry) => entry.id === system) ?? SHOE_SYSTEMS[0];
  const sizeValue = parseNumber(size);
  const footValue = parseNumber(foot);

  let footCm: number | null = null;
  let error: string | null = null;
  if (mode === "size") {
    if (sizeValue === null || sizeValue < selected.min || sizeValue > selected.max) {
      error = `Enter a ${selected.label} size between ${selected.min} and ${selected.max}.`;
    } else {
      footCm = footLengthFromSize(system, sizeValue);
    }
  } else {
    const cm = footValue === null ? null : footUnit === "cm" ? footValue : footValue * 2.54;
    if (cm === null || cm < 15 || cm > 38) {
      error = footUnit === "cm" ? "Enter a foot length between 15 and 38 cm." : "Enter a foot length between 6 and 15 inches.";
    } else {
      footCm = cm;
    }
  }

  const nearestChartRow =
    footCm === null ? -1 : CHART_LENGTHS.reduce((best, length, index) => (Math.abs(length - footCm!) < Math.abs(CHART_LENGTHS[best] - footCm!) ? index : best), 0);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="shoe-mode"
          ariaLabel="Start from"
          value={mode}
          onChange={setMode}
          options={[
            { value: "size", label: "A shoe size" },
            { value: "foot", label: "Foot length" },
          ]}
          className="sm:max-w-sm"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "size" ? (
            <>
              <SelectField label="Sizing system" id="shoe-system" value={system} onChange={(value) => setSystem(value as ShoeSystem)}>
                {SHOE_SYSTEMS.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
              </SelectField>
              <NumberField
                id="shoe-size"
                label="Size"
                value={size}
                onChange={setSize}
                min={selected.min}
                max={selected.max}
                step={selected.step}
                suffix={selected.unit || undefined}
              />
            </>
          ) : (
            <>
              <NumberField id="shoe-foot" label="Foot length" value={foot} onChange={setFoot} min={0} step="0.1" suffix={footUnit} />
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Unit</span>
                <Segmented
                  name="shoe-foot-unit"
                  ariaLabel="Foot length unit"
                  value={footUnit}
                  onChange={setFootUnit}
                  options={[
                    { value: "cm", label: "Centimetres" },
                    { value: "in", label: "Inches" },
                  ]}
                />
              </div>
            </>
          )}
        </div>

        {footCm !== null ? (
          <div className="space-y-4">
            <ResultCard
              label="Estimated foot length"
              value={`${footCm.toFixed(1)} cm`}
              sublabel={`${(footCm / 2.54).toFixed(2)} inches — the most reliable figure to compare with a brand's own size chart.`}
            />
            <StatGrid className="sm:grid-cols-3">
              {SHOE_SYSTEMS.map((entry) => (
                <Stat
                  key={entry.id}
                  label={entry.label}
                  value={formatSize(sizeFromFootLength(entry.id, footCm!), entry.unit)}
                  emphasis={mode === "size" && entry.id === system}
                  hint={mode === "size" && entry.id === system ? "Your size" : undefined}
                />
              ))}
            </StatGrid>
          </div>
        ) : (
          <EmptyResult message={error ?? "Enter a size."} />
        )}

        <Alert tone="info" title="Brands differ">
          These sizes come from the standard definitions of each system. Individual brands use their own charts and can
          be up to a full size different, so check the maker&apos;s chart against your foot length before buying.
        </Alert>

        <ScheduleTable
          caption="Shoe size chart by foot length"
          columns={["Foot length", ...SHOE_SYSTEMS.map((entry) => entry.label)]}
          rows={CHART_LENGTHS.map((length, index) => [
            index === nearestChartRow ? `${length.toFixed(1)} cm ◀ closest` : `${length.toFixed(1)} cm`,
            ...SHOE_SYSTEMS.map((entry) => formatSize(sizeFromFootLength(entry.id, length), entry.unit)),
          ])}
          maxHeight="22rem"
        />
      </div>
    </ToolFrame>
  );
}
