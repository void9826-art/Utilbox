"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Badge } from "@/components/ui/surfaces";
import { summariseLoan, type LoanSummary } from "@/lib/loan-compare";
import { formatMoney } from "@/lib/money";

import { CurrencySelect, NumberField, Working, parseNumber, percent } from "./_shared";

interface Offer {
  label: string;
  amount: string;
  rate: string;
  years: string;
  fees: string;
}

const START: Offer[] = [
  { label: "Loan A", amount: "10000", rate: "6", years: "3", fees: "0" },
  { label: "Loan B", amount: "10000", rate: "5", years: "3", fees: "500" },
  { label: "Loan C", amount: "10000", rate: "6.5", years: "5", fees: "0" },
];

export default function LoanComparisonCalculator() {
  const [offers, setOffers] = React.useState<Offer[]>(START);
  const [currency, setCurrency] = React.useState("USD");
  const money = (value: number) => formatMoney(value, currency);

  const update = (index: number, patch: Partial<Offer>) =>
    setOffers((current) => current.map((offer, i) => (i === index ? { ...offer, ...patch } : offer)));

  const summaries: Array<LoanSummary | null> = offers.map((offer) =>
    summariseLoan({
      amount: parseNumber(offer.amount) ?? NaN,
      annualRate: parseNumber(offer.rate) ?? NaN,
      months: (parseNumber(offer.years) ?? NaN) * 12,
      fees: parseNumber(offer.fees) ?? 0,
    }),
  );
  const valid = summaries.filter((summary): summary is LoanSummary => summary !== null);
  const cheapestCost = valid.length ? Math.min(...valid.map((summary) => summary.totalCost)) : null;
  const lowestPayment = valid.length ? Math.min(...valid.map((summary) => summary.payment)) : null;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-3">
          {offers.map((offer, index) => {
            const summary = summaries[index];
            const cheapest = summary && cheapestCost !== null && Math.abs(summary.totalCost - cheapestCost) < 0.005;
            return (
              <section
                key={index}
                aria-labelledby={`loan-${index}-title`}
                className="space-y-3 rounded-lg border border-border p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 id={`loan-${index}-title`} className="text-sm font-semibold text-fg">
                    {offer.label}
                  </h2>
                  {cheapest && valid.length > 1 ? <Badge tone="accent">Lowest total cost</Badge> : null}
                </div>
                <NumberField id={`loan-${index}-amount`} label="Amount borrowed" value={offer.amount} onChange={(value) => update(index, { amount: value })} min={0} />
                <NumberField id={`loan-${index}-rate`} label="Interest rate" value={offer.rate} onChange={(value) => update(index, { rate: value })} suffix="% a year" min={0} />
                <NumberField id={`loan-${index}-years`} label="Term" value={offer.years} onChange={(value) => update(index, { years: value })} suffix="years" min={0} />
                <NumberField id={`loan-${index}-fees`} label="Up-front fees" value={offer.fees} onChange={(value) => update(index, { fees: value })} min={0} hint="Arrangement or processing fees." />

                <dl className="space-y-1.5 border-t border-border pt-3 text-sm" aria-live="polite">
                  {summary ? (
                    <>
                      <div className="flex justify-between gap-2">
                        <dt className="text-fg-muted">Monthly payment</dt>
                        <dd className="tabular font-semibold text-fg">
                          {money(summary.payment)}
                          {lowestPayment !== null && Math.abs(summary.payment - lowestPayment) < 0.005 && valid.length > 1 ? (
                            <span className="ml-1 text-xs font-normal text-fg-subtle">lowest</span>
                          ) : null}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-fg-muted">Total interest</dt>
                        <dd className="tabular text-fg">{money(summary.totalInterest)}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-fg-muted">Interest + fees</dt>
                        <dd className="tabular font-semibold text-fg">{money(summary.totalCost)}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-fg-muted">Rate including fees</dt>
                        <dd className="tabular text-fg">{percent(summary.aprWithFees, 2)}</dd>
                      </div>
                    </>
                  ) : (
                    <p className="text-fg-subtle">Enter an amount, a rate and a term; fees must be less than the amount.</p>
                  )}
                </dl>
              </section>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CurrencySelect value={currency} onChange={setCurrency} id="loan-compare-currency" />
        </div>

        {valid.length > 1 && cheapestCost !== null ? (
          <p className="rounded-lg border border-accent-soft-border bg-accent-soft px-3.5 py-2.5 text-sm text-fg" aria-live="polite">
            {(() => {
              const order = summaries
                .map((summary, index) => ({ summary, index }))
                .filter((entry): entry is { summary: LoanSummary; index: number } => entry.summary !== null)
                .sort((a, b) => a.summary.totalCost - b.summary.totalCost);
              const best = order[0];
              const next = order[1];
              return `${offers[best.index].label} costs least overall: ${money(best.summary.totalCost)} in interest and fees, ${money(next.summary.totalCost - best.summary.totalCost)} less than ${offers[next.index].label}.`;
            })()}
          </p>
        ) : null}

        <Working
          lines={[
            "payment = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), with r = annual rate ÷ 12 and n = months",
            "interest + fees = payment × n − amount + fees",
            "rate including fees: the annual rate at which the payments equal the amount received after fees",
          ]}
        />
      </div>
    </ToolFrame>
  );
}
