"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { amortise, formatMoney } from "@/lib/money";
import { formatNumber } from "@/lib/utils";

import {
  CurrencySelect,
  EmptyResult,
  NumberField,
  ResultCard,
  ScheduleTable,
  Working,
  parseNumber,
} from "./_shared";

export default function EmiCalculator() {
  const [principal, setPrincipal] = React.useState("500000");
  const [rate, setRate] = React.useState("9");
  const [tenure, setTenure] = React.useState("5");
  const [tenureUnit, setTenureUnit] = React.useState<"years" | "months">("years");
  const [currency, setCurrency] = React.useState("USD");

  const principalValue = parseNumber(principal);
  const rateValue = parseNumber(rate);
  const tenureValue = parseNumber(tenure);

  const result = React.useMemo(() => {
    if (
      principalValue === null ||
      rateValue === null ||
      tenureValue === null ||
      principalValue <= 0 ||
      rateValue < 0 ||
      tenureValue <= 0
    ) {
      return null;
    }

    const months = Math.round(tenureUnit === "years" ? tenureValue * 12 : tenureValue);
    if (months < 1 || months > 600) return null;

    const monthlyRate = rateValue / 12 / 100;
    return { ...amortise(principalValue, monthlyRate, months), months, monthlyRate };
  }, [principalValue, rateValue, tenureUnit, tenureValue]);

  const money = (value: number) => formatMoney(value, currency);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="emi-principal"
            label="Loan amount"
            value={principal}
            onChange={setPrincipal}
            min={1}
            placeholder="500000"
          />
          <NumberField
            id="emi-rate"
            label="Annual interest rate"
            value={rate}
            onChange={setRate}
            suffix="%"
            min={0}
            step="0.01"
          />
          <NumberField
            id="emi-tenure"
            label="Loan tenure"
            value={tenure}
            onChange={setTenure}
            min={1}
            step={1}
            action={
              <div className="w-40">
                <Segmented
                  name="emi-tenure-unit"
                  ariaLabel="Tenure unit"
                  value={tenureUnit}
                  onChange={setTenureUnit}
                  options={[
                    { value: "years", label: "Years" },
                    { value: "months", label: "Months" },
                  ]}
                />
              </div>
            }
          />
          <CurrencySelect value={currency} onChange={setCurrency} id="emi-currency" />
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Monthly instalment (EMI)"
              value={money(result.payment)}
              sublabel={`${result.months} payment${result.months === 1 ? "" : "s"} over ${(result.months / 12).toFixed(result.months % 12 === 0 ? 0 : 1)} year${result.months === 12 ? "" : "s"}`}
              breakdown={[
                { label: "Total interest", value: money(result.totalInterest) },
                { label: "Total amount payable", value: money(result.totalPaid) },
              ]}
            />

            <StatGrid className="sm:grid-cols-4">
              <Stat label="EMI" value={money(result.payment)} emphasis />
              <Stat label="Principal" value={money(principalValue ?? 0)} />
              <Stat label="Interest" value={money(result.totalInterest)} />
              <Stat
                label="Interest as % of loan"
                value={`${((result.totalInterest / (principalValue || 1)) * 100).toFixed(1)}%`}
              />
            </StatGrid>

            {/* Proportion bar: principal against interest over the whole term. */}
            <div>
              <div className="flex h-3 overflow-hidden rounded-full border border-border">
                <div
                  className="bg-fg"
                  style={{ width: `${((principalValue ?? 0) / result.totalPaid) * 100}%` }}
                  aria-hidden="true"
                />
                <div className="flex-1 bg-border-strong" aria-hidden="true" />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fg-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-fg" aria-hidden="true" />
                  Principal {(((principalValue ?? 0) / result.totalPaid) * 100).toFixed(1)}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-border-strong" aria-hidden="true" />
                  Interest {((result.totalInterest / result.totalPaid) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <details className="group rounded-lg border border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-fg">
                Repayment schedule ({result.rows.length} payments)
                <span
                  aria-hidden="true"
                  className="text-fg-subtle transition-transform duration-200 group-open:rotate-90"
                >
                  ›
                </span>
              </summary>
              <div className="px-3 pb-3">
                <ScheduleTable
                  caption="Month-by-month repayment schedule"
                  columns={["Month", "Payment", "Interest", "Principal", "Balance"]}
                  rows={result.rows.map((row) => [
                    row.period,
                    money(row.payment),
                    money(row.interest),
                    money(row.principal),
                    money(row.balance),
                  ])}
                />
              </div>
            </details>

            <Working
              lines={[
                `r = ${rateValue} ÷ 12 ÷ 100 = ${result.monthlyRate.toFixed(8)}`,
                `n = ${result.months} months`,
                `EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1)`,
                `    = ${formatNumber(principalValue ?? 0)} × ${result.monthlyRate.toFixed(8)} × ${((1 + result.monthlyRate) ** result.months).toFixed(6)} ÷ ${(((1 + result.monthlyRate) ** result.months) - 1).toFixed(6)}`,
                `    = ${money(result.payment)}`,
                `Total paid = ${money(result.payment)} × ${result.months} ≈ ${money(result.totalPaid)}`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a loan amount above zero, a rate, and a tenure of up to 50 years." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setPrincipal("");
              setRate("");
              setTenure("");
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
