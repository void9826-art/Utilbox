"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Segmented } from "@/components/ui/field";
import { formatNumber } from "@/lib/utils";

import { Metric, MetricGrid, TextInput, TextOutput } from "./_shared";

type Mode = "unique" | "duplicates" | "counts";

export default function RemoveDuplicateLines() {
  const [text, setText] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("unique");
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [trimWhitespace, setTrimWhitespace] = React.useState(true);
  const [removeEmpty, setRemoveEmpty] = React.useState(true);

  const result = React.useMemo(() => {
    if (!text) return { output: "", total: 0, kept: 0, removed: 0, duplicateGroups: 0 };

    const lines = text.split(/\r\n|\r|\n/);
    const key = (line: string) => {
      const base = trimWhitespace ? line.trim() : line;
      return caseSensitive ? base : base.toLowerCase();
    };

    const counts = new Map<string, number>();
    const firstOccurrence = new Map<string, string>();
    const order: string[] = [];

    for (const line of lines) {
      if (removeEmpty && line.trim() === "") continue;
      const id = key(line);
      if (!counts.has(id)) {
        counts.set(id, 1);
        firstOccurrence.set(id, trimWhitespace ? line.trim() : line);
        order.push(id);
      } else {
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }

    const considered = removeEmpty ? lines.filter((line) => line.trim() !== "").length : lines.length;
    const duplicateGroups = [...counts.values()].filter((count) => count > 1).length;

    let output: string;
    let kept: number;

    if (mode === "unique") {
      const rows = order.map((id) => firstOccurrence.get(id)!);
      output = rows.join("\n");
      kept = rows.length;
    } else if (mode === "duplicates") {
      const rows = order.filter((id) => (counts.get(id) ?? 0) > 1).map((id) => firstOccurrence.get(id)!);
      output = rows.join("\n");
      kept = rows.length;
    } else {
      const rows = order
        .map((id) => ({ line: firstOccurrence.get(id)!, count: counts.get(id) ?? 0 }))
        .sort((a, b) => b.count - a.count || a.line.localeCompare(b.line))
        .map((entry) => `${entry.count}\t${entry.line}`);
      output = rows.join("\n");
      kept = rows.length;
    }

    return {
      output,
      total: considered,
      kept,
      removed: considered - order.length,
      duplicateGroups,
    };
  }, [caseSensitive, mode, removeEmpty, text, trimWhitespace]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <TextInput
          id="dedupe-input"
          value={text}
          onChange={setText}
          rows={9}
          label="Your list"
          placeholder={"One item per line…\napple\nbanana\napple\ncherry"}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">What to keep</span>
            <Segmented
              name="dedupe-mode"
              ariaLabel="Output mode"
              value={mode}
              onChange={setMode}
              options={[
                { value: "unique", label: "Unique lines" },
                { value: "duplicates", label: "Only duplicates" },
                { value: "counts", label: "With counts" },
              ]}
            />
          </div>

          <div className="space-y-2.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Comparison</span>
            <Checkbox
              label="Case sensitive"
              description="Off means “Apple” and “apple” count as the same line."
              checked={caseSensitive}
              onChange={(event) => setCaseSensitive(event.target.checked)}
            />
            <Checkbox
              label="Ignore surrounding whitespace"
              description="Lines that differ only by leading or trailing spaces are merged."
              checked={trimWhitespace}
              onChange={(event) => setTrimWhitespace(event.target.checked)}
            />
            <Checkbox
              label="Drop blank lines"
              checked={removeEmpty}
              onChange={(event) => setRemoveEmpty(event.target.checked)}
            />
          </div>
        </div>

        <MetricGrid>
          <Metric label="Lines in" value={result.total} />
          <Metric label="Lines out" value={result.kept} emphasis />
          <Metric label="Duplicates removed" value={result.removed} />
          <Metric label="Repeated items" value={result.duplicateGroups} />
        </MetricGrid>

        <TextOutput
          id="dedupe-output"
          value={result.output}
          rows={9}
          downloadName="deduplicated.txt"
          meta={result.total > 0 ? `${formatNumber(result.kept)} lines` : undefined}
          emptyMessage="Paste a list above to remove its duplicate lines."
        />
      </div>
    </ToolFrame>
  );
}
