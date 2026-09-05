"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatMoney } from "@/lib/money";

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

/** A year is 52.1775 weeks on average, not 52 — the difference shows up monthly. */
const WEEKS_PER_YEAR = 52.1775;

const PERIODS = [
  { id: "hourly", label: "Per hour" },
  { id: "daily", label: "Per day" },
  { id: "weekly", label: "Per week" },
  { id: "fortnightly", label: "Per fortnight" },
  { id: "monthly", label: "Per month" },
  { id: "annually", label: "Per year" },
] as const;

type PeriodId = (typeof PERIODS)[number]["id"];

export default function SalaryCalculator() {
  const [amount, setAmount] = React.useState("25");
  const [period, setPeriod] = React.useState<PeriodId>("hourly");
  const [hoursPerWeek, setHoursPerWeek] = React.useState("37.5");
  const [daysPerWeek, setDaysPerWeek] = React.useState("5");
  const [unpaidWeeks, setUnpaidWeeks] = React.useState("0");
  const [currency, setCurrency] = React.useState("USD");

  const amountValue = parseNumber(amount);
  const hours = parseNumber(hoursPerWeek);
  const days = parseNumber(daysPerWeek);
  const unpaid = parseNumber(unpaidWeeks) ?? 0;

  const money = (value: number) => formatMoney(value, currency);

  const result = React.useMemo(() => {
    if (
      amountValue === null ||
      hours === null ||
      days === null ||
      amountValue < 0 ||
      hours <= 0 ||
      hours > 168 ||
      days <= 0 ||
      days > 7 ||
      unpaid < 0 ||
      unpaid >= WEEKS_PER_YEAR
    ) {
      return null;
    }

    const paidWeeks = WEEKS_PER_YEAR - unpaid;

    // Everything is normalised to an annual figure, then divided back out.
    let annual: number;
    switch (period) {
      case "hourly":
        annual = amountValue * hours * paidWeeks;
        break;
      case "daily":
        annual = amountValue * days * paidWeeks;
        break;
      case "weekly":
        annual = amountValue * paidWeeks;
        break;
      case "fortnightly":
        annual = (amountValue / 2) * paidWeeks;
        break;
      case "monthly":
        annual = amountValue * 12;
        break;
      case "annually":
        annual = amountValue;
        break;
    }

    const weekly = annual / paidWeeks;
    const hourly = weekly / hours;

    return {
      annual,
      monthly: annual / 12,
      fortnightly: weekly * 2,
      weekly,
      daily: weekly / days,
      hourly,
      paidWeeks,
      annualHours: hours * paidWeeks,
    };
  }, [amountValue, days, hours, period, unpaid]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="salary-amount"
            label="Pay amount"
            value={amount}
            onChange={setAmount}
            min={0}
            step="0.01"
          />
          <SelectField
            label="This amount is"
            id="salary-period"
            value={period}
            onChange={(value) => setPeriod(value as PeriodId)}
          >
            {PERIODS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <NumberField
            id="salary-hours"
            label="Hours worked per week"
            value={hoursPerWeek}
            onChange={setHoursPerWeek}
            suffix="h"
            min={0.5}
            max={168}
            step="0.5"
          />
          <NumberField
            id="salary-days"
            label="Days worked per week"
            value={daysPerWeek}
            onChange={setDaysPerWeek}
            min={1}
            max={7}
            step="0.5"
          />
          <NumberField
            id="salary-unpaid"
            label="Unpaid weeks off per year"
            value={unpaidWeeks}
            onChange={setUnpaidWeeks}
            min={0}
            max={51}
            step="0.5"
            hint="Leave at 0 for a salaried role with paid holiday."
          />
          <CurrencySelect value={currency} onChange={setCurrency} id="salary-currency" />
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Annual gross pay"
              value={money(result.annual)}
              sublabel={`Equivalent to ${money(result.hourly)} an hour across ${result.annualHours.toFixed(0)} paid hours a year.`}
              breakdown={[
                { label: "Per month", value: money(result.monthly) },
                { label: "Per week", value: money(result.weekly) },
              ]}
            />

            <StatGrid className="sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="Hourly" value={money(result.hourly)} />
              <Stat label="Daily" value={money(result.daily)} />
              <Stat label="Weekly" value={money(result.weekly)} />
              <Stat label="Fortnightly" value={money(result.fortnightly)} />
              <Stat label="Monthly" value={money(result.monthly)} />
              <Stat label="Annual" value={money(result.annual)} emphasis />
            </StatGrid>

            <ScheduleTable
              caption="Pay by period"
              columns={["Period", "Gross pay", "Periods per year"]}
              rows={[
                ["Hour", money(result.hourly), result.annualHours.toFixed(0)],
                ["Day", money(result.daily), (result.paidWeeks * (days ?? 5)).toFixed(0)],
                ["Week", money(result.weekly), result.paidWeeks.toFixed(1)],
                ["Fortnight", money(result.fortnightly), (result.paidWeeks / 2).toFixed(1)],
                ["Month", money(result.monthly), "12"],
                ["Year", money(result.annual), "1"],
              ]}
              maxHeight="auto"
            />

            <Working
              lines={[
                `Paid weeks = ${WEEKS_PER_YEAR} − ${unpaid} = ${result.paidWeeks.toFixed(4)}`,
                `Annual  = ${money(result.annual)}`,
                `Monthly = annual ÷ 12 = ${money(result.monthly)}`,
                `Weekly  = annual ÷ ${result.paidWeeks.toFixed(4)} = ${money(result.weekly)}`,
                `Hourly  = weekly ÷ ${hours} = ${money(result.hourly)}`,
                `Note: weekly × 4 would give ${money(result.weekly * 4)}, about ${(((result.monthly - result.weekly * 4) / result.monthly) * 100).toFixed(1)}% short of the real monthly figure.`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a pay amount, weekly hours between 0.5 and 168, and 1–7 working days." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setAmount("");
              setHoursPerWeek("40");
              setDaysPerWeek("5");
              setUnpaidWeeks("0");
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
