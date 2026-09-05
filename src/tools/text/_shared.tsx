"use client";

import * as React from "react";
import { Upload } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { downloadText } from "@/lib/download";
import { cn, formatNumber } from "@/lib/utils";

/** Input textarea with a file-load option and a live character count. */
export function TextInput({
  id,
  value,
  onChange,
  label = "Your text",
  placeholder = "Type or paste your text here…",
  rows = 10,
  actions,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  actions?: React.ReactNode;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-[0.8125rem] font-medium text-fg">
          {label}
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          {actions}
          <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" aria-hidden="true" />
            Load a file
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={value.length === 0}
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        </div>
      </div>

      <Textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
        className="font-mono text-[0.8125rem]"
      />

      <input
        ref={fileRef}
        type="file"
        accept=".txt,.md,.csv,.json,.log,text/plain"
        className="sr-only"
        tabIndex={-1}
        aria-label="Load a text file"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          onChange(await file.text());
        }}
      />
    </div>
  );
}

/** Read-only result pane with copy and download actions. */
export function TextOutput({
  id,
  value,
  label = "Result",
  rows = 10,
  downloadName = "output.txt",
  meta,
  actions,
  emptyMessage = "The result will appear here.",
}: {
  id: string;
  value: string;
  label?: string;
  rows?: number;
  downloadName?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  emptyMessage?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-[0.8125rem] font-medium text-fg">
          {label}
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          {meta ? <span className="tabular mr-1 text-xs text-fg-subtle">{meta}</span> : null}
          {actions}
          <CopyButton value={value} />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={value.length === 0}
            onClick={() => downloadText(value, downloadName)}
          >
            Download
          </Button>
        </div>
      </div>

      {value.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-fg-muted">
          {emptyMessage}
        </div>
      ) : (
        <Textarea
          id={id}
          value={value}
          rows={rows}
          readOnly
          spellCheck={false}
          className="scrollbar-slim bg-surface-sunken font-mono text-[0.8125rem]"
        />
      )}
    </div>
  );
}

/** Compact metric tile used across the text tools. */
export function Metric({
  label,
  value,
  hint,
  emphasis,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        emphasis ? "border-accent-soft-border bg-accent-soft" : "border-border bg-surface",
      )}
    >
      <dt className="text-[0.6875rem] font-medium tracking-wide text-fg-muted uppercase">{label}</dt>
      <dd
        className={cn(
          "tabular mt-0.5 font-semibold",
          emphasis ? "text-2xl text-accent-text" : "text-xl text-fg",
        )}
      >
        {typeof value === "number" ? formatNumber(value) : value}
      </dd>
      {hint ? <p className="mt-0.5 text-[0.6875rem] text-fg-subtle">{hint}</p> : null}
    </div>
  );
}

export function MetricGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <dl className={cn("grid grid-cols-2 gap-2.5 sm:grid-cols-4", className)}>{children}</dl>;
}

/* -------------------------------------------------------------------------- */
/* Text analysis shared by the counters                                        */
/* -------------------------------------------------------------------------- */

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  graphemes: number;
  bytes: number;
  words: number;
  uniqueWords: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  longestWord: string;
  averageWordLength: number;
}

const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

/** Counts what a reader perceives as one character, not UTF-16 code units. */
export function countGraphemes(text: string): number {
  if (!text) return 0;
  // Intl.Segmenter yields one entry per grapheme; only the count is needed.
  if (segmenter) return [...segmenter.segment(text)].length;
  return [...text].length;
}

export function splitGraphemes(text: string): string[] {
  if (segmenter) return [...segmenter.segment(text)].map((entry) => entry.segment);
  return [...text];
}

export function analyseText(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/) : [];

  // A sentence ends at . ! ? — approximate, since abbreviations also end in a dot.
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? []).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((block) => block.trim()).length : 0;

  const unique = new Set(words.map((word) => word.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "")));
  unique.delete("");

  const longestWord = words.reduce((longest, word) => (word.length > longest.length ? word : longest), "");
  const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    graphemes: countGraphemes(text),
    bytes: new TextEncoder().encode(text).length,
    words: words.length,
    uniqueWords: unique.size,
    sentences,
    paragraphs,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    longestWord,
    averageWordLength: words.length > 0 ? totalWordLength / words.length : 0,
  };
}

/** Adult silent reading of non-technical prose, from reading-rate research. */
export const READING_WORDS_PER_MINUTE = 238;
export const SPEAKING_WORDS_PER_MINUTE = 130;

export function formatDuration(minutes: number): string {
  if (minutes < 1) {
    const seconds = Math.max(1, Math.round(minutes * 60));
    return `${seconds} sec`;
  }
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}
