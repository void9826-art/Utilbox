"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { CodeEditor, SyntaxErrorPanel } from "@/components/tool/code-editor";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { analyseJson, parseJson } from "@/lib/json";
import { formatBytes, formatNumber } from "@/lib/utils";

export default function JsonValidator() {
  const [input, setInput] = React.useState("");

  const result = React.useMemo(() => {
    if (!input.trim()) return null;
    const parsed = parseJson(input);
    if (!parsed.ok) {
      return {
        ok: false as const,
        message: parsed.message,
        line: parsed.line,
        column: parsed.column,
      };
    }
    return { ok: true as const, stats: analyseJson(parsed.value, input), value: parsed.value };
  }, [input]);

  const rootType = React.useMemo(() => {
    if (!result?.ok) return null;
    const value = result.value;
    if (Array.isArray(value)) return `Array of ${value.length}`;
    if (value === null) return "null";
    return typeof value === "object" ? "Object" : typeof value;
  }, [result]);

  return (
    <ToolFrame>
      <div className="space-y-4">
        <CodeEditor
          id="json-validator-input"
          label="JSON to check"
          value={input}
          onChange={setInput}
          rows={14}
          errorLine={result && !result.ok ? result.line : null}
          placeholder="Paste JSON here. It is checked as you type."
          accept=".json,.txt,application/json"
        />

        {result === null ? (
          <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-fg-muted">
            Paste some JSON above and it is validated straight away.
          </div>
        ) : result.ok ? (
          <div className="space-y-4">
            <div
              role="status"
              className="flex items-center gap-3 rounded-lg border border-success/30 bg-success-soft p-3.5"
            >
              <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-fg">Valid JSON</p>
                <p className="text-sm text-fg-muted">
                  Parsed successfully as {rootType}. Any conforming parser will accept it.
                </p>
              </div>
            </div>

            {result.stats.duplicateKeyPaths.length > 0 ? (
              <Alert tone="warning" title="Duplicate keys found">
                The keys{" "}
                <strong className="font-semibold text-fg">
                  {result.stats.duplicateKeyPaths.join(", ")}
                </strong>{" "}
                appear more than once in the same object. JSON permits this, but parsers silently keep only
                the last value — which is almost always a mistake.
              </Alert>
            ) : null}

            <StatGrid>
              <Stat label="Root type" value={rootType ?? "—"} emphasis />
              <Stat label="Nesting depth" value={formatNumber(result.stats.depth)} />
              <Stat label="Objects" value={formatNumber(result.stats.objects)} />
              <Stat label="Arrays" value={formatNumber(result.stats.arrays)} />
              <Stat label="Keys" value={formatNumber(result.stats.keys)} />
              <Stat label="Strings" value={formatNumber(result.stats.strings)} />
              <Stat label="Numbers" value={formatNumber(result.stats.numbers)} />
              <Stat
                label="Largest array"
                value={formatNumber(result.stats.largestArray)}
                hint="items"
              />
              <Stat label="Booleans" value={formatNumber(result.stats.booleans)} />
              <Stat label="Nulls" value={formatNumber(result.stats.nulls)} />
              <Stat label="Size" value={formatBytes(new Blob([input]).size)} />
              <Stat label="Lines" value={formatNumber(input.split("\n").length)} />
            </StatGrid>
          </div>
        ) : (
          <SyntaxErrorPanel
            message={result.message}
            line={result.line}
            column={result.column}
            source={input}
          />
        )}
      </div>
    </ToolFrame>
  );
}
