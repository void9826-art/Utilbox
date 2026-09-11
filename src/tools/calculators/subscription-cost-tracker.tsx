"use client";

import * as React from "react";
import { Plus, Printer, Trash2 } from "lucide-react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { DEFAULT_CSV_OPTIONS, escapeCsvValue } from "@/lib/csv";
import { downloadText } from "@/lib/download";
import { monthlyCost, nextRenewal, yearlyCost, type BillingCycle } from "@/lib/household";
import { formatMoney, roundMoney } from "@/lib/money";

import { CurrencySelect, parseNumber } from "./_shared";

interface Subscription {
  id: string;
  name: string;
  price: string;
  cycle: BillingCycle;
  category: string;
  renewal: string;
  cancel: boolean;
}

interface Saved {
  currency: string;
  items: Subscription[];
}

const STORAGE_KEY = "subscription-cost-tracker-v1";
const CYCLES: Array<{ value: BillingCycle; label: string }> = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];
const CATEGORIES = ["Entertainment", "Music", "Software", "Cloud storage", "News", "Fitness", "Food", "Phone and internet", "Other"];

let sequence = 0;
const newId = () => {
  sequence += 1;
  return `sub-${Date.now().toString(36)}-${sequence}`;
};

const EXAMPLE: Subscription[] = [
  { id: "example-1", name: "Video streaming", price: "15.49", cycle: "monthly", category: "Entertainment", renewal: "", cancel: false },
  { id: "example-2", name: "Meal kit", price: "6.99", cycle: "weekly", category: "Food", renewal: "", cancel: false },
  { id: "example-3", name: "Cloud storage", price: "99", cycle: "yearly", category: "Cloud storage", renewal: "", cancel: false },
];

function readSaved(): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Saved;
    if (!value || !Array.isArray(value.items) || typeof value.currency !== "string") return null;
    return value;
  } catch {
    return null;
  }
}

export default function SubscriptionCostTracker() {
  const [items, setItems] = React.useState<Subscription[]>(EXAMPLE);
  const [currency, setCurrency] = React.useState("USD");
  const [loaded, setLoaded] = React.useState(false);

  // Restored after mount, so the server render and the first client render match.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const saved = readSaved();
      if (saved) {
        setItems(saved.items);
        setCurrency(saved.currency);
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ currency, items } satisfies Saved));
    } catch {
      // Storage blocked: the list still works for this visit.
    }
  }, [currency, items, loaded]);

  const money = (value: number) => formatMoney(roundMoney(value), currency);
  const update = (id: string, patch: Partial<Subscription>) =>
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const priced = items
    .map((item) => ({ item, price: parseNumber(item.price) }))
    .filter((entry): entry is { item: Subscription; price: number } => entry.price !== null && entry.price >= 0);

  const monthly = priced.reduce((sum, entry) => sum + monthlyCost(entry.price, entry.item.cycle), 0);
  const yearly = priced.reduce((sum, entry) => sum + yearlyCost(entry.price, entry.item.cycle), 0);
  const savingsYearly = priced.filter((entry) => entry.item.cancel).reduce((sum, entry) => sum + yearlyCost(entry.price, entry.item.cycle), 0);

  const byCategory = [...priced.reduce((map, entry) => {
    map.set(entry.item.category, (map.get(entry.item.category) ?? 0) + monthlyCost(entry.price, entry.item.cycle));
    return map;
  }, new Map<string, number>())].sort((a, b) => b[1] - a[1]);

  const today = new Date();
  const upcoming = items
    .map((item) => ({ item, date: item.renewal ? nextRenewal(item.renewal, item.cycle, today) : null }))
    .filter((entry): entry is { item: Subscription; date: string } => entry.date !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const exportCsv = () => {
    const rows = [
      ["Name", "Price", "Billing", "Category", "Next renewal", "Per month", "Per year", "Considering cancelling"],
      ...priced.map(({ item, price }) => [
        item.name,
        price.toFixed(2),
        item.cycle,
        item.category,
        item.renewal ? (nextRenewal(item.renewal, item.cycle, today) ?? "") : "",
        roundMoney(monthlyCost(price, item.cycle)).toFixed(2),
        roundMoney(yearlyCost(price, item.cycle)).toFixed(2),
        item.cancel ? "yes" : "no",
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => escapeCsvValue(cell, DEFAULT_CSV_OPTIONS)).join(",")).join("\r\n");
    downloadText(`${csv}\r\n`, "subscriptions.csv", "text/csv;charset=utf-8");
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        <StatGrid className="sm:grid-cols-3" aria-live="polite">
          <Stat label="Per month" value={money(monthly)} emphasis />
          <Stat label="Per year" value={money(yearly)} />
          <Stat label="Saving if you cancel the ticked ones" value={money(savingsYearly)} hint={`${money(savingsYearly / 12)} a month`} />
        </StatGrid>

        <div className="print:hidden space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="w-full sm:w-64">
              <CurrencySelect value={currency} onChange={setCurrency} id="subscription-currency" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => window.print()}>
                <Printer className="size-4" aria-hidden="true" />
                Print list
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={exportCsv} disabled={priced.length === 0}>
                Export CSV
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setItems([])} disabled={items.length === 0}>
                Clear all
              </Button>
            </div>
          </div>

          <ul className="space-y-2">
            {items.map((item, index) => {
              const price = parseNumber(item.price);
              const label = item.name || `Subscription ${index + 1}`;
              return (
                <li key={item.id} className="grid gap-2 rounded-lg border border-border bg-surface p-3 sm:grid-cols-[minmax(0,1.4fr)_7rem_8rem_minmax(0,1fr)_9.5rem_auto]">
                  <Input aria-label={`Name of ${label}`} value={item.name} placeholder="Name" onChange={(event) => update(item.id, { name: event.target.value })} />
                  <Input
                    aria-label={`Price of ${label}`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    value={item.price}
                    placeholder="Price"
                    onChange={(event) => update(item.id, { price: event.target.value })}
                  />
                  <Select aria-label={`Billing cycle of ${label}`} value={item.cycle} onChange={(event) => update(item.id, { cycle: event.target.value as BillingCycle })}>
                    {CYCLES.map((cycle) => (
                      <option key={cycle.value} value={cycle.value}>
                        {cycle.label}
                      </option>
                    ))}
                  </Select>
                  <Select aria-label={`Category of ${label}`} value={item.category} onChange={(event) => update(item.id, { category: event.target.value })}>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                  <Input aria-label={`Renewal date of ${label}`} type="date" value={item.renewal} onChange={(event) => update(item.id, { renewal: event.target.value })} />
                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-fg-muted">
                      <input
                        type="checkbox"
                        checked={item.cancel}
                        onChange={(event) => update(item.id, { cancel: event.target.checked })}
                        className="size-4 accent-[var(--accent)]"
                      />
                      Cancel?
                    </label>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Delete ${label}`} onClick={() => setItems((previous) => previous.filter((entry) => entry.id !== item.id))}>
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                  {price !== null && price >= 0 ? (
                    <p className="tabular text-xs text-fg-subtle sm:col-span-6">
                      {money(monthlyCost(price, item.cycle))} a month · {money(yearlyCost(price, item.cycle))} a year
                    </p>
                  ) : item.price ? (
                    <p className="text-xs font-semibold text-fg sm:col-span-6">Enter the price as a number.</p>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setItems((previous) => [...previous, { id: newId(), name: "", price: "", cycle: "monthly", category: "Other", renewal: "", cancel: false }])}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add a subscription
          </Button>
          <p className="text-xs text-fg-subtle">Your list is saved in this browser only and never uploaded.</p>
        </div>

        {byCategory.length > 0 ? (
          <section className="space-y-2" aria-labelledby="subscription-categories">
            <h2 id="subscription-categories" className="text-[0.8125rem] font-semibold text-fg">
              Monthly cost by category
            </h2>
            <ul className="space-y-1.5">
              {byCategory.map(([category, amount]) => (
                <li key={category} className="grid grid-cols-[8rem_minmax(0,1fr)_6rem] items-center gap-2 text-[0.8125rem]">
                  <span className="truncate text-fg">{category}</span>
                  <span className="h-2 rounded-full bg-bg-muted" aria-hidden="true">
                    <span className="block h-2 rounded-full bg-fg" style={{ width: `${monthly > 0 ? (amount / monthly) * 100 : 0}%` }} />
                  </span>
                  <span className="tabular text-right text-fg">{money(amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {upcoming.length > 0 ? (
          <section className="space-y-2" aria-labelledby="subscription-upcoming">
            <h2 id="subscription-upcoming" className="text-[0.8125rem] font-semibold text-fg">
              Next renewals
            </h2>
            <ul className="space-y-1 text-[0.8125rem]">
              {upcoming.map(({ item, date }) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span className="text-fg">{item.name || "Unnamed subscription"}</span>
                  <span className="tabular text-fg-muted">
                    {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { dateStyle: "medium" })} · {money(parseNumber(item.price) ?? 0)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <table className="hidden w-full border-collapse text-sm print:table">
          <caption className="mb-2 text-left font-semibold">Subscriptions — {money(monthly)} a month, {money(yearly)} a year</caption>
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="py-1 pr-2">Name</th>
              <th scope="col" className="py-1 pr-2">Billing</th>
              <th scope="col" className="py-1 pr-2">Category</th>
              <th scope="col" className="py-1 pr-2 text-right">Per month</th>
              <th scope="col" className="py-1 text-right">Per year</th>
            </tr>
          </thead>
          <tbody>
            {priced.map(({ item, price }) => (
              <tr key={item.id} className="border-b border-border">
                <td className="py-1 pr-2">{item.name || "Unnamed"}{item.cancel ? " (cancelling)" : ""}</td>
                <td className="py-1 pr-2">{money(price)} {item.cycle}</td>
                <td className="py-1 pr-2">{item.category}</td>
                <td className="py-1 pr-2 text-right">{money(monthlyCost(price, item.cycle))}</td>
                <td className="py-1 text-right">{money(yearlyCost(price, item.cycle))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolFrame>
  );
}
