"use client";

import * as React from "react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import {
  ABSOLUTE_ZERO,
  TEMPERATURE_SCALES,
  convertTemperature,
  type TemperatureScale,
} from "@/lib/units";
import { cn } from "@/lib/utils";

import { parseNumber } from "../calculators/_shared";

const REFERENCE_POINTS: Array<{ label: string; celsius: number }> = [
  { label: "Absolute zero", celsius: -273.15 },
  { label: "Freezing point of water", celsius: 0 },
  { label: "Comfortable room", celsius: 21 },
  { label: "Human body", celsius: 37 },
  { label: "Hot summer day", celsius: 35 },
  { label: "Boiling point of water", celsius: 100 },
  { label: "Moderate oven", celsius: 180 },
];

function format(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(decimals).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}

export default function TemperatureConverter() {
  // A single source of truth in Celsius keeps the four boxes consistent, but
  // the raw text of whichever box is being edited is kept so typing "-" or
  // "1." does not get rewritten mid-keystroke.
  const [celsius, setCelsius] = React.useState<number | null>(20);
  const [editing, setEditing] = React.useState<{ scale: TemperatureScale; text: string } | null>(null);
  const [decimals, setDecimals] = React.useState(2);

  const valueFor = (scale: TemperatureScale): string => {
    if (editing?.scale === scale) return editing.text;
    if (celsius === null) return "";
    return format(convertTemperature(celsius, "c", scale), decimals);
  };

  const handleChange = (scale: TemperatureScale, text: string) => {
    setEditing({ scale, text });
    const parsed = parseNumber(text);
    setCelsius(parsed === null ? null : convertTemperature(parsed, scale, "c"));
  };

  const belowAbsoluteZero = celsius !== null && celsius < ABSOLUTE_ZERO.c - 1e-9;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {TEMPERATURE_SCALES.map((scale) => (
            <div key={scale.id} className="space-y-1.5">
              <label htmlFor={`temp-${scale.id}`} className="text-[0.8125rem] font-medium text-fg">
                {scale.name}{" "}
                <span className="font-normal text-fg-subtle">{scale.symbol}</span>
              </label>
              <div className="relative">
                <Input
                  id={`temp-${scale.id}`}
                  type="text"
                  inputMode="decimal"
                  value={valueFor(scale.id)}
                  onChange={(event) => handleChange(scale.id, event.target.value)}
                  onBlur={() => setEditing(null)}
                  placeholder="0"
                  className="tabular pr-11 text-lg"
                />
                <span className="absolute inset-y-0 right-1 flex items-center">
                  <CopyButton value={valueFor(scale.id)} iconOnly variant="ghost" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {belowAbsoluteZero ? (
          <Alert tone="warning" title="Below absolute zero">
            −273.15 °C is the coldest temperature that can exist. Values below it are converted
            arithmetically but do not describe anything physically possible.
          </Alert>
        ) : null}

        <div className="space-y-1.5 sm:max-w-xs">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="temp-decimals" className="text-[0.8125rem] font-medium text-fg">
              Decimal places
            </label>
            <span className="tabular text-[0.8125rem] text-fg-muted">{decimals}</span>
          </div>
          <input
            id="temp-decimals"
            type="range"
            min={0}
            max={6}
            value={decimals}
            onChange={(event) => setDecimals(Number(event.target.value))}
            className="h-5 w-full cursor-pointer accent-[var(--accent)]"
          />
        </div>

        <section className="space-y-2">
          <h2 className="text-[0.8125rem] font-medium text-fg">Reference points</h2>
          <div className="scrollbar-slim overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">Common temperatures on all four scales</caption>
              <thead className="bg-surface-sunken">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left font-semibold text-fg">
                    Reference
                  </th>
                  {TEMPERATURE_SCALES.map((scale) => (
                    <th key={scale.id} scope="col" className="px-3 py-2 text-right font-semibold text-fg">
                      {scale.symbol}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REFERENCE_POINTS.map((point) => {
                  const isNearCurrent =
                    celsius !== null && Math.abs(point.celsius - celsius) < 0.5;
                  return (
                    <tr
                      key={point.label}
                      className={cn(
                        "border-t border-border",
                        isNearCurrent && "bg-accent-soft",
                      )}
                    >
                      <th scope="row" className="px-3 py-1.5 text-left font-medium text-fg">
                        {point.label}
                      </th>
                      {TEMPERATURE_SCALES.map((scale) => (
                        <td key={scale.id} className="tabular px-3 py-1.5 text-right text-fg-muted">
                          {format(convertTemperature(point.celsius, "c", scale.id), 2)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-xs leading-relaxed text-fg-muted">
          These scales have different zero points as well as different step sizes, so conversion needs a
          shift and a scale rather than a single factor. −40 is the one temperature where Celsius and
          Fahrenheit read the same.
        </p>
      </div>
    </ToolFrame>
  );
}
