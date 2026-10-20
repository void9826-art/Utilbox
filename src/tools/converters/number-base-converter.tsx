"use client";

import * as React from "react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { bitLength, formatInBase, groupDigits, parseInBase, twosComplement } from "@/lib/number-base";

import { SelectField } from "../calculators/_shared";

const COMMON = [
  { base: 2, label: "Binary", group: 4, prefix: "0b" },
  { base: 8, label: "Octal", group: 3, prefix: "0o" },
  { base: 10, label: "Decimal", group: 3, prefix: "" },
  { base: 16, label: "Hexadecimal", group: 4, prefix: "0x" },
];

export default function NumberBaseConverter() {
  const [input, setInput] = React.useState("255");
  const [fromBase, setFromBase] = React.useState("10");
  const [customBase, setCustomBase] = React.useState("36");
  const [grouped, setGrouped] = React.useState(true);
  const [uppercase, setUppercase] = React.useState(true);

  const parsed = input.trim() ? parseInBase(input, Number(fromBase)) : null;
  const value = parsed?.ok ? parsed.value : null;

  const render = (base: number, group: number) => {
    if (value === null) return "";
    const text = formatInBase(value, base, uppercase);
    return grouped ? groupDigits(text, group, base === 10 ? "," : " ") : text;
  };

  const custom = Number(customBase);
  const customValid = Number.isInteger(custom) && custom >= 2 && custom <= 36;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Field label="Number" htmlFor="base-input" hint="Prefixes 0x, 0b and 0o, spaces and underscores are accepted.">
            <Input
              id="base-input"
              value={input}
              spellCheck={false}
              autoComplete="off"
              onChange={(event) => setInput(event.target.value)}
              className="font-mono text-lg"
            />
          </Field>
          <SelectField label="Input base" id="base-from" value={fromBase} onChange={setFromBase}>
            {COMMON.map((entry) => (
              <option key={entry.base} value={String(entry.base)}>
                {entry.label} (base {entry.base})
              </option>
            ))}
            {Array.from({ length: 35 }, (_, index) => index + 2)
              .filter((base) => !COMMON.some((entry) => entry.base === base))
              .map((base) => (
                <option key={base} value={String(base)}>
                  Base {base}
                </option>
              ))}
          </SelectField>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
          <Checkbox label="Group digits" checked={grouped} onChange={(event) => setGrouped(event.target.checked)} />
          <Checkbox label="Upper-case letters" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} />
        </div>

        <div aria-live="polite" className="space-y-3">
          {parsed && !parsed.ok ? <Alert tone="danger">{parsed.message}</Alert> : null}

          {value !== null ? (
            <>
              <ul className="divide-y divide-border rounded-lg border border-border">
                {COMMON.map((entry) => (
                  <li key={entry.base} className="flex items-center gap-3 px-3.5 py-2.5">
                    <div className="w-24 shrink-0">
                      <p className="text-[0.8125rem] font-semibold text-fg">{entry.label}</p>
                      <p className="text-xs text-fg-subtle">base {entry.base}</p>
                    </div>
                    <code className="min-w-0 flex-1 font-mono text-[0.875rem] break-all text-fg">{render(entry.base, entry.group)}</code>
                    <CopyButton value={entry.prefix + formatInBase(value, entry.base, uppercase)} iconOnly label={`Copy ${entry.label.toLowerCase()}`} variant="ghost" />
                  </li>
                ))}
                <li className="flex items-center gap-3 px-3.5 py-2.5">
                  <div className="w-24 shrink-0">
                    <label htmlFor="base-custom" className="text-[0.8125rem] font-semibold text-fg">
                      Base
                    </label>
                    <Input
                      id="base-custom"
                      type="number"
                      min={2}
                      max={36}
                      value={customBase}
                      onChange={(event) => setCustomBase(event.target.value)}
                      className="mt-1 h-8 w-16 px-2"
                    />
                  </div>
                  <code className="min-w-0 flex-1 font-mono text-[0.875rem] break-all text-fg">
                    {customValid ? render(custom, 4) : "Choose a base from 2 to 36."}
                  </code>
                  {customValid ? (
                    <CopyButton value={formatInBase(value, custom, uppercase)} iconOnly label={`Copy base ${custom}`} variant="ghost" />
                  ) : null}
                </li>
              </ul>

              <StatGrid className="sm:grid-cols-3">
                <Stat label="Bits needed" value={String(bitLength(value))} />
                <Stat label="Bytes needed" value={String(Math.ceil(bitLength(value) / 8))} />
                <Stat label="Sign" value={value < BigInt(0) ? "Negative" : "Positive or zero"} />
              </StatGrid>

              {value < BigInt(0) ? (
                <section className="space-y-1.5" aria-labelledby="base-twos-heading">
                  <h2 id="base-twos-heading" className="text-[0.8125rem] font-medium text-fg">
                    Two&apos;s complement (how computers store negative integers)
                  </h2>
                  <ul className="divide-y divide-border rounded-lg border border-border">
                    {[8, 16, 32, 64].map((bits) => {
                      const pattern = twosComplement(value, bits);
                      return (
                        <li key={bits} className="flex flex-wrap items-baseline gap-x-3 px-3.5 py-2 text-[0.8125rem]">
                          <span className="w-14 font-medium text-fg">{bits}-bit</span>
                          <code className="min-w-0 flex-1 font-mono break-all text-fg-muted">
                            {pattern
                              ? `${groupDigits(pattern, 4)}  (0x${BigInt(`0b${pattern}`).toString(16).toUpperCase()})`
                              : "does not fit"}
                          </code>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </ToolFrame>
  );
}
