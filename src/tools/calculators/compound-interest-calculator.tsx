"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { compoundGrowth, formatMoney } from "@/lib/money";

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

const COMPOUNDING = [
  { id: "1", label: "Annually", perYear: 1 },
  { id: "2", label: "Half-yearly", perYear: 2 },
  { id: "4", label: "Quarterly", perYear: 4 },
  { id: "12", label: "Monthly", perYear: 12 },
  { id: "365", label: "Daily", perYear: 365 },
];

const CONTRIBUTION_FREQUENCY = [
  { id: "0", label: "No regular contributions", perYear: 0 },
  { id: "12", label: "Monthly", perYear: 12 },
  { id: "4", label: "Quarterly", perYear: 4 },
  { id: "1", label: "Annually", perYear: 1 },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = React.useState("5000");
  const [rate, setRate] = React.useState("7");
  const [years, setYears] = React.useState("10");
  const [compounds, setCompounds] = React.useState("12");
  const [contribution, setContribution] = React.useState("200");
  const [contributionFrequency, setContributionFrequency] = React.useState("12");
  const [timing, setTiming] = React.useState<"start" | "end">("end");
  const [currency, setCurrency] = React.useState("USD");

  const principalValue = parseNumber(principal);
  const rateValue = parseNumber(rate);
  const yearsValue = parseNumber(years);
  const contributionValue = parseNumber(contribution);
  const compoundsPerYear = Number(compounds);
  const contributionsPerYear = Number(contributionFrequency);

  const result = React.useMemo(() => {
    if (
      principalValue === null ||
      rateValue === null ||
      yearsValue === null ||
      principalValue < 0 ||
      yearsValue <= 0 ||
      yearsValue > 100
    ) {
      return null;
    }

    const growth = compoundGrowth({
      principal: principalValue,
      annualRate: rateValue / 100,
      years: yearsValue,
      compoundsPerYear,
      contribution: contributionsPerYear > 0 ? (contributionValue ?? 0) : 0,
      contributionsPerYear,
      contributeAtStart: timing === "start",
    });

    // Effective annual rate, which is what compounding frequency actually buys.
    const effectiveRate = ((1 + rateValue / 100 / compoundsPerYear) ** compoundsPerYear - 1) * 100;

    return { ...growth, effectiveRate };
  }, [
    compoundsPerYear,
    contributionValue,
    contributionsPerYear,
    principalValue,
    rateValue,
    timing,
    yearsValue,
  ]);

  const money = (value: number) => formatMoney(value, currency);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="ci-principal"
            label="Starting balance"
            value={principal}
            onChange={setPrincipal}
            min={0}
          />
          <NumberField
            id="ci-rate"
            label="Annual interest rate"
            value={rate}
            onChange={setRate}
            suffix="%"
            step="0.01"
          />
          <NumberField
            id="ci-years"
            label="Time invested"
            value={years}
            onChange={setYears}
            suffix="years"
            min={0.5}
            max={100}
            step="0.5"
          />
          <SelectField label="Compounding frequency" id="ci-compounds" value={compounds} onChange={setCompounds}>
            {COMPOUNDING.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Regular contributions"
            id="ci-contribution-frequency"
            value={contributionFrequency}
            onChange={setContributionFrequency}
          >
            {CONTRIBUTION_FREQUENCY.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectField>
          {contributionsPerYear > 0 ? (
            <NumberField
              id="ci-contribution"
              label="Contribution amount"
              value={contribution}
              onChange={setContribution}
              min={0}
            />
          ) : null}
          {contributionsPerYear > 0 ? (
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Contribution timing</span>
              <Segmented
                name="ci-timing"
                ariaLabel="Contribution timing"
                value={timing}
                onChange={setTiming}
                options={[
                  { value: "start", label: "Start of period" },
                  { value: "end", label: "End of period" },
                ]}
              />
            </div>
          ) : null}
          <CurrencySelect value={currency} onChange={setCurrency} id="ci-currency" />
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label={`Balance after ${yearsValue} year${yearsValue === 1 ? "" : "s"}`}
              value={money(result.finalBalance)}
              sublabel={`${money(result.totalInterest)} of that is interest earned`}
              breakdown={[
                { label: "You put in", value: money((principalValue ?? 0) + result.totalContributed) },
                { label: "Interest earned", value: money(result.totalInterest) },
              ]}
            />

            <StatGrid className="sm:grid-cols-4">
              <Stat label="Final balance" value={money(result.finalBalance)} emphasis />
              <Stat label="Starting balance" value={money(principalValue ?? 0)} />
              <Stat label="Contributions" value={money(result.totalContributed)} />
              <Stat
                label="Effective annual rate"
                value={`${result.effectiveRate.toFixed(3)}%`}
                hint={`Nominal ${rateValue}% compounded ${COMPOUNDING.find((c) => c.id === compounds)?.label.toLowerCase()}`}
              />
            </StatGrid>

            <details className="group rounded-lg border border-border" open>
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-fg">
                Year-by-year growth
                <span
                  aria-hidden="true"
                  className="text-fg-subtle transition-transform duration-200 group-open:rotate-90"
                >
                  ›
                </span>
              </summary>
              <div className="px-3 pb-3">
                <ScheduleTable
                  caption="Year-by-year balance"
                  columns={["Year", "Contributions", "Interest", "Balance"]}
                  rows={result.rows.map((row) => [
                    row.period,
                    money(row.contributions),
                    money(row.interest),
                    money(row.balance),
                  ])}
                  maxHeight="20rem"
                />
              </div>
            </details>

            <Working
              lines={[
                `Nominal rate = ${rateValue}% compounded ${compoundsPerYear}× a year`,
                `Effective annual rate = (1 + ${rateValue}/100/${compoundsPerYear})^${compoundsPerYear} − 1 = ${result.effectiveRate.toFixed(4)}%`,
                `Contributed  = ${money(result.totalContributed)} over ${yearsValue} years`,
                `Interest     = ${money(result.totalInterest)}`,
                `Final balance = ${money(principalValue ?? 0)} + ${money(result.totalContributed)} + ${money(result.totalInterest)} = ${money(result.finalBalance)}`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a starting balance, an interest rate and a period of up to 100 years." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setPrincipal("");
              setRate("");
              setYears("10");
              setContribution("0");
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
