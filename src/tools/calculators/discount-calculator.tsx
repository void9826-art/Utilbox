"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Input, Segmented } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatMoney, roundMoney } from "@/lib/money";

import {
  CurrencySelect,
  EmptyResult,
  NumberField,
  ResultCard,
  Working,
  parseNumber,
} from "./_shared";

type Mode = "single" | "stacked" | "reverse";

export default function DiscountCalculator() {
  const [mode, setMode] = React.useState<Mode>("single");
  const [price, setPrice] = React.useState("120");
  const [discount, setDiscount] = React.useState("30");
  const [salePrice, setSalePrice] = React.useState("45");
  const [reverseDiscount, setReverseDiscount] = React.useState("25");
  const [stacked, setStacked] = React.useState<string[]>(["30", "15"]);
  const [taxRate, setTaxRate] = React.useState("0");
  const [currency, setCurrency] = React.useState("USD");

  const money = (value: number) => formatMoney(value, currency);
  const tax = parseNumber(taxRate) ?? 0;

  const result = React.useMemo(() => {
    if (mode === "reverse") {
      const sale = parseNumber(salePrice);
      const rate = parseNumber(reverseDiscount);
      if (sale === null || rate === null || sale < 0 || rate < 0 || rate >= 100) return null;

      const original = sale / (1 - rate / 100);
      return {
        headline: money(roundMoney(original)),
        headlineLabel: "Original price before the discount",
        final: roundMoney(sale),
        saved: roundMoney(original - sale),
        effective: rate,
        working: [
          `original = sale ÷ (1 − discount)`,
          `         = ${money(sale)} ÷ (1 − ${rate}/100)`,
          `         = ${money(sale)} ÷ ${(1 - rate / 100).toFixed(4)}`,
          `         = ${money(roundMoney(original))}`,
        ],
        base: original,
      };
    }

    const original = parseNumber(price);
    if (original === null || original < 0) return null;

    const rates =
      mode === "single"
        ? [parseNumber(discount)].filter((value): value is number => value !== null)
        : stacked.map(parseNumber).filter((value): value is number => value !== null);

    if (rates.length === 0 || rates.some((rate) => rate < 0 || rate > 100)) return null;

    let running = original;
    const working: string[] = [];
    for (const [index, rate] of rates.entries()) {
      const next = running * (1 - rate / 100);
      working.push(
        `Step ${index + 1}: ${money(roundMoney(running))} × (1 − ${rate}/100) = ${money(roundMoney(next))}`,
      );
      running = next;
    }

    const final = roundMoney(running);
    const saved = roundMoney(original - final);
    const effective = original === 0 ? 0 : (saved / original) * 100;

    working.push(`Saved = ${money(original)} − ${money(final)} = ${money(saved)}`);
    working.push(`Effective discount = ${money(saved)} ÷ ${money(original)} × 100 = ${effective.toFixed(2)}%`);

    return {
      headline: money(final),
      headlineLabel: "You pay",
      final,
      saved,
      effective,
      working,
      base: original,
    };
    // The money formatter is rebuilt every render but only ever varies with the currency,
    // which is already a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, discount, mode, price, reverseDiscount, salePrice, stacked]);

  const withTax = result && tax > 0 ? roundMoney(result.final * (1 + tax / 100)) : null;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="discount-mode"
          ariaLabel="Calculation type"
          value={mode}
          onChange={setMode}
          options={[
            { value: "single", label: "One discount" },
            { value: "stacked", label: "Stacked discounts" },
            { value: "reverse", label: "Find original price" },
          ]}
        />

        {mode === "reverse" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              id="discount-sale-price"
              label="Sale price you paid"
              value={salePrice}
              onChange={setSalePrice}
              min={0}
            />
            <NumberField
              id="discount-reverse-rate"
              label="Discount that was applied"
              value={reverseDiscount}
              onChange={setReverseDiscount}
              suffix="%"
              min={0}
              max={99}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              id="discount-price"
              label="Original price"
              value={price}
              onChange={setPrice}
              min={0}
            />
            {mode === "single" ? (
              <NumberField
                id="discount-rate"
                label="Discount"
                value={discount}
                onChange={setDiscount}
                suffix="%"
                min={0}
                max={100}
              />
            ) : (
              <div className="space-y-2">
                <span className="block text-[0.8125rem] font-medium text-fg">
                  Discounts, applied in order
                </span>
                <ul className="space-y-2">
                  {stacked.map((value, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-6 shrink-0 text-xs text-fg-subtle">{index + 1}.</span>
                      <Input
                        aria-label={`Discount ${index + 1} percentage`}
                        type="number"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(event) =>
                          setStacked((previous) =>
                            previous.map((item, i) => (i === index ? event.target.value : item)),
                          )
                        }
                        className="tabular"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove discount ${index + 1}`}
                        disabled={stacked.length <= 1}
                        onClick={() => setStacked((previous) => previous.filter((_, i) => i !== index))}
                      >
                        <X className="size-4" aria-hidden="true" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={stacked.length >= 5}
                  onClick={() => setStacked((previous) => [...previous, "10"])}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add discount
                </Button>
              </div>
            )}
          </div>
        )}

        <NumberField
          id="discount-tax"
          label="Sales tax or VAT (optional)"
          value={taxRate}
          onChange={setTaxRate}
          suffix="%"
          min={0}
          className="sm:max-w-xs"
          hint="Applied to the discounted price."
        />

        <CurrencySelect value={currency} onChange={setCurrency} id="discount-currency" />

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label={result.headlineLabel}
              value={result.headline}
              sublabel={
                mode === "reverse"
                  ? `You saved ${money(result.saved)} on the original price.`
                  : `You save ${money(result.saved)} — an effective discount of ${result.effective.toFixed(2)}%.`
              }
              breakdown={[
                { label: "Amount saved", value: money(result.saved) },
                {
                  label: withTax !== null ? `Total with ${tax}% tax` : "Effective discount",
                  value: withTax !== null ? money(withTax) : `${result.effective.toFixed(2)}%`,
                },
              ]}
            />

            <StatGrid className="sm:grid-cols-4">
              <Stat label="Original" value={money(roundMoney(result.base))} />
              <Stat label="You pay" value={money(result.final)} emphasis />
              <Stat label="Saved" value={money(result.saved)} />
              <Stat label="Effective off" value={`${result.effective.toFixed(1)}%`} />
            </StatGrid>

            {mode === "stacked" && stacked.length > 1 ? (
              <p className="rounded-lg border border-accent-soft-border bg-accent-soft px-3.5 py-2.5 text-sm text-fg">
                Adding these discounts together would suggest{" "}
                {stacked.reduce((sum, value) => sum + (parseNumber(value) ?? 0), 0).toFixed(0)}% off, but
                because each applies to the already-reduced price, the real saving is{" "}
                {result.effective.toFixed(2)}%.
              </p>
            ) : null}

            <Working
              lines={
                withTax !== null
                  ? [...result.working, `With tax = ${money(result.final)} × (1 + ${tax}/100) = ${money(withTax)}`]
                  : result.working
              }
            />
          </div>
        ) : (
          <EmptyResult message="Enter a price and a discount between 0% and 100%." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setPrice("");
              setDiscount("");
              setSalePrice("");
              setStacked(["", ""]);
              setTaxRate("0");
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
