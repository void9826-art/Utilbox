"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox } from "@/components/ui/field";
import { diffLines, splitLines, summariseDiff, type DiffLine } from "@/lib/text-diff";
import { formatNumber } from "@/lib/utils";

import { Metric, MetricGrid, TextInput } from "./_shared";

const rawLines = (text: string) => text.replace(/\r\n?/g, "\n").split("\n");

/**
 * Compares on a normalised key (lower-cased when case is ignored) but shows the
 * original wording. diffLines consumes both sides strictly in order, so walking
 * its result with one cursor per side maps every key back to its own line.
 */
function compare(before: string[], after: string[], ignoreCase: boolean): DiffLine[] {
  const key = (line: string) => (ignoreCase ? line.toLowerCase() : line);
  const keyed = diffLines(before.map(key), after.map(key));
  let left = 0;
  let right = 0;
  return keyed.map((line) => {
    if (line.type === "equal") {
      right += 1;
      return { type: "equal", text: before[left++] };
    }
    if (line.type === "delete") return { type: "delete", text: before[left++] };
    return { type: "insert", text: after[right++] };
  });
}

export default function TextCompare() {
  const [original, setOriginal] = React.useState("");
  const [revised, setRevised] = React.useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = React.useState(true);
  const [ignoreCase, setIgnoreCase] = React.useState(false);

  const result = React.useMemo(() => {
    if (!original && !revised) return null;
    const split = ignoreWhitespace ? splitLines : rawLines;
    const lines = compare(split(original), split(revised), ignoreCase);
    return { lines, summary: summariseDiff(lines) };
  }, [ignoreCase, ignoreWhitespace, original, revised]);

  const report = result
    ? result.lines
        .map((line) => `${line.type === "insert" ? "+" : line.type === "delete" ? "-" : " "} ${line.text}`)
        .join("\n")
    : "";

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <TextInput
            id="compare-original"
            label="Original text"
            value={original}
            onChange={setOriginal}
            rows={10}
            placeholder="Paste the earlier version here."
          />
          <TextInput
            id="compare-revised"
            label="Changed text"
            value={revised}
            onChange={setRevised}
            rows={10}
            placeholder="Paste the newer version here."
          />
        </div>

        <div className="space-y-2.5">
          <span className="block text-[0.8125rem] font-medium text-fg">Comparison</span>
          <Checkbox
            label="Ignore spaces at line ends and blank lines"
            description="Lines that differ only by surrounding spaces count as the same."
            checked={ignoreWhitespace}
            onChange={(event) => setIgnoreWhitespace(event.target.checked)}
          />
          <Checkbox
            label="Ignore capital letters"
            description="“Total” and “total” count as the same line."
            checked={ignoreCase}
            onChange={(event) => setIgnoreCase(event.target.checked)}
          />
        </div>

        {result ? (
          <div className="space-y-4">
            <MetricGrid>
              <Metric label="Lines added" value={formatNumber(result.summary.added)} emphasis />
              <Metric label="Lines removed" value={formatNumber(result.summary.removed)} />
              <Metric label="Unchanged" value={formatNumber(result.summary.unchanged)} />
            </MetricGrid>

            {result.summary.changed ? (
              <section className="rounded-lg border border-border" aria-labelledby="compare-result-heading">
                <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-sunken px-3.5 py-2">
                  <h3 id="compare-result-heading" className="text-sm font-semibold text-fg">
                    Differences
                  </h3>
                  <CopyButton value={report} size="sm" label="Copy report" />
                </div>
                <ul className="scrollbar-slim max-h-96 divide-y divide-border overflow-y-auto">
                  {result.lines.map((line, index) => (
                    <li key={index} className="flex items-start gap-2 px-3.5 py-1.5 text-[0.8125rem]">
                      {line.type === "insert" ? (
                        <Plus className="mt-0.5 size-3.5 shrink-0 text-fg" aria-hidden="true" />
                      ) : line.type === "delete" ? (
                        <Minus className="mt-0.5 size-3.5 shrink-0 text-fg" aria-hidden="true" />
                      ) : (
                        <span className="size-3.5 shrink-0" aria-hidden="true" />
                      )}
                      {line.type !== "equal" ? (
                        <span className="sr-only">{line.type === "insert" ? "Added:" : "Removed:"}</span>
                      ) : null}
                      <span
                        className={
                          line.type === "insert"
                            ? "bg-success-soft whitespace-pre-wrap break-words text-fg"
                            : line.type === "delete"
                              ? "whitespace-pre-wrap break-words text-fg-muted line-through"
                              : "whitespace-pre-wrap break-words text-fg-muted"
                        }
                      >
                        {line.text || " "}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <p className="rounded-lg border border-accent-soft-border bg-accent-soft px-3.5 py-2.5 text-sm text-fg">
                The two texts match line for line
                {ignoreWhitespace || ignoreCase ? " under the comparison settings above" : ""}.
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-fg-muted">Paste two versions of a text to see which lines were added or removed.</p>
        )}
      </div>
    </ToolFrame>
  );
}
