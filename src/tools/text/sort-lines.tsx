"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Segmented } from "@/components/ui/field";

import { Metric, MetricGrid, TextInput, TextOutput } from "./_shared";

type SortMethod = "alphabetical" | "numeric" | "length" | "random";

/** Locale-aware comparison with digit runs read as numbers, so item2 < item10. */
const naturalCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "variant" });
const plainCollator = new Intl.Collator(undefined, { numeric: false, sensitivity: "variant" });

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  // Fisher-Yates with cryptographic randomness gives a uniform permutation.
  const random = new Uint32Array(copy.length);
  crypto.getRandomValues(random);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = random[i] % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SortLines() {
  const [text, setText] = React.useState("");
  const [method, setMethod] = React.useState<SortMethod>("alphabetical");
  const [descending, setDescending] = React.useState(false);
  const [naturalOrder, setNaturalOrder] = React.useState(true);
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [removeEmpty, setRemoveEmpty] = React.useState(true);
  const [trim, setTrim] = React.useState(false);
  const [seed, setSeed] = React.useState(0);

  const result = React.useMemo(() => {
    if (!text) return { output: "", count: 0, unsortable: 0 };

    let lines = text.split(/\r\n|\r|\n/);
    if (trim) lines = lines.map((line) => line.trim());
    if (removeEmpty) lines = lines.filter((line) => line.trim() !== "");

    let sorted: string[];
    let unsortable = 0;

    switch (method) {
      case "alphabetical": {
        const collator = naturalOrder ? naturalCollator : plainCollator;
        sorted = [...lines].sort((a, b) =>
          caseSensitive ? collator.compare(a, b) : collator.compare(a.toLowerCase(), b.toLowerCase()),
        );
        break;
      }
      case "numeric": {
        const parsed = lines.map((line) => {
          const match = line.match(/-?\d+(\.\d+)?/);
          const value = match ? Number(match[0]) : NaN;
          if (Number.isNaN(value)) unsortable += 1;
          return { line, value };
        });
        // Lines with no number keep their relative order at the end.
        sorted = parsed
          .sort((a, b) => {
            if (Number.isNaN(a.value) && Number.isNaN(b.value)) return 0;
            if (Number.isNaN(a.value)) return 1;
            if (Number.isNaN(b.value)) return -1;
            return a.value - b.value;
          })
          .map((entry) => entry.line);
        break;
      }
      case "length":
        sorted = [...lines].sort((a, b) => a.length - b.length || naturalCollator.compare(a, b));
        break;
      case "random":
        sorted = shuffle(lines);
        break;
    }

    if (descending && method !== "random") sorted.reverse();

    return { output: sorted.join("\n"), count: sorted.length, unsortable };
    // `seed` is not read above, but incrementing it is what makes the shuffle
    // button produce a new arrangement of the same input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseSensitive, descending, method, naturalOrder, removeEmpty, text, trim, seed]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <TextInput
          id="sort-lines-input"
          value={text}
          onChange={setText}
          rows={9}
          label="Your lines"
          placeholder={"One item per line…\nitem10\nitem2\nitem1"}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Sort by</span>
              <Segmented
                name="sort-method"
                ariaLabel="Sort method"
                value={method}
                onChange={setMethod}
                options={[
                  { value: "alphabetical", label: "A–Z" },
                  { value: "numeric", label: "Numeric" },
                  { value: "length", label: "Length" },
                  { value: "random", label: "Random" },
                ]}
              />
            </div>

            {method === "random" ? (
              <button
                type="button"
                onClick={() => setSeed((previous) => previous + 1)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[0.8125rem] font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
              >
                Shuffle again
              </button>
            ) : (
              <Segmented
                name="sort-direction"
                ariaLabel="Sort direction"
                value={descending ? "desc" : "asc"}
                onChange={(value) => setDescending(value === "desc")}
                options={[
                  { value: "asc", label: "Ascending" },
                  { value: "desc", label: "Descending" },
                ]}
              />
            )}
          </div>

          <div className="space-y-2.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Options</span>
            {method === "alphabetical" ? (
              <>
                <Checkbox
                  label="Natural order for numbers"
                  description="Puts item2 before item10 instead of after it."
                  checked={naturalOrder}
                  onChange={(event) => setNaturalOrder(event.target.checked)}
                />
                <Checkbox
                  label="Case sensitive"
                  checked={caseSensitive}
                  onChange={(event) => setCaseSensitive(event.target.checked)}
                />
              </>
            ) : null}
            <Checkbox
              label="Drop blank lines"
              checked={removeEmpty}
              onChange={(event) => setRemoveEmpty(event.target.checked)}
            />
            <Checkbox
              label="Trim spaces from each line"
              checked={trim}
              onChange={(event) => setTrim(event.target.checked)}
            />
          </div>
        </div>

        <MetricGrid className="sm:grid-cols-3">
          <Metric label="Lines" value={result.count} emphasis />
          <Metric
            label="Method"
            value={
              method === "alphabetical"
                ? naturalOrder
                  ? "Natural A–Z"
                  : "Plain A–Z"
                : method === "numeric"
                  ? "Numeric"
                  : method === "length"
                    ? "By length"
                    : "Random"
            }
          />
          <Metric
            label="Without a number"
            value={method === "numeric" ? result.unsortable : "—"}
            hint={method === "numeric" ? "Moved to the end" : "Numeric mode only"}
          />
        </MetricGrid>

        <TextOutput
          id="sort-lines-output"
          value={result.output}
          rows={9}
          downloadName="sorted-lines.txt"
          emptyMessage="Paste some lines above to sort them."
        />
      </div>
    </ToolFrame>
  );
}
