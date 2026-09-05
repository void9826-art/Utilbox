"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatMoney, roundMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

import {
  CurrencySelect,
  EmptyResult,
  NumberField,
  ResultCard,
  Working,
  parseNumber,
} from "./_shared";

/** Standard headline rates, offered as shortcuts rather than as tax advice. */
const PRESETS = [
  { label: "UK VAT", rate: 20 },
  { label: "EU (typical)", rate: 21 },
  { label: "India GST", rate: 18 },
  { label: "Australia GST", rate: 10 },
  { label: "Canada GST", rate: 5 },
  { label: "Singapore GST", rate: 9 },
];

export default function TaxCalculator() {
  const [mode, setMode] = React.useState<"add" | "remove">("add");
  const [amount, setAmount] = React.useState("200");
  const [rate, setRate] = React.useState("20");
  const [currency, setCurrency] = React.useState("GBP");

  const amountValue = parseNumber(amount);
  const rateValue = parseNumber(rate);
  const money = (value: number) => formatMoney(value, currency);

  const result = React.useMemo(() => {
    if (amountValue === null || rateValue === null || amountValue < 0 || rateValue < 0 || rateValue > 100) {
      return null;
    }

    const multiplier = 1 + rateValue / 100;

    if (mode === "add") {
      const taxAmount = roundMoney((amountValue * rateValue) / 100);
      return {
        net: roundMoney(amountValue),
        tax: taxAmount,
        gross: roundMoney(amountValue + taxAmount),
        working: [
          `Tax   = ${money(amountValue)} × ${rateValue}/100 = ${money(taxAmount)}`,
          `Gross = ${money(amountValue)} + ${money(taxAmount)} = ${money(roundMoney(amountValue + taxAmount))}`,
        ],
      };
    }

    // Extracting tax divides by the multiplier — subtracting the rate is wrong.
    const net = roundMoney(amountValue / multiplier);
    return {
      net,
      tax: roundMoney(amountValue - net),
      gross: roundMoney(amountValue),
      working: [
        `Net   = ${money(amountValue)} ÷ ${multiplier.toFixed(4)} = ${money(net)}`,
        `Tax   = ${money(amountValue)} − ${money(net)} = ${money(roundMoney(amountValue - net))}`,
        `Note  : taking ${rateValue}% off ${money(amountValue)} would give ${money(roundMoney(amountValue * (1 - rateValue / 100)))}, which is not the net amount.`,
      ],
    };
    // The money formatter is rebuilt every render but only ever varies with the currency,
    // which is already a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountValue, currency, mode, rateValue]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="tax-mode"
          ariaLabel="Add or remove tax"
          value={mode}
          onChange={setMode}
          options={[
            { value: "add", label: "Add tax to a net price" },
            { value: "remove", label: "Remove tax from a total" },
          ]}
          className="sm:max-w-lg"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="tax-amount"
            label={mode === "add" ? "Amount before tax" : "Total including tax"}
            value={amount}
            onChange={setAmount}
            min={0}
          />
          <NumberField
            id="tax-rate"
            label="Tax rate"
            value={rate}
            onChange={setRate}
            suffix="%"
            min={0}
            max={100}
            step="0.01"
          />
        </div>

        <div>
          <span className="block text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
            Common rates
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setRate(String(preset.rate))}
                aria-pressed={rateValue === preset.rate}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                  rateValue === preset.rate
                    ? "border-accent-soft-border bg-accent-soft text-accent-text"
                    : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {preset.label} {preset.rate}%
              </button>
            ))}
          </div>
        </div>

        <CurrencySelect value={currency} onChange={setCurrency} id="tax-currency" />

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label={mode === "add" ? "Total including tax" : "Amount before tax"}
              value={mode === "add" ? money(result.gross) : money(result.net)}
              sublabel={`Tax at ${rateValue}% is ${money(result.tax)}.`}
              breakdown={[
                { label: "Net (before tax)", value: money(result.net) },
                { label: "Gross (including tax)", value: money(result.gross) },
              ]}
            />

            <StatGrid className="sm:grid-cols-3">
              <Stat label="Net" value={money(result.net)} />
              <Stat label="Tax" value={money(result.tax)} emphasis />
              <Stat label="Gross" value={money(result.gross)} />
            </StatGrid>

            <Working lines={result.working} />
          </div>
        ) : (
          <EmptyResult message="Enter an amount and a tax rate between 0% and 100%." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setAmount("");
              setRate("20");
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
