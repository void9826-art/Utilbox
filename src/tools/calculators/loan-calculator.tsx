"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { amortise, formatMoney } from "@/lib/money";

import {
  CurrencySelect,
  EmptyResult,
  NumberField,
  ResultCard,
  ScheduleTable,
  SelectField,
  Working,
  parseNumber,
} from "./_shared";

const FREQUENCIES = [
  { id: "monthly", label: "Monthly", perYear: 12, noun: "month" },
  { id: "fortnightly", label: "Fortnightly", perYear: 26, noun: "fortnight" },
  { id: "weekly", label: "Weekly", perYear: 52, noun: "week" },
  { id: "quarterly", label: "Quarterly", perYear: 4, noun: "quarter" },
  { id: "annually", label: "Annually", perYear: 1, noun: "year" },
] as const;

export default function LoanCalculator() {
  const [amount, setAmount] = React.useState("25000");
  const [rate, setRate] = React.useState("7.5");
  const [years, setYears] = React.useState("5");
  const [frequency, setFrequency] = React.useState<string>("monthly");
  const [currency, setCurrency] = React.useState("USD");

  const config = FREQUENCIES.find((item) => item.id === frequency) ?? FREQUENCIES[0];
  const amountValue = parseNumber(amount);
  const rateValue = parseNumber(rate);
  const yearsValue = parseNumber(years);

  const result = React.useMemo(() => {
    if (
      amountValue === null ||
      rateValue === null ||
      yearsValue === null ||
      amountValue <= 0 ||
      rateValue < 0 ||
      yearsValue <= 0 ||
      yearsValue > 50
    ) {
      return null;
    }

    const periods = Math.round(yearsValue * config.perYear);
    if (periods < 1) return null;

    const periodRate = rateValue / 100 / config.perYear;
    return { ...amortise(amountValue, periodRate, periods), periods, periodRate };
  }, [amountValue, config.perYear, rateValue, yearsValue]);

  // The same loan paid monthly, so the frequency saving can be shown honestly.
  const monthlyBaseline = React.useMemo(() => {
    if (amountValue === null || rateValue === null || yearsValue === null) return null;
    if (amountValue <= 0 || yearsValue <= 0) return null;
    return amortise(amountValue, rateValue / 100 / 12, Math.round(yearsValue * 12));
  }, [amountValue, rateValue, yearsValue]);

  const money = (value: number) => formatMoney(value, currency);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="loan-amount" label="Loan amount" value={amount} onChange={setAmount} min={1} />
          <NumberField
            id="loan-rate"
            label="Annual interest rate"
            value={rate}
            onChange={setRate}
            suffix="%"
            min={0}
            step="0.01"
          />
          <NumberField
            id="loan-years"
            label="Loan term"
            value={years}
            onChange={setYears}
            suffix="years"
            min={0.5}
            max={50}
            step="0.5"
          />
          <SelectField label="Payment frequency" id="loan-frequency" value={frequency} onChange={setFrequency}>
            {FREQUENCIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <CurrencySelect value={currency} onChange={setCurrency} id="loan-currency" />
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label={`Payment every ${config.noun}`}
              value={money(result.payment)}
              sublabel={`${result.periods} payments in total`}
              breakdown={[
                { label: "Total interest", value: money(result.totalInterest) },
                { label: "Total repaid", value: money(result.totalPaid) },
              ]}
            />

            <StatGrid className="sm:grid-cols-4">
              <Stat label={`Per ${config.noun}`} value={money(result.payment)} emphasis />
              <Stat label="Payments" value={String(result.periods)} />
              <Stat label="Interest" value={money(result.totalInterest)} />
              <Stat
                label="Cost of borrowing"
                value={`${((result.totalInterest / (amountValue || 1)) * 100).toFixed(1)}%`}
                hint="Interest as a share of the amount borrowed"
              />
            </StatGrid>

            {monthlyBaseline && config.id !== "monthly" ? (
              <div className="rounded-lg border border-border bg-surface-sunken p-4 text-sm">
                <p className="font-medium text-fg">Compared with paying monthly</p>
                <p className="mt-1 text-fg-muted">
                  Monthly payments on the same loan would total {money(monthlyBaseline.totalPaid)} in interest
                  and principal. Paying {config.label.toLowerCase()}{" "}
                  {result.totalPaid < monthlyBaseline.totalPaid ? "saves" : "costs an extra"}{" "}
                  <strong className="font-semibold text-fg">
                    {money(Math.abs(monthlyBaseline.totalPaid - result.totalPaid))}
                  </strong>{" "}
                  over the life of the loan.
                </p>
              </div>
            ) : null}

            <details className="group rounded-lg border border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-fg">
                Amortisation schedule ({result.rows.length} payments)
                <span
                  aria-hidden="true"
                  className="text-fg-subtle transition-transform duration-200 group-open:rotate-90"
                >
                  ›
                </span>
              </summary>
              <div className="px-3 pb-3">
                <ScheduleTable
                  caption="Amortisation schedule"
                  columns={["#", "Payment", "Interest", "Principal", "Balance"]}
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
                `Periods per year = ${config.perYear}`,
                `r = ${rateValue} ÷ 100 ÷ ${config.perYear} = ${result.periodRate.toFixed(8)}`,
                `n = ${yearsValue} × ${config.perYear} = ${result.periods}`,
                `payment = P × r ÷ (1 − (1+r)^−n) = ${money(result.payment)}`,
                `Total repaid = ${money(result.totalPaid)}, of which ${money(result.totalInterest)} is interest`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a loan amount, an interest rate, and a term between half a year and 50 years." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setAmount("");
              setRate("");
              setYears("");
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
