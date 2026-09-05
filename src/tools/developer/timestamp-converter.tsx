"use client";

import * as React from "react";

import { CopyButton, ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Badge } from "@/components/ui/surfaces";
import { formatNumber } from "@/lib/utils";

type Unit = "seconds" | "milliseconds" | "microseconds";

/** Magnitude is the only reliable signal for which unit a bare number is in. */
function detectUnit(value: number): Unit {
  const digits = Math.abs(Math.trunc(value)).toString().length;
  if (digits >= 16) return "microseconds";
  if (digits >= 14) return "milliseconds";
  if (digits >= 12) return "milliseconds";
  return "seconds";
}

const UNIT_DIVISOR: Record<Unit, number> = {
  seconds: 1,
  milliseconds: 1000,
  microseconds: 1_000_000,
};

const UNIT_LABEL: Record<Unit, string> = {
  seconds: "seconds",
  milliseconds: "milliseconds",
  microseconds: "microseconds",
};

function pad(value: number, length = 2): string {
  return String(Math.abs(value)).padStart(length, "0");
}

function formatOffset(date: Date): string {
  const minutes = -date.getTimezoneOffset();
  const sign = minutes >= 0 ? "+" : "-";
  return `UTC${sign}${pad(Math.floor(Math.abs(minutes) / 60))}:${pad(Math.abs(minutes) % 60)}`;
}

function relativeTo(from: Date, now: Date): string {
  const seconds = Math.round((from.getTime() - now.getTime()) / 1000);
  const absolute = Math.abs(seconds);

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31_556_952],
    ["month", 2_629_746],
    ["day", 86_400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];

  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, size] of units) {
    if (absolute >= size || unit === "second") {
      return formatter.format(Math.round(seconds / size), unit);
    }
  }
  return "now";
}

/** Formats a Date as a local ISO-style string for the datetime input. */
function toDateTimeLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = React.useState("");
  const [unitOverride, setUnitOverride] = React.useState<Unit | "auto">("auto");
  const [dateInput, setDateInput] = React.useState("");
  const [now, setNow] = React.useState<Date | null>(null);

  // The live clock is started after mount so the server-rendered HTML and the
  // first client render agree.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the current time differs between the server render and the client, so the clock starts after mount
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- today's date in the visitor's timezone is not knowable on the server
    if (!dateInput) setDateInput(toDateTimeLocal(new Date()));
    // Only seeds the field once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decoded = React.useMemo(() => {
    const trimmed = timestamp.trim();
    if (!trimmed) return null;
    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return { ok: false as const, message: "A timestamp is a plain number of seconds or milliseconds." };
    }

    const raw = Number(trimmed);
    if (!Number.isFinite(raw)) {
      return { ok: false as const, message: "That number is too large to interpret as a timestamp." };
    }

    const unit = unitOverride === "auto" ? detectUnit(raw) : unitOverride;
    const milliseconds = (raw / UNIT_DIVISOR[unit]) * 1000;
    const date = new Date(milliseconds);

    if (Number.isNaN(date.getTime())) {
      return { ok: false as const, message: "That value is outside the range of representable dates." };
    }

    return { ok: true as const, date, unit, seconds: milliseconds / 1000 };
  }, [timestamp, unitOverride]);

  const encoded = React.useMemo(() => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return null;
    return date;
  }, [dateInput]);

  return (
    <ToolFrame>
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-fg">Current Unix time</h2>
            {now ? (
              <div className="flex items-center gap-1.5">
                <code className="tabular rounded-md border border-border bg-surface-sunken px-2.5 py-1 font-mono text-sm text-fg">
                  {Math.floor(now.getTime() / 1000)}
                </code>
                <CopyButton value={String(Math.floor(now.getTime() / 1000))} iconOnly variant="ghost" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setTimestamp(String(Math.floor(now.getTime() / 1000)))}
                >
                  Use it
                </Button>
              </div>
            ) : (
              <span className="tabular text-sm text-fg-subtle">Starting the clock…</span>
            )}
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-5">
          <h2 className="text-sm font-semibold text-fg">Timestamp to date</h2>

          <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
            <Field label="Unix timestamp" htmlFor="timestamp-input">
              <Input
                id="timestamp-input"
                value={timestamp}
                inputMode="numeric"
                placeholder="1788604200"
                onChange={(event) => setTimestamp(event.target.value)}
                className="tabular font-mono"
              />
            </Field>
            <Field label="Unit" htmlFor="timestamp-unit">
              <select
                id="timestamp-unit"
                value={unitOverride}
                onChange={(event) => setUnitOverride(event.target.value as Unit | "auto")}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-fg shadow-subtle"
              >
                <option value="auto">Detect automatically</option>
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
                <option value="microseconds">Microseconds</option>
              </select>
            </Field>
          </div>

          {decoded && !decoded.ok ? <ErrorMessage message={decoded.message} /> : null}

          {decoded?.ok ? (
            <div className="space-y-3">
              {unitOverride === "auto" ? (
                <Badge tone="accent">Read as {UNIT_LABEL[decoded.unit]}</Badge>
              ) : null}

              <dl className="overflow-hidden rounded-lg border border-border">
                <ResultRow
                  label="UTC"
                  value={decoded.date.toUTCString()}
                  mono
                />
                <ResultRow
                  label="Your timezone"
                  value={`${decoded.date.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" })}`}
                />
                <ResultRow label="Offset" value={formatOffset(decoded.date)} mono />
                <ResultRow label="ISO 8601" value={decoded.date.toISOString()} mono />
                <ResultRow
                  label="Seconds"
                  value={String(Math.floor(decoded.seconds))}
                  mono
                />
                <ResultRow
                  label="Milliseconds"
                  value={String(decoded.date.getTime())}
                  mono
                />
                <ResultRow
                  label="Relative"
                  value={now ? relativeTo(decoded.date, now) : "—"}
                />
                <ResultRow
                  label="Day of year"
                  value={String(
                    Math.floor(
                      (Date.UTC(decoded.date.getUTCFullYear(), decoded.date.getUTCMonth(), decoded.date.getUTCDate()) -
                        Date.UTC(decoded.date.getUTCFullYear(), 0, 0)) /
                        86_400_000,
                    ),
                  )}
                  mono
                />
              </dl>

              {Math.abs(decoded.seconds) > 2_147_483_647 ? (
                <p className="rounded-lg border border-warning/40 bg-warning-soft px-3.5 py-2.5 text-sm text-fg">
                  This timestamp is outside the range a signed 32-bit integer can hold. Systems still using
                  32-bit time will misread it — the same overflow behind the year 2038 problem.
                </p>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="space-y-3 border-t border-border pt-5">
          <h2 className="text-sm font-semibold text-fg">Date to timestamp</h2>

          <Field
            label="Date and time (in your timezone)"
            htmlFor="timestamp-date"
            className="sm:max-w-sm"
          >
            <Input
              id="timestamp-date"
              type="datetime-local"
              step="1"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
              className="tabular"
            />
          </Field>

          {encoded ? (
            <dl className="overflow-hidden rounded-lg border border-border">
              <ResultRow
                label="Seconds"
                value={String(Math.floor(encoded.getTime() / 1000))}
                mono
                copyable
              />
              <ResultRow label="Milliseconds" value={String(encoded.getTime())} mono copyable />
              <ResultRow label="ISO 8601 (UTC)" value={encoded.toISOString()} mono copyable />
              <ResultRow label="UTC" value={encoded.toUTCString()} mono />
            </dl>
          ) : (
            <p className="text-sm text-fg-muted">Pick a date and time to get its timestamp.</p>
          )}

          <p className="text-xs text-fg-subtle">
            {formatNumber(1)} Unix second is the same instant everywhere. The two readings above differ only
            because your timezone offset is {encoded ? formatOffset(encoded) : "applied"}.
          </p>
        </section>
      </div>
    </ToolFrame>
  );
}

function ResultRow({
  label,
  value,
  mono,
  copyable = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-3 py-2 last:border-b-0">
      <dt className="w-32 shrink-0 text-[0.8125rem] text-fg-muted">{label}</dt>
      <dd
        className={
          mono
            ? "tabular min-w-0 flex-1 font-mono text-[0.8125rem] break-all text-fg"
            : "min-w-0 flex-1 text-[0.8125rem] text-fg"
        }
      >
        {value}
      </dd>
      {copyable ? <CopyButton value={value} iconOnly variant="ghost" /> : null}
    </div>
  );
}
