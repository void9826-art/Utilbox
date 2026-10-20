"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { Alert, Badge } from "@/components/ui/surfaces";
import { formatMoney } from "@/lib/money";
import { COMPARE_BASIS, QUANTITY_UNITS, rankOffers, unitById, type Dimension } from "@/lib/unit-price";

import { CurrencySelect, SelectField, parseNumber } from "./_shared";

interface Item {
  id: number;
  name: string;
  price: string;
  quantity: string;
  unit: string;
  packs: string;
}

const START: Item[] = [
  { id: 1, name: "Large bag", price: "4.50", quantity: "1.5", unit: "kg", packs: "1" },
  { id: 2, name: "Small bag", price: "1.80", quantity: "500", unit: "g", packs: "1" },
  { id: 3, name: "Multipack", price: "5.00", quantity: "250", unit: "g", packs: "4" },
];

export default function UnitPriceCalculator() {
  const [items, setItems] = React.useState<Item[]>(START);
  const [currency, setCurrency] = React.useState("GBP");
  const nextId = React.useRef(START.length + 1);

  const firstUnit = unitById(items[0]?.unit ?? "g");
  const dimension: Dimension = firstUnit?.dimension ?? "mass";
  const [basisId, setBasisId] = React.useState("100g");
  const bases = COMPARE_BASIS[dimension];
  const basis = bases.find((entry) => entry.id === basisId) ?? bases[0];

  const update = (id: number, patch: Partial<Item>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const offers = items.map((item) => ({
    price: parseNumber(item.price) ?? NaN,
    quantity: parseNumber(item.quantity) ?? NaN,
    unit: item.unit,
    packs: parseNumber(item.packs) ?? 1,
  }));
  const ranked = rankOffers(offers, dimension);
  const rankOf = new Map(ranked.map((entry, position) => [entry.index, { ...entry, position }]));
  const mismatched = items.filter((item) => unitById(item.unit)?.dimension !== dimension);
  const money = (value: number) => formatMoney(value, currency);
  const unitPrice = (perBase: number) => {
    const value = perBase * basis.amount;
    // Small unit prices need more than two decimals to tell offers apart.
    return value < 1
      ? new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 4 }).format(value)
      : money(value);
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        <ul className="space-y-3">
          {items.map((item, index) => {
            const rank = rankOf.get(index);
            return (
              <li key={item.id} className="rounded-lg border border-border p-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr_auto] sm:items-end">
                  <label className="col-span-2 space-y-1 sm:col-span-1">
                    <span className="block text-xs font-medium text-fg-muted">Product</span>
                    <Input value={item.name} onChange={(event) => update(item.id, { name: event.target.value })} placeholder={`Option ${index + 1}`} />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-fg-muted">Price</span>
                    <Input type="number" inputMode="decimal" min={0} value={item.price} onChange={(event) => update(item.id, { price: event.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-fg-muted">Size of one pack</span>
                    <Input type="number" inputMode="decimal" min={0} value={item.quantity} onChange={(event) => update(item.id, { quantity: event.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-fg-muted">Unit</span>
                    <Select value={item.unit} onChange={(event) => update(item.id, { unit: event.target.value })}>
                      {QUANTITY_UNITS.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.label}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="space-y-1">
                    <span className="block text-xs font-medium text-fg-muted">Packs</span>
                    <Input type="number" inputMode="numeric" min={1} step={1} value={item.packs} onChange={(event) => update(item.id, { packs: event.target.value })} />
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${item.name || `option ${index + 1}`}`}
                    disabled={items.length <= 2}
                    onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
                  {rank ? (
                    <>
                      <span className="tabular font-semibold text-fg">
                        {unitPrice(rank.perBase)} {basis.label}
                      </span>
                      {rank.cheapest ? (
                        <Badge tone="accent">Cheapest</Badge>
                      ) : (
                        <span className="text-fg-muted">{(rank.premium * 100).toFixed(1)}% more per unit</span>
                      )}
                    </>
                  ) : (
                    <span className="text-fg-subtle">
                      {unitById(item.unit)?.dimension !== dimension
                        ? "Different kind of unit — not compared."
                        : "Enter a price and a size above zero."}
                    </span>
                  )}
                </p>
              </li>
            );
          })}
        </ul>

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            const id = nextId.current++;
            setItems((current) => [...current, { id, name: "", price: "", quantity: "", unit: current[0]?.unit ?? "g", packs: "1" }]);
          }}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add another option
        </Button>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Compare" id="unit-basis" value={basis.id} onChange={setBasisId}>
            {bases.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </SelectField>
          <CurrencySelect value={currency} onChange={setCurrency} id="unit-currency" />
        </div>

        {mismatched.length > 0 ? (
          <Alert tone="info" title="Weight and volume can't be compared directly">
            The first option is measured by {dimension === "mass" ? "weight" : dimension === "volume" ? "volume" : "count"}, so
            options measured another way are left out. Grams and millilitres only match for water-like liquids.
          </Alert>
        ) : null}

        {ranked.length >= 2 ? (
          <p className="rounded-lg border border-accent-soft-border bg-accent-soft px-3.5 py-2.5 text-sm text-fg" aria-live="polite">
            <strong>{items[ranked[0].index].name || `Option ${ranked[0].index + 1}`}</strong> is cheapest at{" "}
            {unitPrice(ranked[0].perBase)} {basis.label}
            {ranked.length > 1 && !ranked[1].cheapest
              ? ` — ${((1 - 1 / (1 + ranked[1].premium)) * 100).toFixed(1)}% less per unit than the next best.`
              : "."}
          </p>
        ) : null}
      </div>
    </ToolFrame>
  );
}
