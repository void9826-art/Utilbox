"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/field";
import { formatNumber } from "@/lib/utils";

import { Metric, MetricGrid, TextInput, TextOutput } from "./_shared";

interface CleanerOption {
  id: string;
  label: string;
  description: string;
  apply: (text: string) => string;
  defaultOn: boolean;
}

/** Characters that look like nothing but break search, sort and comparison. */
const INVISIBLE_PATTERN =
  /[​‌‍⁠﻿᠎­؜‎‏‪-‮⁦-⁩]/g;

const SMART_QUOTE_MAP: Record<string, string> = {
  "‘": "'",
  "’": "'",
  "‚": "'",
  "‛": "'",
  "“": '"',
  "”": '"',
  "„": '"',
  "‟": '"',
  "–": "-",
  "—": "-",
  "―": "-",
  "…": "...",
  " ": " ",
  "′": "'",
  "″": '"',
};

const OPTIONS: CleanerOption[] = [
  {
    id: "invisible",
    label: "Remove invisible characters",
    description: "Zero-width spaces, joiners, byte-order marks and direction marks.",
    defaultOn: true,
    apply: (text) => text.replace(INVISIBLE_PATTERN, ""),
  },
  {
    id: "smartQuotes",
    label: "Straighten smart quotes and dashes",
    description: "Curly quotes, em dashes, ellipses and non-breaking spaces become plain ASCII.",
    defaultOn: true,
    apply: (text) => text.replace(/[‘-‟–-―… ′″]/g, (character) => SMART_QUOTE_MAP[character] ?? character),
  },
  {
    id: "trailing",
    label: "Trim trailing spaces",
    description: "Removes spaces and tabs at the end of every line.",
    defaultOn: true,
    apply: (text) => text.replace(/[ \t]+$/gm, ""),
  },
  {
    id: "multiSpace",
    label: "Collapse repeated spaces",
    description: "Runs of two or more spaces become a single space.",
    defaultOn: true,
    apply: (text) => text.replace(/ {2,}/g, " "),
  },
  {
    id: "tabs",
    label: "Convert tabs to spaces",
    description: "Each tab becomes two spaces.",
    defaultOn: false,
    apply: (text) => text.replace(/\t/g, "  "),
  },
  {
    id: "joinLines",
    label: "Join broken lines",
    description: "Merges lines split by a PDF or email client, keeping real paragraph breaks.",
    defaultOn: false,
    apply: (text) =>
      // A blank line is a real paragraph break; a lone newline is usually a PDF
      // wrapping artefact. Splitting on paragraphs first keeps the two apart.
      text
        .split(/\n[ \t]*\n\s*/)
        .map((paragraph) =>
          paragraph
            // A hyphen at the end of a line is a split word: rejoin it.
            .replace(/-\n[ \t]*/g, "")
            .replace(/[ \t]*\n[ \t]*/g, " ")
            .trim(),
        )
        .filter((paragraph) => paragraph.length > 0)
        .join("\n\n"),
  },
  {
    id: "blankLines",
    label: "Collapse blank lines",
    description: "Three or more blank lines in a row become one.",
    defaultOn: true,
    apply: (text) => text.replace(/\n{3,}/g, "\n\n"),
  },
  {
    id: "stripHtml",
    label: "Strip HTML tags",
    description: "Removes markup and decodes entities. The markup is never rendered.",
    defaultOn: false,
    apply: (text) =>
      text
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;|&apos;/g, "'"),
  },
  {
    id: "punctuationSpace",
    label: "Fix spacing around punctuation",
    description: "Removes a space before , . ! ? and ensures one after.",
    defaultOn: false,
    apply: (text) =>
      text.replace(/\s+([,.!?;:])/g, "$1").replace(/([,.!?;:])(?=[^\s\d"')\]}])/g, "$1 "),
  },
  {
    id: "normalise",
    label: "Normalise Unicode (NFC)",
    description: "Combines accents into single code points so comparison works reliably.",
    defaultOn: false,
    apply: (text) => text.normalize("NFC"),
  },
  {
    id: "lowercase",
    label: "Convert to lowercase",
    description: "Useful for normalising imported data.",
    defaultOn: false,
    apply: (text) => text.toLowerCase(),
  },
  {
    id: "trimAll",
    label: "Trim the whole text",
    description: "Removes leading and trailing whitespace from the document.",
    defaultOn: true,
    apply: (text) => text.trim(),
  },
];

export default function TextCleaner() {
  const [text, setText] = React.useState("");
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(OPTIONS.map((option) => [option.id, option.defaultOn])),
  );

  const output = React.useMemo(() => {
    let result = text;
    for (const option of OPTIONS) {
      if (enabled[option.id]) result = option.apply(result);
    }
    return result;
  }, [enabled, text]);

  const invisibleCount = React.useMemo(() => (text.match(INVISIBLE_PATTERN) ?? []).length, [text]);
  const smartQuoteCount = React.useMemo(
    () => (text.match(/[‘-‟–-―… ]/g) ?? []).length,
    [text],
  );

  const toggle = (id: string) => setEnabled((previous) => ({ ...previous, [id]: !previous[id] }));

  return (
    <ToolFrame>
      <div className="space-y-5">
        <TextInput
          id="cleaner-input"
          value={text}
          onChange={setText}
          rows={8}
          label="Messy text"
          placeholder="Paste text copied from a PDF, an email or a web page…"
        />

        <section className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[0.8125rem] font-medium text-fg">Cleaning steps</h2>
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEnabled(Object.fromEntries(OPTIONS.map((o) => [o.id, true])))}
              >
                Select all
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEnabled(Object.fromEntries(OPTIONS.map((o) => [o.id, false])))}
              >
                Select none
              </Button>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {OPTIONS.map((option) => (
              <Checkbox
                key={option.id}
                label={option.label}
                description={option.description}
                checked={enabled[option.id] ?? false}
                onChange={() => toggle(option.id)}
              />
            ))}
          </div>
        </section>

        {text ? (
          <MetricGrid>
            <Metric label="Characters in" value={text.length} />
            <Metric label="Characters out" value={output.length} emphasis />
            <Metric
              label="Invisible found"
              value={invisibleCount}
              hint={invisibleCount > 0 ? "Zero-width or direction marks" : undefined}
            />
            <Metric label="Smart characters found" value={smartQuoteCount} />
          </MetricGrid>
        ) : null}

        <TextOutput
          id="cleaner-output"
          value={output}
          label="Cleaned text"
          rows={8}
          downloadName="cleaned-text.txt"
          meta={
            text && output.length !== text.length
              ? `${formatNumber(text.length - output.length)} characters removed`
              : undefined
          }
          emptyMessage="Paste some text above and switch on the fixes you need."
        />
      </div>
    </ToolFrame>
  );
}
