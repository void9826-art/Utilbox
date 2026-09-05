"use client";

import * as React from "react";

import { Field, Input, Select } from "@/components/ui/field";
import { Card } from "@/components/ui/surfaces";
import { cn, formatNumber } from "@/lib/utils";

/** Parses a user-typed number, tolerating thousands separators and spaces. */
export function parseNumber(value: string): number | null {
  const cleaned = value.replace(/[\s,_]/g, "").replace(/[−–—]/g, "-");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export interface NumberFieldProps {
  label: React.ReactNode;
  id: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string | null;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | string;
  action?: React.ReactNode;
  inputMode?: "decimal" | "numeric";
  className?: string;
  autoFocus?: boolean;
}

export function NumberField({
  label,
  id,
  value,
  onChange,
  suffix,
  prefix,
  hint,
  error,
  placeholder,
  min,
  max,
  step = "any",
  action,
  inputMode = "decimal",
  className,
  autoFocus,
}: NumberFieldProps) {
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} action={action} className={className}>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-fg-subtle">
            {prefix}
          </span>
        ) : null}
        <Input
          id={id}
          type="number"
          inputMode={inputMode}
          value={value}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "tabular [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            prefix && "pl-7",
            suffix && "pr-12",
          )}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-fg-subtle">
            {suffix}
          </span>
        ) : null}
      </div>
    </Field>
  );
}

export function SelectField({
  label,
  id,
  value,
  onChange,
  children,
  hint,
  className,
}: {
  label: React.ReactNode;
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}) {
  return (
    <Field label={label} htmlFor={id} hint={hint} className={className}>
      <Select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </Select>
    </Field>
  );
}

/** The headline answer, with supporting figures underneath. */
export function ResultCard({
  label,
  value,
  sublabel,
  breakdown,
  children,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  sublabel?: React.ReactNode;
  breakdown?: Array<{ label: React.ReactNode; value: React.ReactNode }>;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn("overflow-hidden border-accent-soft-border", className)}
      aria-live="polite"
    >
      <div className="bg-accent-soft px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">{label}</p>
        <p className="tabular mt-1 text-3xl font-semibold tracking-tight text-fg break-words sm:text-4xl">
          {value}
        </p>
        {sublabel ? <p className="mt-1 text-sm text-fg-muted">{sublabel}</p> : null}
      </div>

      {breakdown && breakdown.length > 0 ? (
        <dl className="grid grid-cols-1 divide-y divide-border border-t border-border sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
          {breakdown.map((item, index) => (
            <div key={index} className="px-4 py-3 sm:px-5">
              <dt className="text-xs text-fg-muted">{item.label}</dt>
              <dd className="tabular mt-0.5 text-lg font-semibold text-fg">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {children ? <div className="border-t border-border p-4 sm:p-5">{children}</div> : null}
    </Card>
  );
}

/** "Here is how that was worked out" — shown under every calculator result. */
export function Working({ lines, title = "How this was calculated" }: { lines: string[]; title?: string }) {
  if (lines.length === 0) return null;

  return (
    <details className="group rounded-lg border border-border bg-surface-sunken">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-[0.8125rem] font-medium text-fg">
        {title}
        <span
          aria-hidden="true"
          className="text-fg-subtle transition-transform duration-200 group-open:rotate-90"
        >
          ›
        </span>
      </summary>
      <ol className="space-y-1.5 px-3.5 pb-3.5 text-[0.8125rem] text-fg-muted">
        {lines.map((line) => (
          <li key={line} className="tabular font-mono text-[0.75rem] leading-relaxed">
            {line}
          </li>
        ))}
      </ol>
    </details>
  );
}

export function EmptyResult({ message }: { message: string }) {
  return (
    <Card className="flex min-h-32 items-center justify-center border-dashed p-6 text-center">
      <p className="max-w-xs text-sm text-fg-muted">{message}</p>
    </Card>
  );
}

/** Scrollable schedule table used by the loan-style calculators. */
export function ScheduleTable({
  columns,
  rows,
  caption,
  maxHeight = "26rem",
}: {
  columns: string[];
  rows: React.ReactNode[][];
  caption: string;
  maxHeight?: string;
}) {
  return (
    <div
      className="scrollbar-slim overflow-auto rounded-lg border border-border"
      style={{ maxHeight }}
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className="w-full border-collapse text-[0.8125rem]">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 z-10 bg-surface-sunken">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={cn(
                  "border-b border-border px-3 py-2 font-semibold whitespace-nowrap text-fg",
                  index === 0 ? "text-left" : "text-right",
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-bg-muted/60">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "tabular border-b border-border px-3 py-1.5 whitespace-nowrap text-fg-muted last:border-b-0",
                    cellIndex === 0 ? "text-left font-medium text-fg" : "text-right",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Currencies offered by the financial calculators for display formatting. */
export const CURRENCIES = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "Pound Sterling (£)" },
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
  { code: "CAD", label: "Canadian Dollar (C$)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "AED", label: "UAE Dirham (د.إ)" },
  { code: "NPR", label: "Nepalese Rupee (रू)" },
  { code: "ZAR", label: "South African Rand (R)" },
  { code: "BRL", label: "Brazilian Real (R$)" },
] as const;

export function CurrencySelect({
  value,
  onChange,
  id = "currency",
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  return (
    <SelectField label="Currency" id={id} value={value} onChange={onChange}>
      {CURRENCIES.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.label}
        </option>
      ))}
    </SelectField>
  );
}

export function percent(value: number, digits = 2): string {
  return `${formatNumber(value, { maximumFractionDigits: digits })}%`;
}
