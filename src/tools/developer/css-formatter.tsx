"use client";

import * as React from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatCss, minifyCss } from "@/lib/formatters";
import { formatBytes } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";

const SAMPLE = `/* Layout */
.card,.panel{display:flex;gap:1rem;padding:1.25rem;border:1px solid var(--border)}
@media (min-width:768px){.card{flex-direction:row}.card .title{font-size:1.25rem;font-weight:600}}
.hero{background:url("hero.jpg;v=2") center/cover no-repeat;color:#fff}
.button:hover{background:color-mix(in oklch,var(--accent) 90%,black)}`;

export default function CssFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [indent, setIndent] = React.useState("2");
  const [selectorPerLine, setSelectorPerLine] = React.useState(true);
  const [lastAction, setLastAction] = React.useState<"format" | "minify" | null>(null);

  const run = (mode: "format" | "minify") => {
    setLastAction(mode);
    setOutput(mode === "format" ? formatCss(input, Number(indent), selectorPerLine) : minifyCss(input));
  };

  const inputSize = input ? new Blob([input]).size : 0;
  const outputSize = output ? new Blob([output]).size : 0;
  const change = inputSize > 0 && outputSize > 0 ? ((outputSize - inputSize) / inputSize) * 100 : null;

  return (
    <ToolFrame>
      <div className="space-y-4">
        <CodeEditor
          id="css-formatter-input"
          label="CSS input"
          value={input}
          onChange={setInput}
          rows={12}
          placeholder="Paste your stylesheet here…"
          accept=".css,.txt,text/css"
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
            id="css-indent"
            value={indent}
            onChange={setIndent}
            className="w-36"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
          </SelectField>
          <div className="pb-2">
            <Checkbox
              label="One selector per line"
              checked={selectorPerLine}
              onChange={(event) => setSelectorPerLine(event.target.checked)}
            />
          </div>
        </div>

        {output ? (
          <StatGrid className="sm:grid-cols-3">
            <Stat label="Before" value={formatBytes(inputSize)} />
            <Stat label="After" value={formatBytes(outputSize)} emphasis />
            <Stat
              label={lastAction === "minify" ? "Saved" : "Change"}
              value={change === null ? "—" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`}
            />
          </StatGrid>
        ) : null}

        <CodeEditor
          id="css-formatter-output"
          label="Result"
          value={output}
          readOnly
          rows={12}
          downloadName={lastAction === "minify" ? "minified.css" : "formatted.css"}
          placeholder="The formatted CSS will appear here."
        />
      </div>
    </ToolFrame>
  );
}
