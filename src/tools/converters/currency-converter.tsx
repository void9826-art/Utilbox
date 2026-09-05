"use client";

import * as React from "react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";

import { CopyButton, ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { Alert, Skeleton } from "@/components/ui/surfaces";
import { CURRENCY_INFO, currencyLabel } from "@/lib/currencies";
import type { RateSnapshot } from "@/lib/rates";
import { cn } from "@/lib/utils";

import { parseNumber } from "../calculators/_shared";

const POPULAR = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"];
const CODES = Object.keys(CURRENCY_INFO).sort();

function formatAmount(value: number, code: string): string {
  if (!Number.isFinite(value)) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
}

export default function CurrencyConverter() {
  const [amount, setAmount] = React.useState("100");
  const [from, setFrom] = React.useState("USD");
  const [to, setTo] = React.useState("EUR");
  const [snapshot, setSnapshot] = React.useState<RateSnapshot | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (base: string) => {
    setLoading(true);
    setError(null);

    try {
      // The request carries only a currency code — never the amount typed.
      const response = await fetch(`/api/rates?base=${encodeURIComponent(base)}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(typeof payload?.error === "string" ? payload.error : "Rates unavailable.");
      }
      setSnapshot(payload as RateSnapshot);
    } catch (caught) {
      setSnapshot(null);
      setError(
        caught instanceof Error && caught.message !== "Failed to fetch"
          ? `${caught.message} Conversion needs live reference rates, so no figure is shown rather than a guessed one.`
          : "Exchange rates could not be loaded. Check your connection and try again — no rate is shown rather than a stale one.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching the rate table is exactly what an effect is for; the server-rendered page shows the loading state
    void load(from);
  }, [from, load]);

  const value = parseNumber(amount);
  const rate = snapshot?.rates[to] ?? null;
  const converted = value !== null && rate !== null ? value * rate : null;

  const swap = () => {
    setFrom(to);
    setTo(from);
    if (converted !== null) setAmount(String(Number(converted.toFixed(4))));
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-1.5">
            <label htmlFor="currency-amount" className="text-[0.8125rem] font-medium text-fg">
              Amount
            </label>
            <Input
              id="currency-amount"
              type="number"
              inputMode="decimal"
              step="any"
              min={0}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="tabular text-lg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Select
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              aria-label="Convert from currency"
            >
              {CODES.map((code) => (
                <option key={code} value={code}>
                  {currencyLabel(code)}
                </option>
              ))}
            </Select>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={swap}
            aria-label="Swap the two currencies"
            className="mb-[3.25rem] justify-self-center sm:mb-9"
          >
            <ArrowLeftRight className="size-4" aria-hidden="true" />
          </Button>

          <div className="space-y-1.5">
            <label htmlFor="currency-result" className="text-[0.8125rem] font-medium text-fg">
              Converts to
            </label>
            <div className="relative">
              <Input
                id="currency-result"
                readOnly
                aria-live="polite"
                value={
                  loading
                    ? "Loading rates…"
                    : converted === null
                      ? ""
                      : String(Number(converted.toFixed(6)))
                }
                className="tabular bg-surface-sunken pr-11 text-lg font-semibold"
              />
              <span className="absolute inset-y-0 right-1 flex items-center">
                <CopyButton
                  value={converted === null ? "" : String(Number(converted.toFixed(6)))}
                  iconOnly
                  variant="ghost"
                />
              </span>
            </div>
            <Select
              value={to}
              onChange={(event) => setTo(event.target.value)}
              aria-label="Convert to currency"
            >
              {CODES.map((code) => (
                <option key={code} value={code}>
                  {currencyLabel(code)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <ErrorMessage message={error} />

        {loading ? (
          <Skeleton className="h-14 w-full" />
        ) : converted !== null && rate !== null ? (
          <div className="rounded-lg border border-accent-soft-border bg-accent-soft px-4 py-3.5 text-center">
            <p className="text-lg font-semibold text-fg">
              {formatAmount(value ?? 0, from)} = {formatAmount(converted, to)}
            </p>
            <p className="tabular mt-1 text-sm text-fg-muted">
              1 {from} = {rate.toFixed(6)} {to} · 1 {to} = {(1 / rate).toFixed(6)} {from}
            </p>
          </div>
        ) : null}

        {snapshot ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-fg-muted">
              <span>
                Reference rates for{" "}
                <strong className="font-semibold text-fg">
                  {new Date(`${snapshot.date}T00:00:00`).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>{" "}
                from {snapshot.providerName}.
              </span>
              <Button type="button" variant="ghost" size="sm" onClick={() => void load(from)}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Refresh
              </Button>
            </div>

            <section className="space-y-2">
              <h2 className="text-[0.8125rem] font-medium text-fg">
                {value !== null ? `${formatAmount(value, from)} in other currencies` : "Rates"}
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {POPULAR.filter((code) => code !== from && snapshot.rates[code]).map((code) => {
                  const amountIn = (value ?? 0) * snapshot.rates[code];
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setTo(code)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
                        code === to
                          ? "border-accent-soft-border bg-accent-soft"
                          : "border-border bg-surface hover:border-border-strong",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block text-[0.8125rem] font-medium text-fg">{code}</span>
                        <span className="block truncate text-[0.6875rem] text-fg-subtle">
                          {CURRENCY_INFO[code]?.name}
                        </span>
                      </span>
                      <span className="tabular shrink-0 text-sm font-semibold text-fg">
                        {formatAmount(amountIn, code)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        ) : null}

        <Alert tone="warning" title="These are reference rates, not a quote">
          They are the daily mid-market rates published by the European Central Bank — the midpoint
          between buying and selling. Banks, cards and transfer services add a margin of roughly 0.5% to
          4% on top, plus any fixed fee, so what you actually pay will differ.
        </Alert>

        <p className="text-xs text-fg-subtle">
          The amount you type is converted in your browser. Only the currency code is sent, to look up a
          rate.
        </p>
      </div>
    </ToolFrame>
  );
}
