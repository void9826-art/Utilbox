"use client";

import * as React from "react";
import { Dices } from "lucide-react";

import { CopyButton, ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { randomIntBetween, sampleUnique } from "@/lib/random";
import { formatNumber } from "@/lib/utils";

import { NumberField, parseNumber } from "../calculators/_shared";

export default function RandomNumberGenerator() {
  const [min, setMin] = React.useState("1");
  const [max, setMax] = React.useState("100");
  const [count, setCount] = React.useState("1");
  const [allowDuplicates, setAllowDuplicates] = React.useState(false);
  const [sortResults, setSortResults] = React.useState(false);
  const [results, setResults] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const minValue = parseNumber(min);
  const maxValue = parseNumber(max);
  const countValue = parseNumber(count);

  const rangeSize =
    minValue !== null && maxValue !== null
      ? Math.floor(Math.max(minValue, maxValue)) - Math.ceil(Math.min(minValue, maxValue)) + 1
      : 0;

  const validation = React.useMemo(() => {
    if (minValue === null || maxValue === null || countValue === null) {
      return "Enter a range and how many numbers you want.";
    }
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
      return "The range must be made of ordinary numbers.";
    }
    if (countValue < 1) return "Ask for at least one number.";
    if (countValue > 10000) return "You can draw up to 10,000 numbers at a time.";
    if (rangeSize < 1) return "The range is empty — check the minimum and maximum.";
    if (!allowDuplicates && countValue > rangeSize) {
      return `Without duplicates you cannot draw ${formatNumber(countValue)} numbers from a range of ${formatNumber(rangeSize)}.`;
    }
    return null;
  }, [allowDuplicates, countValue, maxValue, minValue, rangeSize]);

  const generate = React.useCallback(() => {
    if (validation || minValue === null || maxValue === null || countValue === null) {
      setError(validation);
      setResults([]);
      return;
    }

    setError(null);
    const wanted = Math.floor(countValue);

    const drawn = allowDuplicates
      ? Array.from({ length: wanted }, () => randomIntBetween(minValue, maxValue))
      : sampleUnique(minValue, maxValue, wanted);

    setResults(sortResults ? [...drawn].sort((a, b) => a - b) : drawn);
  }, [allowDuplicates, countValue, maxValue, minValue, sortResults, validation]);

  // Drawn after mount so the server-rendered HTML is deterministic.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a random draw made during render would differ between the server HTML and the client
    generate();
    // Only the initial draw; later draws come from the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joined = results.join(", ");

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField id="rng-min" label="Minimum" value={min} onChange={setMin} step={1} />
          <NumberField id="rng-max" label="Maximum" value={max} onChange={setMax} step={1} />
          <NumberField
            id="rng-count"
            label="How many"
            value={count}
            onChange={setCount}
            min={1}
            max={10000}
            step={1}
            inputMode="numeric"
          />
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Checkbox
            label="Allow the same number more than once"
            description="Off draws without replacement, like a lottery."
            checked={allowDuplicates}
            onChange={(event) => setAllowDuplicates(event.target.checked)}
          />
          <Checkbox
            label="Sort the results"
            checked={sortResults}
            onChange={(event) => setSortResults(event.target.checked)}
          />
        </div>

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={generate} disabled={validation !== null}>
            <Dices className="size-4" aria-hidden="true" />
            Generate
          </Button>
          {results.length > 0 ? <CopyButton value={joined} label="Copy" /> : null}
        </div>

        {results.length === 1 ? (
          <div
            className="rounded-[var(--radius-card)] border border-accent-soft-border bg-accent-soft px-6 py-10 text-center"
            aria-live="polite"
          >
            <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">Your number</p>
            <p className="tabular mt-1 text-6xl font-semibold tracking-tight text-fg">{results[0]}</p>
            <p className="mt-2 text-sm text-fg-muted">
              Drawn from {formatNumber(rangeSize)} possible values.
            </p>
          </div>
        ) : results.length > 1 ? (
          <div className="space-y-2" aria-live="polite">
            <p className="text-[0.8125rem] font-medium text-fg">
              {formatNumber(results.length)} numbers{allowDuplicates ? "" : ", all different"}
            </p>
            <div className="scrollbar-slim max-h-72 overflow-y-auto rounded-lg border border-border bg-surface-sunken p-3">
              <div className="flex flex-wrap gap-1.5">
                {results.map((value, index) => (
                  <span
                    key={`${index}-${value}`}
                    className="tabular rounded-md border border-border bg-surface px-2 py-1 font-mono text-[0.8125rem] text-fg"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <Alert tone="info" title="Cryptographic randomness">
          Numbers come from your browser&apos;s secure random number generator, seeded by the operating
          system — not from Math.random(), whose output can be predicted from earlier values.
        </Alert>
      </div>
    </ToolFrame>
  );
}
