"use client";

import * as React from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { formatHtml, minifyHtml } from "@/lib/formatters";
import { formatBytes } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";

const SAMPLE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Example</title>
<style>body{margin:0;font-family:system-ui}</style></head><body><main class="page">
<h1>Hello</h1><p>Some <strong>bold</strong> text and a <a href="/about">link</a>.</p>
<ul><li>One</li><li>Two</li></ul><img src="/logo.svg" alt="Logo"></main></body></html>`;

export default function HtmlFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [indent, setIndent] = React.useState("2");
  const [lastAction, setLastAction] = React.useState<"format" | "minify" | null>(null);

  const run = (mode: "format" | "minify") => {
    setLastAction(mode);
    setOutput(mode === "format" ? formatHtml(input, Number(indent)) : minifyHtml(input));
  };

  const inputSize = input ? new Blob([input]).size : 0;
  const outputSize = output ? new Blob([output]).size : 0;
  const change = inputSize > 0 && outputSize > 0 ? ((outputSize - inputSize) / inputSize) * 100 : null;

  return (
    <ToolFrame>
      <div className="space-y-4">
        <CodeEditor
          id="html-formatter-input"
          label="HTML input"
          value={input}
          onChange={setInput}
          rows={12}
          placeholder="Paste your HTML here…"
          accept=".html,.htm,.txt,text/html"
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
            id="html-indent"
            value={indent}
            onChange={setIndent}
            className="w-36"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="8">8 spaces</option>
          </SelectField>
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
          id="html-formatter-output"
          label="Result"
          value={output}
          readOnly
          rows={12}
          downloadName={lastAction === "minify" ? "minified.html" : "formatted.html"}
          placeholder="The formatted HTML will appear here."
        />

        <Alert tone="info" title="Script, style, pre and textarea are left alone">
          Their contents are either another language or whitespace-significant, so reindenting them could
          change what the page does. They are copied through exactly as written.
        </Alert>
      </div>
    </ToolFrame>
  );
}
