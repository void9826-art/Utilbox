"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { formatMoney } from "@/lib/money";
import { goalSchedule, monthlyDepositNeeded, monthsToGoal } from "@/lib/savings-goal";

import { CurrencySelect, EmptyResult, NumberField, ResultCard, ScheduleTable, parseNumber } from "./_shared";

type Mode = "deposit" | "time";

function describeMonths(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (rest || !years) parts.push(`${rest} month${rest === 1 ? "" : "s"}`);
  return parts.join(" ");
}

export default function SavingsGoalCalculator() {
  const [mode, setMode] = React.useState<Mode>("deposit");
  const [target, setTarget] = React.useState("10000");
  const [current, setCurrent] = React.useState("1000");
  const [rate, setRate] = React.useState("4");
  const [years, setYears] = React.useState("2");
  const [monthly, setMonthly] = React.useState("300");
  const [currency, setCurrency] = React.useState("USD");
  const money = (value: number) => formatMoney(value, currency);

  const goal = parseNumber(target) ?? NaN;
  const start = parseNumber(current) ?? 0;
  const annual = parseNumber(rate) ?? 0;

  const depositResult = React.useMemo(() => {
    if (mode !== "deposit") return null;
    const months = Math.round((parseNumber(years) ?? NaN) * 12);
    const needed = monthlyDepositNeeded(goal, start, annual, months);
    if (needed === null) return null;
    return { needed, months, rows: goalSchedule(start, needed, annual, months) };
  }, [annual, goal, mode, start, years]);

  const timeResult = React.useMemo(() => {
    if (mode !== "time") return null;
    const deposit = parseNumber(monthly) ?? NaN;
    const months = monthsToGoal(goal, start, deposit, annual);
    if (months === null) return { months: null, rows: [] };
    return { months, rows: months > 0 ? goalSchedule(start, deposit, annual, months) : [] };
  }, [annual, goal, mode, monthly, start]);

  const rows = (depositResult?.rows ?? timeResult?.rows ?? []).map((row) => [
    describeMonths(row.month),
    money(row.deposited),
    money(row.interest),
    money(row.balance),
  ]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="goal-mode"
          ariaLabel="Question"
          value={mode}
          onChange={setMode}
          options={[
            { value: "deposit", label: "How much each month?" },
            { value: "time", label: "How long will it take?" },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="goal-target" label="Savings goal" value={target} onChange={setTarget} min={0} />
          <NumberField id="goal-current" label="Already saved" value={current} onChange={setCurrent} min={0} />
          <NumberField id="goal-rate" label="Interest rate" value={rate} onChange={setRate} suffix="% a year" min={0} step={0.1} hint="0 for cash with no interest." />
          {mode === "deposit" ? (
            <NumberField id="goal-years" label="Time to reach it" value={years} onChange={setYears} suffix="years" min={0} step={0.5} />
          ) : (
            <NumberField id="goal-monthly" label="Monthly saving" value={monthly} onChange={setMonthly} min={0} />
          )}
          <CurrencySelect value={currency} onChange={setCurrency} id="goal-currency" />
        </div>

        {mode === "deposit" && depositResult ? (
          <ResultCard
            label="Save each month"
            value={money(depositResult.needed)}
            sublabel={
              depositResult.needed === 0
                ? "What you already have reaches the goal with interest alone."
                : `For ${describeMonths(depositResult.months)}, to reach ${money(goal)}.`
            }
            breakdown={[
              { label: "You put in", value: money(start + depositResult.needed * depositResult.months) },
              { label: "Interest earned", value: money(goal - start - depositResult.needed * depositResult.months) },
            ]}
          />
        ) : null}

        {mode === "time" && timeResult ? (
          timeResult.months === null ? (
            <EmptyResult message="At this rate the goal is not reached within 100 years. Increase the monthly saving." />
          ) : (
            <ResultCard
              label="Time to reach your goal"
              value={describeMonths(timeResult.months)}
              sublabel={`Saving ${money(parseNumber(monthly) ?? 0)} a month towards ${money(goal)}.`}
            />
          )
        ) : null}

        {(mode === "deposit" && !depositResult) ? (
          <EmptyResult message="Enter a goal, what you have saved and a time of at least one month." />
        ) : null}

        {rows.length > 0 ? (
          <ScheduleTable caption="Balance over time" columns={["After", "Paid in", "Interest", "Balance"]} rows={rows} maxHeight="20rem" />
        ) : null}

        <p className="text-xs text-fg-subtle">
          Interest is compounded monthly at the annual rate ÷ 12, with deposits at the end of each month. Tax on interest and
          changes in the rate are not included.
        </p>
      </div>
    </ToolFrame>
  );
}
