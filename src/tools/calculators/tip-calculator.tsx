"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatMoney, roundMoney } from "@/lib/money";

import { CurrencySelect, EmptyResult, NumberField, ResultCard, Working, parseNumber } from "./_shared";

const TIP_PRESETS = [10, 12.5, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = React.useState("84.50");
  const [tipRate, setTipRate] = React.useState("15");
  const [people, setPeople] = React.useState("3");
  const [roundUp, setRoundUp] = React.useState(false);
  const [currency, setCurrency] = React.useState("USD");

  const money = (value: number) => formatMoney(value, currency);

  const result = React.useMemo(() => {
    const amount = parseNumber(bill);
    const rate = parseNumber(tipRate);
    const count = parseNumber(people);
    if (amount === null || rate === null || count === null) return null;
    if (amount < 0 || rate < 0 || rate > 100 || count < 1 || !Number.isInteger(count) || count > 100) return null;

    const tip = roundMoney(amount * (rate / 100));
    const total = roundMoney(amount + tip);
    const exactShare = total / count;
    // Rounding each share up to a whole unit is the usual way to avoid coins;
    // the extra is shown so nobody is surprised by it.
    const share = roundUp ? Math.ceil(exactShare) : roundMoney(exactShare);
    const collected = roundMoney(share * count);
    const extra = roundMoney(collected - total);

    const working = [
      `tip = bill × rate = ${money(amount)} × ${rate}/100 = ${money(tip)}`,
      `total = bill + tip = ${money(amount)} + ${money(tip)} = ${money(total)}`,
      `each = total ÷ people = ${money(total)} ÷ ${count} = ${money(roundMoney(exactShare))}`,
    ];
    if (roundUp) {
      working.push(`rounded up to ${money(share)} each, which collects ${money(collected)} — ${money(extra)} over`);
    } else if (collected !== total) {
      // Splitting cents rarely divides evenly; say where the odd cent goes.
      working.push(`${count} × ${money(share)} = ${money(collected)}, so one person pays ${money(Math.abs(extra))} ${extra > 0 ? "less" : "more"}`);
    }

    return { amount, rate, count, tip, total, share, collected, extra, tipEach: roundMoney(tip / count), working };
    // The money formatter only varies with the currency, already a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill, currency, people, roundUp, tipRate]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField id="tip-bill" label="Bill amount" value={bill} onChange={setBill} min={0} />
          <NumberField
            id="tip-rate"
            label="Tip"
            value={tipRate}
            onChange={setTipRate}
            suffix="%"
            min={0}
            max={100}
          />
          <NumberField
            id="tip-people"
            label="Number of people"
            value={people}
            onChange={setPeople}
            min={1}
            max={100}
            step={1}
            inputMode="numeric"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Common tip percentages">
          {TIP_PRESETS.map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => setTipRate(String(rate))}
              aria-pressed={tipRate === String(rate)}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-accent-soft-border hover:text-fg aria-pressed:border-accent-soft-border aria-pressed:bg-accent-soft aria-pressed:text-accent-text"
            >
              {rate}%
            </button>
          ))}
        </div>

        <Checkbox
          label="Round each share up to a whole amount"
          description="Easier for cash; the extra goes to the tip."
          checked={roundUp}
          onChange={(event) => setRoundUp(event.target.checked)}
        />

        <CurrencySelect value={currency} onChange={setCurrency} id="tip-currency" />

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label={result.count === 1 ? "Total to pay" : "Each person pays"}
              value={money(result.share)}
              sublabel={`Tip ${money(result.tip)} on a ${money(result.amount)} bill, ${money(result.total)} in total.`}
              breakdown={[
                { label: "Tip", value: money(result.tip) },
                { label: "Total with tip", value: money(result.total) },
              ]}
            />

            <StatGrid className="sm:grid-cols-4">
              <Stat label="Bill" value={money(result.amount)} />
              <Stat label="Tip" value={money(result.tip)} />
              <Stat label="Total" value={money(result.total)} />
              <Stat label="Each" value={money(result.share)} emphasis />
            </StatGrid>

            {result.extra > 0 && roundUp ? (
              <p className="rounded-lg border border-accent-soft-border bg-accent-soft px-3.5 py-2.5 text-sm text-fg">
                Rounding up collects {money(result.collected)}, which is {money(result.extra)} more than the bill and tip.
                Leave it as extra tip, or have one person pay less.
              </p>
            ) : null}

            <Working lines={result.working} />
          </div>
        ) : (
          <EmptyResult message="Enter a bill amount, a tip between 0% and 100%, and 1 to 100 people." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setBill("");
              setTipRate("15");
              setPeople("1");
              setRoundUp(false);
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
