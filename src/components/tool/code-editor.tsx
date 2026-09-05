"use client";

import * as React from "react";
import { Upload } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { Button } from "@/components/ui/button";
import { downloadText } from "@/lib/download";
import { cn, formatBytes } from "@/lib/utils";

/**
 * A code pane with a line-number gutter.
 *
 * The editable surface is a plain textarea rather than a contenteditable
 * element: it keeps native undo, spellcheck control, mobile keyboards and
 * screen-reader behaviour intact, which a custom editor tends to break.
 */

export interface CodeEditorProps {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  rows?: number;
  /** 1-based line to highlight, used to point at a syntax error. */
  errorLine?: number | null;
  actions?: React.ReactNode;
  downloadName?: string;
  accept?: string;
  showStats?: boolean;
  className?: string;
}

export function CodeEditor({
  id,
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  rows = 16,
  errorLine = null,
  actions,
  downloadName,
  accept = ".txt,.json,.csv,.html,.css,.js,.xml,.yml,.yaml",
  showStats = true,
  className,
}: CodeEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const gutterRef = React.useRef<HTMLDivElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const lineCount = React.useMemo(() => (value ? value.split("\n").length : 1), [value]);

  // The gutter is a separate scroll container, so it has to follow the textarea.
  const syncScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  React.useEffect(() => {
    if (errorLine === null || !textareaRef.current) return;
    // Scroll the failing line roughly into the middle of the pane.
    const lineHeight = 21;
    textareaRef.current.scrollTop = Math.max(0, (errorLine - 5) * lineHeight);
    syncScroll();
  }, [errorLine]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-[0.8125rem] font-medium text-fg">
          {label}
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          {showStats && value ? (
            <span className="tabular mr-1 text-xs text-fg-subtle">
              {lineCount} line{lineCount === 1 ? "" : "s"} · {formatBytes(new Blob([value]).size)}
            </span>
          ) : null}
          {actions}
          {!readOnly ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Load file</span>
            </Button>
          ) : null}
          <CopyButton value={value} iconOnly />
          {downloadName ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!value}
              onClick={() => downloadText(value, downloadName)}
            >
              Download
            </Button>
          ) : null}
          {!readOnly && onChange ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!value}
              onClick={() => onChange("")}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "flex overflow-hidden rounded-lg border bg-surface-sunken transition-colors",
          errorLine !== null ? "border-danger" : "border-border focus-within:border-accent",
        )}
      >
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="scrollbar-slim shrink-0 overflow-hidden border-r border-border bg-surface px-2 py-3 text-right select-none"
          style={{ scrollbarWidth: "none" }}
        >
          {Array.from({ length: lineCount }, (_, index) => (
            <div
              key={index}
              className={cn(
                "tabular font-mono text-[0.75rem] leading-[21px]",
                errorLine === index + 1 ? "font-bold text-danger" : "text-fg-subtle",
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          rows={rows}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          onScroll={syncScroll}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={(event) => {
            // Tab inserts an indent rather than leaving the field, but Escape
            // then Tab still lets keyboard users move on.
            if (event.key === "Tab" && !event.shiftKey && !readOnly) {
              event.preventDefault();
              const target = event.currentTarget;
              const start = target.selectionStart;
              const end = target.selectionEnd;
              const next = `${value.slice(0, start)}  ${value.slice(end)}`;
              onChange?.(next);
              requestAnimationFrame(() => target.setSelectionRange(start + 2, start + 2));
            }
          }}
          className="scrollbar-slim min-h-0 w-full resize-y bg-transparent px-3 py-3 font-mono text-[0.8125rem] leading-[21px] text-fg outline-none placeholder:text-fg-subtle"
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-label="Load a file into the editor"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file || !onChange) return;
          onChange(await file.text());
        }}
      />
    </div>
  );
}

/** Points at the exact line and column a parser failed on. */
export function SyntaxErrorPanel({
  message,
  line,
  column,
  source,
}: {
  message: string;
  line: number | null;
  column: number | null;
  source: string;
}) {
  const contextLine = line !== null ? (source.split("\n")[line - 1] ?? "") : null;

  return (
    <div role="alert" className="rounded-lg border border-danger/40 bg-danger-soft p-3.5">
      <p className="text-sm font-semibold text-fg">
        {line !== null ? `Error on line ${line}${column !== null ? `, column ${column}` : ""}` : "Invalid input"}
      </p>
      <p className="mt-0.5 text-sm text-fg-muted">{message}</p>

      {contextLine !== null ? (
        <div className="scrollbar-slim mt-2.5 overflow-x-auto rounded border border-border bg-surface px-3 py-2">
          <pre className="font-mono text-[0.75rem] leading-relaxed text-fg">
            <code>
              {contextLine || "(empty line)"}
              {column !== null ? `\n${" ".repeat(Math.max(0, column - 1))}^` : ""}
            </code>
          </pre>
        </div>
      ) : null}
    </div>
  );
}
