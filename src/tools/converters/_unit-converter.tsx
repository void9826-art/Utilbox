"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Input, Select, Slider } from "@/components/ui/field";
import { convertUnits, getUnit, groupUnits, type UnitSet } from "@/lib/units";
import { cn, formatDecimal } from "@/lib/utils";

import { parseNumber } from "../calculators/_shared";

export interface UnitConverterProps {
  set: UnitSet;
  /** Quick-pick conversions shown as chips under the main pair. */
  presets?: Array<{ label: string; from: string; to: string }>;
  /** Extra reference rows shown beneath the table, e.g. common equivalences. */
  footnote?: React.ReactNode;
}

function formatWithPrecision(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";

  const magnitude = Math.abs(value);
  // Very large or very small values are unreadable in fixed notation.
  if (magnitude >= 1e15 || magnitude < 1e-9) return value.toExponential(4).replace(/\.?0+e/, "e");

  const fixed = value.toFixed(decimals);
  // Trim trailing zeros without turning 1.10 into 1.1 when precision matters.
  return fixed.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}

export function UnitConverter({ set, presets, footnote }: UnitConverterProps) {
  const [fromUnit, setFromUnit] = React.useState(set.defaults[0]);
  const [toUnit, setToUnit] = React.useState(set.defaults[1]);
  const [amount, setAmount] = React.useState("1");
  const [decimals, setDecimals] = React.useState(6);

  const value = parseNumber(amount);
  const groups = React.useMemo(() => groupUnits(set), [set]);

  const converted = value === null ? null : convertUnits(set, value, fromUnit, toUnit);

  // At most eighteen units per set, each a single multiply — memoising this
  // would cost more in bookkeeping than it saves.
  const allConversions =
    value === null
      ? []
      : set.units.map((unit) => ({
          unit,
          result: convertUnits(set, value, fromUnit, unit.id),
        }));

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (converted !== null && Number.isFinite(converted)) {
      setAmount(formatWithPrecision(converted, decimals));
    }
  };

  const fromMeta = getUnit(set, fromUnit);
  const toMeta = getUnit(set, toUnit);
  const resultText = converted === null ? "" : formatWithPrecision(converted, decimals);

  const renderOptions = () =>
    groups.map((group) =>
      group.group ? (
        <optgroup key={group.group} label={group.group}>
          {group.units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name} ({unit.symbol})
            </option>
          ))}
        </optgroup>
      ) : (
        group.units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name} ({unit.symbol})
          </option>
        ))
      ),
    );

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-1.5">
            <label htmlFor="converter-amount" className="text-[0.8125rem] font-medium text-fg">
              From
            </label>
            <Input
              id="converter-amount"
              type="number"
              inputMode="decimal"
              step="any"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="tabular text-lg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Select
              value={fromUnit}
              onChange={(event) => setFromUnit(event.target.value)}
              aria-label="Convert from unit"
            >
              {renderOptions()}
            </Select>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={swap}
            aria-label="Swap the two units"
            className="mb-[3.25rem] justify-self-center sm:mb-9"
          >
            <ArrowLeftRight className="size-4" aria-hidden="true" />
          </Button>

          <div className="space-y-1.5">
            <label htmlFor="converter-result" className="text-[0.8125rem] font-medium text-fg">
              To
            </label>
            <div className="relative">
              <Input
                id="converter-result"
                value={resultText}
                readOnly
                aria-live="polite"
                className="tabular bg-surface-sunken pr-11 text-lg font-semibold"
              />
              <span className="absolute inset-y-0 right-1 flex items-center">
                <CopyButton value={resultText} iconOnly variant="ghost" />
              </span>
            </div>
            <Select
              value={toUnit}
              onChange={(event) => setToUnit(event.target.value)}
              aria-label="Convert to unit"
            >
              {renderOptions()}
            </Select>
          </div>
        </div>

        {value !== null && converted !== null && Number.isFinite(converted) ? (
          <p className="rounded-lg border border-accent-soft-border bg-accent-soft px-3.5 py-2.5 text-center text-sm text-fg">
            <strong className="font-semibold">
              {formatDecimal(value)} {fromMeta.symbol}
            </strong>{" "}
            ={" "}
            <strong className="font-semibold">
              {resultText} {toMeta.symbol}
            </strong>
          </p>
        ) : null}

        {presets && presets.length > 0 ? (
          <div>
            <span className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
              Common conversions
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {presets.map((preset) => {
                const active = preset.from === fromUnit && preset.to === toUnit;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setFromUnit(preset.from);
                      setToUnit(preset.to);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                      active
                        ? "border-accent-soft-border bg-accent-soft text-accent-text"
                        : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <Slider
          label="Decimal places"
          valueLabel={String(decimals)}
          min={0}
          max={12}
          value={decimals}
          onChange={(event) => setDecimals(Number(event.target.value))}
          className="sm:max-w-xs"
        />

        <section className="space-y-2">
          <h2 className="text-[0.8125rem] font-medium text-fg">
            {value === null
              ? "Every unit"
              : `${formatDecimal(value)} ${fromMeta.symbol} in every unit`}
          </h2>
          <div className="scrollbar-slim max-h-96 overflow-y-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">All unit equivalents</caption>
              <tbody>
                {allConversions.map(({ unit, result }) => (
                  <tr
                    key={unit.id}
                    className={cn(
                      "border-b border-border last:border-b-0",
                      unit.id === toUnit && "bg-accent-soft",
                    )}
                  >
                    <th scope="row" className="px-3 py-1.5 text-left font-medium text-fg">
                      {unit.name}
                      <span className="ml-1.5 text-xs text-fg-subtle">{unit.symbol}</span>
                    </th>
                    <td className="tabular px-3 py-1.5 text-right text-fg-muted">
                      {formatWithPrecision(result, decimals)}
                    </td>
                    <td className="w-10 px-1 py-1">
                      <CopyButton
                        value={formatWithPrecision(result, decimals)}
                        iconOnly
                        variant="ghost"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {footnote ? <div className="text-xs leading-relaxed text-fg-muted">{footnote}</div> : null}
      </div>
    </ToolFrame>
  );
}
