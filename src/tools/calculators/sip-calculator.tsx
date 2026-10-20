"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatMoney } from "@/lib/money";
import { sipProjection } from "@/lib/sip";

import { CurrencySelect, EmptyResult, NumberField, ResultCard, ScheduleTable, Working, parseNumber, percent } from "./_shared";

export default function SipCalculator() {
  const [monthly, setMonthly] = React.useState("5000");
  const [rate, setRate] = React.useState("12");
  const [years, setYears] = React.useState("10");
  const [stepUp, setStepUp] = React.useState("0");
  const [currency, setCurrency] = React.useState("INR");

  const money = (value: number) => formatMoney(value, currency);
  const result = sipProjection({
    monthly: parseNumber(monthly) ?? NaN,
    annualReturn: parseNumber(rate) ?? NaN,
    years: parseNumber(years) ?? NaN,
    stepUp: parseNumber(stepUp) ?? 0,
  });

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="sip-monthly" label="Monthly investment" value={monthly} onChange={setMonthly} min={0} />
          <NumberField id="sip-rate" label="Expected annual return" value={rate} onChange={setRate} suffix="%" step={0.5} />
          <NumberField id="sip-years" label="Investment period" value={years} onChange={setYears} suffix="years" min={1} max={60} step={1} />
          <NumberField
            id="sip-stepup"
            label="Increase each year (step-up)"
            value={stepUp}
            onChange={setStepUp}
            suffix="%"
            min={0}
            hint="0 for a fixed amount."
          />
          <CurrencySelect value={currency} onChange={setCurrency} id="sip-currency" />
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Estimated value at the end"
              value={money(result.value)}
              sublabel={`After ${parseNumber(years)} years at ${percent(parseNumber(rate) ?? 0)} a year, compounded monthly.`}
              breakdown={[
                { label: "Total invested", value: money(result.invested) },
                { label: "Estimated gains", value: money(result.gains) },
              ]}
            />
            <StatGrid className="sm:grid-cols-3">
              <Stat label="Invested" value={money(result.invested)} />
              <Stat label="Gains" value={money(result.gains)} />
              <Stat label="Gains share" value={percent((result.gains / result.value) * 100, 1)} emphasis />
            </StatGrid>
            <ScheduleTable
              caption="Year-by-year value"
              columns={["Year", "Invested so far", "Value"]}
              rows={result.rows.map((row) => [String(row.year), money(row.invested), money(row.value)])}
              maxHeight="20rem"
            />
            <Working
              lines={[
                `monthly rate i = ${parseNumber(rate)}% ÷ 12 = ${((parseNumber(rate) ?? 0) / 12).toFixed(4)}%`,
                "each instalment is invested at the start of its month and grows by (1 + i) every month",
                (parseNumber(stepUp) ?? 0) > 0
                  ? `the monthly amount rises by ${parseNumber(stepUp)}% at the start of each new year`
                  : `FV = P × ((1 + i)ⁿ − 1) ÷ i × (1 + i) with n = ${Math.round((parseNumber(years) ?? 0) * 12)} months`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a monthly amount, a return above −100% and a period of 1 to 60 years." />
        )}
      </div>
    </ToolFrame>
  );
}
