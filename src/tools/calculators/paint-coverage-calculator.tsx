"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Segmented } from "@/components/ui/field";
import { bestCans, paintNeeded, wallpaperRolls, type UnitSystem } from "@/lib/household";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, NumberField, ResultCard, Working, parseNumber } from "./_shared";

type Mode = "paint" | "wallpaper";

const DEFAULTS: Record<UnitSystem, Record<string, string>> = {
  metric: {
    length: "4",
    width: "3",
    height: "2.5",
    doors: "1",
    windows: "1",
    doorArea: "1.9",
    windowArea: "1.5",
    coats: "2",
    coverage: "12",
    waste: "10",
    rollWidth: "0.53",
    rollLength: "10.05",
    repeat: "0",
    trim: "10",
  },
  imperial: {
    length: "13",
    width: "10",
    height: "8",
    doors: "1",
    windows: "1",
    doorArea: "21",
    windowArea: "15",
    coats: "2",
    coverage: "400",
    waste: "10",
    rollWidth: "20.5",
    rollLength: "33",
    repeat: "0",
    trim: "4",
  },
};

const UNITS: Record<UnitSystem, { length: string; area: string; volume: string; coverage: string; small: string }> = {
  metric: { length: "m", area: "m²", volume: "L", coverage: "m²/L", small: "cm" },
  imperial: { length: "ft", area: "ft²", volume: "gal", coverage: "ft²/gal", small: "in" },
};

const fmt = (value: number, digits = 1) => formatNumber(value, { maximumFractionDigits: digits });

function canLabel(size: number, system: UnitSystem): string {
  if (system === "metric") return `${size} L tin`;
  if (size === 5) return "5-gallon bucket";
  if (size === 1) return "1-gallon can";
  return "quart";
}

export default function PaintCoverageCalculator() {
  const [mode, setMode] = React.useState<Mode>("paint");
  const [system, setSystem] = React.useState<UnitSystem>("metric");
  const [values, setValues] = React.useState(DEFAULTS.metric);
  const [ceiling, setCeiling] = React.useState(false);

  const units = UNITS[system];
  const set = (key: string) => (value: string) => setValues((previous) => ({ ...previous, [key]: value }));
  const n = (key: string) => parseNumber(values[key] ?? "");

  const length = n("length");
  const width = n("width");
  const height = n("height");
  const roomValid = length !== null && width !== null && height !== null && length > 0 && width >= 0 && height > 0;

  let paintResult: React.ReactNode = null;
  if (mode === "paint") {
    const doors = n("doors");
    const windows = n("windows");
    const doorArea = n("doorArea");
    const windowArea = n("windowArea");
    const coats = n("coats");
    const coverage = n("coverage");
    const waste = n("waste");
    const valid =
      roomValid &&
      [doors, windows, doorArea, windowArea, waste].every((value) => value !== null && value >= 0) &&
      coats !== null &&
      coats >= 1 &&
      coverage !== null &&
      coverage > 0;

    if (valid) {
      const result = paintNeeded({
        length: length!,
        width: width!,
        height: height!,
        doors: doors!,
        windows: windows!,
        doorArea: doorArea!,
        windowArea: windowArea!,
        coats: coats!,
        coverage: coverage!,
        wastePercent: waste!,
        includeCeiling: ceiling,
      });
      const cans = bestCans(result.paint, system);
      paintResult = (
        <div className="space-y-4">
          <ResultCard
            label="Paint to buy"
            value={`${fmt(result.paint, 2)} ${units.volume}`}
            sublabel={
              cans.counts.length > 0
                ? `Buy ${cans.counts.map((entry) => `${entry.count} × ${canLabel(entry.size, system)}`).join(" + ")} (${fmt(cans.total, 2)} ${units.volume}).`
                : "No paint needed for this area."
            }
            breakdown={[
              { label: "Area to paint", value: `${fmt(result.paintableArea)} ${units.area}` },
              { label: "Paint per coat", value: `${fmt(result.paintableArea / coverage!, 2)} ${units.volume}` },
            ]}
          />
          <Working
            lines={[
              `Walls = 2 × (${length} + ${width}) × ${height} = ${fmt(result.wallArea, 2)} ${units.area}`,
              `Doors and windows = ${doors} × ${doorArea} + ${windows} × ${windowArea} = ${fmt(result.openingsArea, 2)} ${units.area}`,
              ceiling ? `Ceiling = ${length} × ${width} = ${fmt(result.ceilingArea, 2)} ${units.area}` : "Ceiling not included",
              `Area = ${fmt(result.paintableArea, 2)} ${units.area}`,
              `Paint = ${fmt(result.paintableArea, 2)} × ${coats} coats ÷ ${coverage} × ${fmt(1 + waste! / 100, 2)} = ${fmt(result.paint, 3)} ${units.volume}`,
            ]}
          />
        </div>
      );
    } else {
      paintResult = <EmptyResult message="Enter the room size, at least one coat and a coverage above zero." />;
    }
  } else {
    const rollWidth = n("rollWidth");
    const rollLength = n("rollLength");
    const repeat = n("repeat");
    const trim = n("trim");
    const valid =
      roomValid &&
      rollWidth !== null &&
      rollWidth > 0 &&
      rollLength !== null &&
      rollLength > 0 &&
      repeat !== null &&
      repeat >= 0 &&
      trim !== null &&
      trim >= 0;
    // Roll width is entered in m or inches, repeat and trim in cm or inches.
    const toLength = (value: number, small: boolean) =>
      system === "metric" ? (small ? value / 100 : value) : small ? value / 12 : value;
    const result = valid
      ? wallpaperRolls({
          perimeter: 2 * (length! + width!),
          height: height!,
          rollWidth: system === "metric" ? rollWidth! : rollWidth! / 12,
          rollLength: rollLength!,
          patternRepeat: toLength(repeat!, true),
          trim: toLength(trim!, true),
        })
      : null;

    paintResult = result ? (
      <div className="space-y-4">
        <ResultCard
          label="Rolls of wallpaper"
          value={String(result.rolls)}
          sublabel="Consider one extra roll from the same batch number, in case of mistakes or later repairs."
          breakdown={[
            { label: "Full-height drops needed", value: String(result.drops) },
            { label: "Drops per roll", value: String(result.dropsPerRoll) },
          ]}
        />
        <Working
          lines={[
            `Perimeter = 2 × (${length} + ${width}) = ${fmt(2 * (length! + width!), 2)} ${units.length}`,
            `Drop = height + repeat + trim = ${fmt(result.dropLength, 3)} ${units.length}`,
            `Drops per roll = ⌊${rollLength} ÷ ${fmt(result.dropLength, 3)}⌋ = ${result.dropsPerRoll}`,
            `Drops = ⌈perimeter ÷ roll width⌉ = ${result.drops}`,
            `Rolls = ⌈${result.drops} ÷ ${result.dropsPerRoll}⌉ = ${result.rolls}`,
          ]}
        />
      </div>
    ) : (
      <EmptyResult
        message={
          valid
            ? "The roll is shorter than one drop. Check the roll length and wall height."
            : "Enter the room size, roll width and roll length."
        }
      />
    );
  }

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <Segmented
            name="paint-mode"
            ariaLabel="What to calculate"
            value={mode}
            onChange={setMode}
            options={[
              { value: "paint", label: "Paint" },
              { value: "wallpaper", label: "Wallpaper" },
            ]}
            className="sm:w-64"
          />
          <Segmented
            name="paint-units"
            ariaLabel="Units"
            value={system}
            onChange={(value) => {
              setSystem(value);
              setValues(DEFAULTS[value]);
            }}
            options={[
              { value: "metric", label: "Metric" },
              { value: "imperial", label: "US / imperial" },
            ]}
            className="sm:w-72"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField id="paint-length" label="Room length" value={values.length} onChange={set("length")} suffix={units.length} min={0} />
          <NumberField id="paint-width" label="Room width" value={values.width} onChange={set("width")} suffix={units.length} min={0} />
          <NumberField id="paint-height" label="Wall height" value={values.height} onChange={set("height")} suffix={units.length} min={0} />
        </div>

        {mode === "paint" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumberField id="paint-doors" label="Doors" value={values.doors} onChange={set("doors")} min={0} step={1} inputMode="numeric" />
              <NumberField id="paint-door-area" label="Area per door" value={values.doorArea} onChange={set("doorArea")} suffix={units.area} min={0} />
              <NumberField id="paint-windows" label="Windows" value={values.windows} onChange={set("windows")} min={0} step={1} inputMode="numeric" />
              <NumberField id="paint-window-area" label="Area per window" value={values.windowArea} onChange={set("windowArea")} suffix={units.area} min={0} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField id="paint-coats" label="Coats" value={values.coats} onChange={set("coats")} min={1} step={1} inputMode="numeric" />
              <NumberField
                id="paint-coverage"
                label="Coverage"
                value={values.coverage}
                onChange={set("coverage")}
                suffix={units.coverage}
                min={0}
                hint="Printed on the tin."
              />
              <NumberField id="paint-waste" label="Extra for waste" value={values.waste} onChange={set("waste")} suffix="%" min={0} />
            </div>
            <Checkbox label="Include the ceiling" checked={ceiling} onChange={(event) => setCeiling(event.target.checked)} />
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NumberField
              id="paper-roll-width"
              label="Roll width"
              value={values.rollWidth}
              onChange={set("rollWidth")}
              suffix={system === "metric" ? "m" : "in"}
              min={0}
            />
            <NumberField id="paper-roll-length" label="Roll length" value={values.rollLength} onChange={set("rollLength")} suffix={units.length} min={0} />
            <NumberField
              id="paper-repeat"
              label="Pattern repeat"
              value={values.repeat}
              onChange={set("repeat")}
              suffix={units.small}
              min={0}
              hint="0 for plain paper."
            />
            <NumberField id="paper-trim" label="Trim per drop" value={values.trim} onChange={set("trim")} suffix={units.small} min={0} />
          </div>
        )}

        {paintResult}
      </div>
    </ToolFrame>
  );
}
