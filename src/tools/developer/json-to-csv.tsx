"use client";

import * as React from "react";

import { CodeEditor, SyntaxErrorPanel } from "@/components/tool/code-editor";
import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import {
  DEFAULT_CSV_OPTIONS,
  jsonToRows,
  rowsToCsv,
  type ArrayHandling,
  type CsvOptions,
} from "@/lib/csv";
import { downloadText } from "@/lib/download";
import { parseJson } from "@/lib/json";
import { formatBytes, formatNumber } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";

const SAMPLE = `[
  { "id": 1, "name": "Ada Lovelace", "role": { "title": "Engineer", "team": "Core" }, "tags": ["maths", "computing"] },
  { "id": 2, "name": "Grace Hopper", "role": { "title": "Rear Admiral", "team": "Navy" }, "tags": ["compilers"] },
  { "id": 3, "name": "Alan Turing", "role": { "title": "Researcher" } }
]`;

const DELIMITERS = [
  { value: ",", label: "Comma  ,  (standard)" },
  { value: ";", label: "Semicolon  ;  (European locales)" },
  { value: "\t", label: "Tab" },
  { value: "|", label: "Pipe  |" },
];

const ARRAY_MODES: Array<{ value: ArrayHandling; label: string }> = [
  { value: "index", label: "Separate columns (tags.0, tags.1)" },
  { value: "join", label: "One cell, joined" },
  { value: "jsonString", label: "One cell, as JSON text" },
];

export default function JsonToCsv() {
  const [input, setInput] = React.useState("");
  const [delimiter, setDelimiter] = React.useState(",");
  const [arrays, setArrays] = React.useState<ArrayHandling>("join");
  const [includeHeader, setIncludeHeader] = React.useState(true);
  const [escapeFormulas, setEscapeFormulas] = React.useState(true);
  const [crlf, setCrlf] = React.useState(false);

  const parsed = React.useMemo(() => (input.trim() ? parseJson(input) : null), [input]);

  const table = React.useMemo(() => {
    if (!parsed?.ok) return null;
    try {
      return jsonToRows(parsed.value, { arrays, arrayJoiner: " | ", maxDepth: 12 });
    } catch {
      return null;
    }
  }, [arrays, parsed]);

  const csv = React.useMemo(() => {
    if (!table) return "";
    const options: CsvOptions = { ...DEFAULT_CSV_OPTIONS, delimiter, includeHeader, escapeFormulas, crlf };
    return rowsToCsv(table.headers, table.rows, options);
  }, [crlf, delimiter, escapeFormulas, includeHeader, table]);

  const previewRows = table?.rows.slice(0, 8) ?? [];

  return (
    <ToolFrame>
      <div className="space-y-4">
        <CodeEditor
          id="json-to-csv-input"
          label="JSON input"
          value={input}
          onChange={setInput}
          rows={10}
          errorLine={parsed && !parsed.ok ? parsed.line : null}
          placeholder="Paste an array of objects, or an object containing one."
          accept=".json,.txt,application/json"
          actions={
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput(SAMPLE)}>
              Load sample
            </Button>
          }
        />

        {parsed && !parsed.ok ? (
          <SyntaxErrorPanel
            message={parsed.message}
            line={parsed.line}
            column={parsed.column}
            source={input}
          />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Delimiter" id="csv-delimiter" value={delimiter} onChange={setDelimiter}>
            {DELIMITERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Nested arrays"
            id="csv-arrays"
            value={arrays}
            onChange={(value) => setArrays(value as ArrayHandling)}
          >
            {ARRAY_MODES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          <Checkbox
            label="Include a header row"
            checked={includeHeader}
            onChange={(event) => setIncludeHeader(event.target.checked)}
          />
          <Checkbox
            label="Protect against formula injection"
            description="Prefixes values starting with = + - @"
            checked={escapeFormulas}
            onChange={(event) => setEscapeFormulas(event.target.checked)}
          />
          <Checkbox
            label="Windows line endings (CRLF)"
            checked={crlf}
            onChange={(event) => setCrlf(event.target.checked)}
          />
        </div>

        {table ? (
          <>
            <StatGrid className="sm:grid-cols-4">
              <Stat label="Records" value={formatNumber(table.recordCount)} emphasis />
              <Stat label="Columns" value={formatNumber(table.headers.length)} />
              <Stat label="Incomplete columns" value={formatNumber(table.sparseColumns.length)} />
              <Stat label="CSV size" value={formatBytes(new Blob([csv]).size)} />
            </StatGrid>

            {table.sparseColumns.length > 0 ? (
              <Alert tone="info" title="Some records are missing fields">
                <span className="font-mono text-[0.8125rem]">
                  {table.sparseColumns.slice(0, 8).join(", ")}
                  {table.sparseColumns.length > 8 ? ` and ${table.sparseColumns.length - 8} more` : ""}
                </span>{" "}
                do not appear in every record. Those cells are left empty rather than dropped.
              </Alert>
            ) : null}

            <section className="space-y-2">
              <h2 className="text-[0.8125rem] font-medium text-fg">
                Preview{table.rows.length > 8 ? ` — first 8 of ${formatNumber(table.rows.length)} rows` : ""}
              </h2>
              <div
                className="scrollbar-slim overflow-auto rounded-lg border border-border"
                style={{ maxHeight: "22rem" }}
                tabIndex={0}
                role="region"
                aria-label="CSV preview"
              >
                <table className="w-full border-collapse text-[0.8125rem]">
                  <thead className="sticky top-0 bg-surface-sunken">
                    <tr>
                      {table.headers.map((header) => (
                        <th
                          key={header}
                          scope="col"
                          className="border-b border-border px-3 py-2 text-left font-semibold whitespace-nowrap text-fg"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="even:bg-bg-muted/60">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="max-w-64 truncate border-b border-border px-3 py-1.5 text-fg-muted"
                            title={cell}
                          >
                            {cell || <span className="text-fg-subtle">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => downloadText(csv, "data.csv", "text/csv;charset=utf-8")}>
                Download CSV
              </Button>
              <CopyButton value={csv} label="Copy CSV" />
            </div>

            <CodeEditor
              id="json-to-csv-output"
              label="CSV output"
              value={csv}
              readOnly
              rows={8}
              showStats={false}
            />
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
