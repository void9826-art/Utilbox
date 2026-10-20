"use client";

import * as React from "react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Field, Input } from "@/components/ui/field";
import { Alert, Card } from "@/components/ui/surfaces";
import { fromRoman, romanParts, toRoman } from "@/lib/roman";
import { formatNumber } from "@/lib/utils";

export default function RomanNumeralConverter() {
  const [number, setNumber] = React.useState("2026");
  const [roman, setRoman] = React.useState("MMXXVI");
  const [note, setNote] = React.useState<{ tone: "danger" | "info"; text: string } | null>(null);

  const onNumber = (value: string) => {
    setNumber(value);
    const parsed = Number(value.replace(/[\s,]/g, ""));
    if (!value.trim()) {
      setRoman("");
      setNote(null);
      return;
    }
    const result = toRoman(parsed);
    if (result) {
      setRoman(result);
      setNote(null);
    } else {
      setNote({ tone: "danger", text: "Standard Roman numerals cover whole numbers from 1 to 3,999." });
    }
  };

  const onRoman = (value: string) => {
    setRoman(value.toUpperCase());
    if (!value.trim()) {
      setNumber("");
      setNote(null);
      return;
    }
    const result = fromRoman(value);
    if (!result.ok) {
      setNote({ tone: "danger", text: result.message });
      return;
    }
    setNumber(String(result.value));
    setNote(
      result.standard
        ? null
        : { tone: "info", text: `Read as ${formatNumber(result.value)}, but the standard way to write it is ${result.suggestion}.` },
    );
  };

  const value = Number(number);
  const parts = Number.isInteger(value) && value >= 1 && value <= 3999 ? romanParts(value) : [];

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Number" htmlFor="roman-number" hint="1 to 3,999">
            <Input
              id="roman-number"
              inputMode="numeric"
              value={number}
              onChange={(event) => onNumber(event.target.value)}
              className="tabular text-lg"
            />
          </Field>
          <Field
            label="Roman numeral"
            htmlFor="roman-numeral"
            hint="Letters I V X L C D M"
            action={<CopyButton value={roman} iconOnly label="Copy numeral" variant="ghost" />}
          >
            <Input
              id="roman-numeral"
              value={roman}
              autoCapitalize="characters"
              spellCheck={false}
              onChange={(event) => onRoman(event.target.value)}
              className="font-mono text-lg tracking-wider"
            />
          </Field>
        </div>

        <div aria-live="polite">
          {note ? <Alert tone={note.tone}>{note.text}</Alert> : null}
        </div>

        {parts.length > 0 ? (
          <Card className="p-4">
            <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">How it adds up</p>
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
              {parts.map((part, index) => (
                <React.Fragment key={index}>
                  {index > 0 ? <span className="text-fg-subtle">+</span> : null}
                  <span className="rounded-md border border-border bg-surface-sunken px-2 py-1 font-mono text-fg">
                    {part.symbol} <span className="text-fg-muted">= {formatNumber(part.value)}</span>
                  </span>
                </React.Fragment>
              ))}
              <span className="text-fg-subtle">=</span>
              <strong className="tabular text-fg">{formatNumber(value)}</strong>
            </p>
          </Card>
        ) : null}

        <div className="grid grid-cols-4 gap-2 text-center sm:grid-cols-7" aria-label="Roman numeral values">
          {[
            ["I", 1],
            ["V", 5],
            ["X", 10],
            ["L", 50],
            ["C", 100],
            ["D", 500],
            ["M", 1000],
          ].map(([symbol, amount]) => (
            <div key={symbol} className="rounded-lg border border-border px-2 py-2">
              <p className="font-mono text-lg font-semibold text-fg">{symbol}</p>
              <p className="tabular text-xs text-fg-muted">{formatNumber(Number(amount))}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolFrame>
  );
}
