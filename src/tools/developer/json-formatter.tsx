"use client";

import * as React from "react";

import { CodeEditor, SyntaxErrorPanel } from "@/components/tool/code-editor";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/field";
import { Badge } from "@/components/ui/surfaces";
import { parseJson, sortKeysDeep } from "@/lib/json";
import { formatBytes } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";

const SAMPLE = `{
  "name": "Utilbox",
  "tools": 73,
  "categories": ["pdf", "calculators", "image"],
  "offline": true,
  "config": { "theme": "auto", "analytics": null }
}`;

const INDENT_OPTIONS = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tab" },
];

export default function JsonFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [indent, setIndent] = React.useState("2");
  const [sortKeys, setSortKeys] = React.useState(false);
  const [error, setError] = React.useState<{ message: string; line: number | null; column: number | null } | null>(
    null,
  );

  const run = (mode: "format" | "minify") => {
    const parsed = parseJson(input);

    if (!parsed.ok) {
      setError({ message: parsed.message, line: parsed.line, column: parsed.column });
      setOutput("");
      return;
    }

    setError(null);
    const value = sortKeys ? sortKeysDeep(parsed.value) : parsed.value;
    const spacer = mode === "minify" ? undefined : indent === "tab" ? "\t" : Number(indent);
    setOutput(JSON.stringify(value, null, spacer));
  };

  const sizeChange =
    input && output
      ? ((new Blob([output]).size - new Blob([input]).size) / new Blob([input]).size) * 100
      : null;

  return (
    <ToolFrame>
      <div className="space-y-4">
        <CodeEditor
          id="json-formatter-input"
          label="JSON input"
          value={input}
          onChange={(value) => {
            setInput(value);
            setError(null);
          }}
          rows={12}
          errorLine={error?.line ?? null}
          placeholder='Paste your JSON here, for example {"name": "value"}'
          accept=".json,.txt,application/json"
          actions={
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput(SAMPLE)}>
              Load sample
            </Button>
          }
        />

        <div className="flex flex-wrap items-end gap-3">
          <Button type="button" onClick={() => run("format")} disabled={!input.trim()}>
            Format
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => run("minify")}
            disabled={!input.trim()}
          >
            Minify
          </Button>
          <SelectField
            label="Indentation"
            id="json-indent"
            value={indent}
            onChange={setIndent}
            className="w-36"
          >
            {INDENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <div className="pb-2">
            <Checkbox
              label="Sort keys alphabetically"
              checked={sortKeys}
              onChange={(event) => setSortKeys(event.target.checked)}
            />
          </div>
        </div>

        {error ? (
          <SyntaxErrorPanel
            message={error.message}
            line={error.line}
            column={error.column}
            source={input}
          />
        ) : null}

        {output ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="success">Valid JSON</Badge>
            <span className="tabular text-xs text-fg-muted">
              {formatBytes(new Blob([input]).size)} → {formatBytes(new Blob([output]).size)}
              {sizeChange !== null && Math.abs(sizeChange) >= 0.5
                ? ` (${sizeChange > 0 ? "+" : ""}${sizeChange.toFixed(0)}%)`
                : null}
            </span>
          </div>
        ) : null}

        <CodeEditor
          id="json-formatter-output"
          label="Result"
          value={output}
          readOnly
          rows={12}
          downloadName="formatted.json"
          placeholder="Formatted JSON will appear here."
        />
      </div>
    </ToolFrame>
  );
}
