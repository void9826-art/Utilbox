"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { formatDecimal, formatNumber } from "@/lib/utils";

import { EmptyResult, NumberField, ResultCard, Working, parseNumber } from "./_shared";

type Mode = "of" | "isWhatPercent" | "change" | "addSubtract";

const MODES: Array<{ value: Mode; label: string; title: string }> = [
  { value: "of", label: "X% of Y", title: "What is X percent of Y" },
  { value: "isWhatPercent", label: "X is ?% of Y", title: "X is what percent of Y" },
  { value: "change", label: "% change", title: "Percentage increase or decrease" },
  { value: "addSubtract", label: "Add / subtract %", title: "Add or subtract a percentage" },
];

const EMPTY = { a: "", b: "" };

export default function PercentageCalculator() {
  const [mode, setMode] = React.useState<Mode>("of");
  const [values, setValues] = React.useState<Record<Mode, { a: string; b: string }>>({
    of: { a: "15", b: "240" },
    isWhatPercent: { a: "36", b: "240" },
    change: { a: "80", b: "60" },
    addSubtract: { a: "50", b: "20" },
  });
  const [operation, setOperation] = React.useState<"add" | "subtract">("add");

  const current = values[mode];
  const setValue = (key: "a" | "b", value: string) =>
    setValues((previous) => ({ ...previous, [mode]: { ...previous[mode], [key]: value } }));

  const a = parseNumber(current.a);
  const b = parseNumber(current.b);

  const result = React.useMemo(() => {
    if (a === null || b === null) return null;

    switch (mode) {
      case "of": {
        const value = (a / 100) * b;
        return {
          label: `${formatDecimal(a)}% of ${formatDecimal(b)}`,
          value: formatDecimal(value),
          sublabel: null as string | null,
          working: [
            `${formatDecimal(a)} ÷ 100 = ${formatDecimal(a / 100)}`,
            `${formatDecimal(a / 100)} × ${formatDecimal(b)} = ${formatDecimal(value)}`,
          ],
          breakdown: [
            { label: "Remaining amount", value: formatDecimal(b - value) },
            { label: "As a fraction", value: `${formatDecimal(a)}⁄100` },
          ],
        };
      }

      case "isWhatPercent": {
        if (b === 0) {
          return {
            label: "Not defined",
            value: "—",
            sublabel: "You cannot express a number as a percentage of zero.",
            working: [],
            breakdown: [],
          };
        }
        const value = (a / b) * 100;
        return {
          label: `${formatDecimal(a)} as a percentage of ${formatDecimal(b)}`,
          value: `${formatDecimal(value)}%`,
          sublabel: null,
          working: [
            `${formatDecimal(a)} ÷ ${formatDecimal(b)} = ${formatDecimal(a / b)}`,
            `${formatDecimal(a / b)} × 100 = ${formatDecimal(value)}%`,
          ],
          breakdown: [
            { label: "Difference", value: formatDecimal(b - a) },
            { label: "Remaining percentage", value: `${formatDecimal(100 - value)}%` },
          ],
        };
      }

      case "change": {
        if (a === 0) {
          return {
            label: "Not defined",
            value: "—",
            sublabel: "Percentage change cannot be measured from a starting value of zero.",
            working: [],
            breakdown: [],
          };
        }
        const difference = b - a;
        const value = (difference / a) * 100;
        const direction = difference > 0 ? "increase" : difference < 0 ? "decrease" : "no change";
        return {
          label: `Change from ${formatDecimal(a)} to ${formatDecimal(b)}`,
          value: `${formatDecimal(Math.abs(value))}%`,
          sublabel: `That is ${direction === "no change" ? "no change" : `a ${direction}`} of ${formatDecimal(Math.abs(difference))}.`,
          working: [
            `${formatDecimal(b)} − ${formatDecimal(a)} = ${formatDecimal(difference)}`,
            `${formatDecimal(difference)} ÷ ${formatDecimal(a)} = ${formatDecimal(difference / a)}`,
            `${formatDecimal(difference / a)} × 100 = ${formatDecimal(value)}%`,
          ],
          breakdown: [
            { label: "Absolute difference", value: formatDecimal(Math.abs(difference)) },
            {
              label: "Reverse change needed",
              value:
                b === 0 ? "—" : `${formatDecimal(Math.abs(((a - b) / b) * 100))}%`,
            },
          ],
        };
      }

      case "addSubtract": {
        const delta = (a * b) / 100;
        const value = operation === "add" ? a + delta : a - delta;
        return {
          label: `${formatDecimal(a)} ${operation === "add" ? "plus" : "minus"} ${formatDecimal(b)}%`,
          value: formatDecimal(value),
          sublabel: `${operation === "add" ? "Added" : "Subtracted"}: ${formatDecimal(delta)}`,
          working: [
            `${formatDecimal(a)} × ${formatDecimal(b)} ÷ 100 = ${formatDecimal(delta)}`,
            `${formatDecimal(a)} ${operation === "add" ? "+" : "−"} ${formatDecimal(delta)} = ${formatDecimal(value)}`,
          ],
          breakdown: [
            { label: "Amount changed", value: formatDecimal(delta) },
            { label: "Multiplier used", value: formatNumber(operation === "add" ? 1 + b / 100 : 1 - b / 100, { maximumFractionDigits: 4 }) },
          ],
        };
      }
    }
  }, [a, b, mode, operation]);

  const labels: Record<Mode, [string, string]> = {
    of: ["Percentage", "Of what number"],
    isWhatPercent: ["This number", "Is what percent of"],
    change: ["Original value", "New value"],
    addSubtract: ["Starting number", "Percentage"],
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="percentage-mode"
          ariaLabel="Calculation type"
          value={mode}
          onChange={(value) => setMode(value)}
          options={MODES}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="percentage-a"
            label={labels[mode][0]}
            value={current.a}
            onChange={(value) => setValue("a", value)}
            suffix={mode === "of" ? "%" : undefined}
            placeholder="0"
          />
          <NumberField
            id="percentage-b"
            label={labels[mode][1]}
            value={current.b}
            onChange={(value) => setValue("b", value)}
            suffix={mode === "addSubtract" ? "%" : undefined}
            placeholder="0"
          />
        </div>

        {mode === "addSubtract" ? (
          <Segmented
            name="percentage-operation"
            ariaLabel="Add or subtract"
            value={operation}
            onChange={(value) => setOperation(value)}
            options={[
              { value: "add", label: "Add the percentage" },
              { value: "subtract", label: "Subtract the percentage" },
            ]}
            className="sm:max-w-md"
          />
        ) : null}

        {result ? (
          <div className="space-y-3">
            <ResultCard
              label={result.label}
              value={result.value}
              sublabel={result.sublabel}
              breakdown={result.breakdown}
            />
            <Working lines={result.working} />
          </div>
        ) : (
          <EmptyResult message="Enter both numbers to see the result." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setValues((previous) => ({ ...previous, [mode]: EMPTY }));
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
