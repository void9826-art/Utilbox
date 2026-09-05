"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { amortise, formatMoney, roundMoney } from "@/lib/money";

import {
  CurrencySelect,
  EmptyResult,
  NumberField,
  ResultCard,
  ScheduleTable,
  Working,
  parseNumber,
} from "./_shared";

export default function MortgageCalculator() {
  const [price, setPrice] = React.useState("350000");
  const [depositMode, setDepositMode] = React.useState<"percent" | "amount">("percent");
  const [depositPercent, setDepositPercent] = React.useState("20");
  const [depositAmount, setDepositAmount] = React.useState("70000");
  const [rate, setRate] = React.useState("6.5");
  const [term, setTerm] = React.useState("30");
  const [annualTax, setAnnualTax] = React.useState("4200");
  const [annualInsurance, setAnnualInsurance] = React.useState("1200");
  const [monthlyHoa, setMonthlyHoa] = React.useState("0");
  const [currency, setCurrency] = React.useState("USD");

  const priceValue = parseNumber(price);

  // Keep the two deposit representations in step with each other.
  const deposit = React.useMemo(() => {
    if (priceValue === null || priceValue <= 0) return null;
    if (depositMode === "percent") {
      const percent = parseNumber(depositPercent);
      if (percent === null || percent < 0 || percent >= 100) return null;
      return roundMoney((priceValue * percent) / 100);
    }
    const amount = parseNumber(depositAmount);
    if (amount === null || amount < 0 || amount >= priceValue) return null;
    return amount;
  }, [depositAmount, depositMode, depositPercent, priceValue]);

  const rateValue = parseNumber(rate);
  const termValue = parseNumber(term);

  const result = React.useMemo(() => {
    if (
      priceValue === null ||
      deposit === null ||
      rateValue === null ||
      termValue === null ||
      priceValue <= 0 ||
      rateValue < 0 ||
      termValue <= 0 ||
      termValue > 50
    ) {
      return null;
    }

    const loan = priceValue - deposit;
    if (loan <= 0) return null;

    const months = Math.round(termValue * 12);
    const schedule = amortise(loan, rateValue / 12 / 100, months);

    const tax = (parseNumber(annualTax) ?? 0) / 12;
    const insurance = (parseNumber(annualInsurance) ?? 0) / 12;
    const hoa = parseNumber(monthlyHoa) ?? 0;

    return {
      loan,
      schedule,
      months,
      monthlyTax: roundMoney(tax),
      monthlyInsurance: roundMoney(insurance),
      hoa: roundMoney(hoa),
      total: roundMoney(schedule.payment + tax + insurance + hoa),
      depositPercent: (deposit / priceValue) * 100,
    };
  }, [annualInsurance, annualTax, deposit, monthlyHoa, priceValue, rateValue, termValue]);

  const money = (value: number) => formatMoney(value, currency);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="mortgage-price" label="Home price" value={price} onChange={setPrice} min={1} />

          <div className="space-y-1.5">
            <Segmented
              name="mortgage-deposit-mode"
              ariaLabel="Deposit entry mode"
              value={depositMode}
              onChange={setDepositMode}
              options={[
                { value: "percent", label: "Deposit %" },
                { value: "amount", label: "Deposit amount" },
              ]}
            />
            {depositMode === "percent" ? (
              <NumberField
                id="mortgage-deposit-percent"
                label="Deposit"
                value={depositPercent}
                onChange={setDepositPercent}
                suffix="%"
                min={0}
                max={99}
                step="0.5"
                hint={deposit !== null ? `That is ${money(deposit)}.` : undefined}
              />
            ) : (
              <NumberField
                id="mortgage-deposit-amount"
                label="Deposit"
                value={depositAmount}
                onChange={setDepositAmount}
                min={0}
                hint={
                  result !== null ? `That is ${result.depositPercent.toFixed(1)}% of the price.` : undefined
                }
              />
            )}
          </div>

          <NumberField
            id="mortgage-rate"
            label="Interest rate"
            value={rate}
            onChange={setRate}
            suffix="%"
            min={0}
            step="0.01"
          />
          <NumberField
            id="mortgage-term"
            label="Loan term"
            value={term}
            onChange={setTerm}
            suffix="years"
            min={1}
            max={50}
            step={1}
          />
          <NumberField
            id="mortgage-tax"
            label="Property tax per year"
            value={annualTax}
            onChange={setAnnualTax}
            min={0}
          />
          <NumberField
            id="mortgage-insurance"
            label="Home insurance per year"
            value={annualInsurance}
            onChange={setAnnualInsurance}
            min={0}
          />
          <NumberField
            id="mortgage-hoa"
            label="Association fee per month"
            value={monthlyHoa}
            onChange={setMonthlyHoa}
            min={0}
            hint="HOA, service charge or ground rent"
          />
          <CurrencySelect value={currency} onChange={setCurrency} id="mortgage-currency" />
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Total monthly payment"
              value={money(result.total)}
              sublabel={`Principal and interest of ${money(result.schedule.payment)}, plus ${money(result.total - result.schedule.payment)} of taxes, insurance and fees`}
              breakdown={[
                { label: "Loan amount", value: money(result.loan) },
                { label: "Total interest over the term", value: money(result.schedule.totalInterest) },
              ]}
            />

            <StatGrid className="sm:grid-cols-4">
              <Stat label="Principal & interest" value={money(result.schedule.payment)} emphasis />
              <Stat label="Property tax" value={money(result.monthlyTax)} hint="per month" />
              <Stat label="Insurance" value={money(result.monthlyInsurance)} hint="per month" />
              <Stat label="Association fee" value={money(result.hoa)} hint="per month" />
            </StatGrid>

            {result.depositPercent < 20 ? (
              <Alert tone="info" title="Deposit is under 20%">
                Many lenders require mortgage insurance below a 20% deposit, which is not included in the
                figures above. Add its monthly cost to the insurance field to see the full picture.
              </Alert>
            ) : null}

            <details className="group rounded-lg border border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-fg">
                Amortisation schedule ({result.schedule.rows.length} payments)
                <span
                  aria-hidden="true"
                  className="text-fg-subtle transition-transform duration-200 group-open:rotate-90"
                >
                  ›
                </span>
              </summary>
              <div className="px-3 pb-3">
                <p className="px-1 pb-2 text-xs text-fg-muted">
                  Principal and interest only — taxes and insurance do not reduce the loan balance.
                </p>
                <ScheduleTable
                  caption="Mortgage amortisation schedule"
                  columns={["Month", "Payment", "Interest", "Principal", "Balance"]}
                  rows={result.schedule.rows.map((row) => [
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
                `Loan = ${money(priceValue ?? 0)} − ${money(deposit ?? 0)} = ${money(result.loan)}`,
                `r = ${rateValue} ÷ 12 ÷ 100 = ${((rateValue ?? 0) / 1200).toFixed(8)}`,
                `n = ${termValue} × 12 = ${result.months}`,
                `Principal & interest = ${money(result.schedule.payment)}`,
                `Tax ${money(result.monthlyTax)} + insurance ${money(result.monthlyInsurance)} + fees ${money(result.hoa)}`,
                `Total monthly = ${money(result.total)}`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a home price, a deposit smaller than the price, a rate and a term." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setPrice("");
              setDepositPercent("20");
              setDepositAmount("");
              setRate("");
              setTerm("30");
              setAnnualTax("0");
              setAnnualInsurance("0");
              setMonthlyHoa("0");
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
