"use client";

import * as React from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { DEFAULT_CSV_TO_JSON, csvRowsToJson, detectDelimiter, parseCsv } from "@/lib/csv-parse";
import { downloadText } from "@/lib/download";
import { formatBytes, formatNumber } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";

const SAMPLE = `id,name,email,postcode,active,address.city
1,Ada Lovelace,ada@example.com,01234,true,London
2,"Hopper, Grace",grace@example.com,22201,false,Arlington
3,Alan Turing,alan@example.com,,true,Manchester`;

const DELIMITERS = [
  { value: "auto", label: "Detect automatically" },
  { value: ",", label: "Comma  ," },
  { value: ";", label: "Semicolon  ;" },
  { value: "\t", label: "Tab" },
  { value: "|", label: "Pipe  |" },
];

const DELIMITER_NAMES: Record<string, string> = { ",": "comma", ";": "semicolon", "\t": "tab", "|": "pipe" };

export default function CsvToJson() {
  const [input, setInput] = React.useState("");
  const [delimiterChoice, setDelimiterChoice] = React.useState("auto");
  const [header, setHeader] = React.useState(DEFAULT_CSV_TO_JSON.header);
  const [inferTypes, setInferTypes] = React.useState(DEFAULT_CSV_TO_JSON.inferTypes);
  const [nest, setNest] = React.useState(DEFAULT_CSV_TO_JSON.nest);
  const [indent, setIndent] = React.useState("2");

  const result = React.useMemo(() => {
    if (!input.trim()) return null;
    const delimiter = delimiterChoice === "auto" ? detectDelimiter(input) : delimiterChoice;
    const parsed = parseCsv(input, delimiter);
    const converted = csvRowsToJson(parsed.rows, { header, inferTypes, nest, skipEmptyRows: true });
    const space = indent === "0" ? undefined : indent === "tab" ? "\t" : Number(indent);
    const json = JSON.stringify(converted.records, null, space);
    return { ...converted, delimiter, json, unterminatedQuote: parsed.unterminatedQuote };
  }, [delimiterChoice, header, indent, inferTypes, input, nest]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <CodeEditor
          id="csv-to-json-input"
          label="CSV"
          value={input}
          onChange={setInput}
          rows={10}
          placeholder="Paste CSV here, or load a .csv file."
          accept=".csv,.tsv,.txt,text/csv"
          actions={
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput(SAMPLE)}>
              Load sample
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Delimiter" id="csv-json-delimiter" value={delimiterChoice} onChange={setDelimiterChoice}>
            {DELIMITERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <SelectField label="Indentation" id="csv-json-indent" value={indent} onChange={setIndent}>
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
            <option value="0">None (minified)</option>
          </SelectField>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          <Checkbox
            label="First row is a header"
            description="Each row becomes an object with these keys."
            checked={header}
            onChange={(event) => setHeader(event.target.checked)}
          />
          <Checkbox
            label="Detect numbers and true/false"
            description="Values with leading zeros stay as text."
            checked={inferTypes}
            onChange={(event) => setInferTypes(event.target.checked)}
          />
          <Checkbox
            label="Nest dotted headers"
            description="address.city becomes an address object."
            checked={nest}
            disabled={!header}
            onChange={(event) => setNest(event.target.checked)}
          />
        </div>

        {result ? (
          <div className="space-y-4" aria-live="polite">
            <StatGrid className="sm:grid-cols-4">
              <Stat label="Records" value={formatNumber(result.records.length)} emphasis />
              <Stat label="Columns" value={header ? formatNumber(result.headers.length) : "—"} />
              <Stat label="Delimiter" value={DELIMITER_NAMES[result.delimiter] ?? result.delimiter} />
              <Stat label="JSON size" value={formatBytes(new Blob([result.json]).size)} />
            </StatGrid>

            {result.unterminatedQuote ? (
              <Alert tone="warning" title="A quoted value is never closed">
                Somewhere a field opens with a double quote that is not closed, so everything after it was read
                as one value. Check for a stray quote mark in the CSV.
              </Alert>
            ) : null}
            {result.raggedRows > 0 ? (
              <Alert tone="info" title="Some rows have a different number of cells">
                {formatNumber(result.raggedRows)} row{result.raggedRows === 1 ? "" : "s"} did not match the header.
                Missing cells became null (or empty text) and extra cells got their own column.
              </Alert>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => downloadText(result.json, "data.json", "application/json;charset=utf-8")}
              >
                Download JSON
              </Button>
              <CopyButton value={result.json} label="Copy JSON" />
            </div>

            <CodeEditor id="csv-to-json-output" label="JSON" value={result.json} readOnly rows={14} />
          </div>
        ) : (
          <p className="text-sm text-fg-muted">Paste CSV or load a file to convert it to JSON.</p>
        )}
      </div>
    </ToolFrame>
  );
}
