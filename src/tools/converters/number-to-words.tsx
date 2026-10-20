"use client";

import * as React from "react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Field, Input, Segmented } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { CURRENCY_WORDS, amountToWords, numberToWords, parseDecimal, toOrdinal, type Scale } from "@/lib/number-words";

import { SelectField } from "../calculators/_shared";

type Mode = "words" | "money";

function Output({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5 rounded-lg border border-border p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">{label}</p>
        <CopyButton value={value} iconOnly label={`Copy ${label.toLowerCase()}`} variant="ghost" />
      </div>
      <p className="text-base break-words text-fg">{value}</p>
    </div>
  );
}

export default function NumberToWords() {
  const [input, setInput] = React.useState("1234.56");
  const [mode, setMode] = React.useState<Mode>("money");
  const [currencyId, setCurrencyId] = React.useState("USD");
  const [scale, setScale] = React.useState<Scale>("international");
  const [useAnd, setUseAnd] = React.useState(false);
  const [capital, setCapital] = React.useState(true);

  const currency = CURRENCY_WORDS.find((entry) => entry.id === currencyId) ?? CURRENCY_WORDS[0];
  const options = { scale, useAnd };
  const cap = (text: string) => (capital ? text.charAt(0).toUpperCase() + text.slice(1) : text.charAt(0).toLowerCase() + text.slice(1));

  const parsed = parseDecimal(input);
  const words = mode === "words" ? numberToWords(input, options) : null;
  const money = mode === "money" ? amountToWords(input, currency, options) : null;
  const ordinal = words && parsed && !parsed.fraction && !parsed.negative ? toOrdinal(words) : null;
  const invalid = input.trim() !== "" && (mode === "words" ? words === null : money === null);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="words-mode"
          ariaLabel="Write as"
          value={mode}
          onChange={setMode}
          options={[
            { value: "money", label: "Money / cheque" },
            { value: "words", label: "Plain number" },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={mode === "money" ? "Amount" : "Number"} htmlFor="words-input" hint="Commas and spaces are ignored.">
            <Input
              id="words-input"
              inputMode="decimal"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="tabular text-lg"
            />
          </Field>
          {mode === "money" ? (
            <SelectField
              label="Currency"
              id="words-currency"
              value={currencyId}
              onChange={(value) => {
                setCurrencyId(value);
                const next = CURRENCY_WORDS.find((entry) => entry.id === value);
                if (next) setScale(next.scale);
              }}
            >
              {CURRENCY_WORDS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </SelectField>
          ) : null}
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Number system</span>
            <Segmented
              name="words-scale"
              ariaLabel="Number system"
              value={scale}
              onChange={setScale}
              options={[
                { value: "international", label: "Million, billion" },
                { value: "indian", label: "Lakh, crore" },
              ]}
            />
          </div>
          <div className="space-y-2.5 sm:pt-6">
            <Checkbox
              label="Use “and” (British style)"
              description="One hundred and five."
              checked={useAnd}
              onChange={(event) => setUseAnd(event.target.checked)}
            />
            <Checkbox label="Capital first letter" checked={capital} onChange={(event) => setCapital(event.target.checked)} />
          </div>
        </div>

        <div aria-live="polite" className="space-y-3">
          {invalid ? (
            <Alert tone="danger">
              {mode === "money"
                ? "Enter a positive amount such as 1250 or 1,250.75."
                : "Enter a number such as 42, -7 or 3.25. Numbers up to the sextillions are supported."}
            </Alert>
          ) : null}
          {money ? (
            <>
              <Output label="In words" value={cap(money.spoken)} />
              <Output label="Cheque line" value={cap(money.cheque)} />
            </>
          ) : null}
          {words ? <Output label="In words" value={cap(words)} /> : null}
          {ordinal ? <Output label="Ordinal" value={cap(ordinal)} /> : null}
        </div>
      </div>
    </ToolFrame>
  );
}
