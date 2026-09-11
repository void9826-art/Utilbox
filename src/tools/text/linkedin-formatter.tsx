"use client";

import * as React from "react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import {
  applyStyle,
  bulletLines,
  countStyledLetters,
  protectBlankLines,
  type TextStyle,
} from "@/lib/unicode-styles";

import { Metric, MetricGrid } from "./_shared";

const LIMIT = 3000;
/** Roughly where the feed truncates; it varies by device, so the preview says "approximately". */
const PREVIEW_CHARACTERS = 210;
const PREVIEW_LINES = 3;

const STYLES: Array<{ style: TextStyle; label: React.ReactNode; title: string }> = [
  { style: "bold", label: <strong>Bold</strong>, title: "Bold" },
  { style: "italic", label: <em>Italic</em>, title: "Italic" },
  { style: "boldItalic", label: <strong><em>Bold italic</em></strong>, title: "Bold italic" },
  { style: "monospace", label: <span className="font-mono">Mono</span>, title: "Monospace" },
  { style: "underline", label: <span className="underline">Underline</span>, title: "Underline" },
  { style: "strike", label: <span className="line-through">Strike</span>, title: "Strikethrough" },
  { style: "plain", label: "Plain", title: "Remove styling" },
];

const BULLETS = ["•", "→", "✅", "1."];

const SAMPLE = `I almost didn't publish this post.

Three things I learned shipping a product in 30 days:
Talk to users before writing code
Cut scope every single week
Ship something small on day one

What would you add?

#productmanagement #startups`;

function approximateCut(text: string): number {
  let index = -1;
  for (let line = 0; line < PREVIEW_LINES; line += 1) {
    index = text.indexOf("\n", index + 1);
    if (index === -1) break;
  }
  const byLines = index === -1 ? text.length : index;
  if (byLines <= PREVIEW_CHARACTERS) return byLines;
  const space = text.lastIndexOf(" ", PREVIEW_CHARACTERS);
  return space > 120 ? space : PREVIEW_CHARACTERS;
}

export default function LinkedinFormatter() {
  const [text, setText] = React.useState(SAMPLE);
  const [protect, setProtect] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  const editorRef = React.useRef<HTMLTextAreaElement>(null);

  const output = protect ? protectBlankLines(text) : text;
  const characters = [...output].length;
  const units = output.length;
  const styled = countStyledLetters(output);
  const hashtags = (output.match(/#[\p{L}\p{N}_]+/gu) ?? []).length;
  const cut = approximateCut(output);

  /** Replaces the selected range and keeps it selected so styles can be switched. */
  const replaceSelection = (transform: (selected: string) => string, wholeLines = false) => {
    const editor = editorRef.current;
    if (!editor) return;
    let start = editor.selectionStart;
    let end = editor.selectionEnd;
    if (wholeLines) {
      start = text.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = text.indexOf("\n", end > start && text[end - 1] === "\n" ? end - 1 : end);
      end = lineEnd === -1 ? text.length : lineEnd;
    } else if (start === end) {
      setNotice("Select some text in the post first, then choose a style.");
      return;
    }
    const replacement = transform(text.slice(start, end));
    setText(text.slice(0, start) + replacement + text.slice(end));
    setNotice(null);
    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(start, start + replacement.length);
    });
  };

  return (
    <ToolFrame>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Style the selected text</span>
            <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Text styles">
              {STYLES.map((option) => (
                <Button
                  key={option.style}
                  type="button"
                  variant="secondary"
                  size="sm"
                  title={option.title}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => replaceSelection((selected) => applyStyle(selected, option.style))}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Turn selected lines into a list</span>
            <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Bullet styles">
              {BULLETS.map((marker) => (
                <Button
                  key={marker}
                  type="button"
                  variant="secondary"
                  size="sm"
                  aria-label={marker === "1." ? "Numbered list" : `Bullets with ${marker}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => replaceSelection((selected) => bulletLines(selected, marker), true)}
                >
                  {marker === "1." ? "1. 2. 3." : `${marker} List`}
                </Button>
              ))}
            </div>
          </div>

          {notice ? (
            <p role="status" className="text-[0.8125rem] font-medium text-fg">
              {notice}
            </p>
          ) : null}

          <div className="space-y-1.5">
            <label htmlFor="linkedin-editor" className="text-[0.8125rem] font-medium text-fg">
              Your post
            </label>
            <Textarea
              ref={editorRef}
              id="linkedin-editor"
              rows={14}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>

          <Checkbox
            label="Protect blank lines"
            description="Puts an invisible character on empty lines, for apps that collapse them."
            checked={protect}
            onChange={(event) => setProtect(event.target.checked)}
          />

          <MetricGrid>
            <Metric label="Characters" value={characters} emphasis />
            <Metric label="Text units" value={units} hint="Styled letters use two" />
            <Metric label="Styled letters" value={styled} />
            <Metric label="Hashtags" value={hashtags} />
          </MetricGrid>

          {Math.max(characters, units) > LIMIT ? (
            <Alert tone="danger" title="Too long for a LinkedIn post">
              Posts are limited to {LIMIT.toLocaleString()} characters. Trim until both counts are under the limit.
            </Alert>
          ) : null}
          {styled > 60 ? (
            <Alert tone="warning" title="A lot of styled text">
              Screen readers may read styled letters one by one, and they do not match searches. Keep styling to a few
              words.
            </Alert>
          ) : null}

          <CopyButton value={output} label="Copy post" size="md" variant="primary" />
        </div>

        <div className="min-w-0 space-y-2">
          <p className="text-[0.8125rem] font-medium text-fg">Feed preview (approximate)</p>
          <article className="rounded-lg border border-border bg-surface p-4 shadow-subtle">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-full bg-bg-muted text-sm font-semibold text-fg-muted" aria-hidden="true">
                You
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">Your Name</p>
                <p className="text-xs text-fg-subtle">Your headline · 1h</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-fg">
              {expanded || cut >= output.length ? output : output.slice(0, cut)}
              {!expanded && cut < output.length ? (
                <>
                  {"… "}
                  <button type="button" className="font-semibold text-fg-muted hover:underline" onClick={() => setExpanded(true)}>
                    see more
                  </button>
                </>
              ) : null}
            </p>
            {expanded ? (
              <button type="button" className="mt-2 text-xs font-semibold text-fg-muted hover:underline" onClick={() => setExpanded(false)}>
                Show less
              </button>
            ) : null}
          </article>
          <p className="text-xs text-fg-subtle">
            The feed shows roughly the first {PREVIEW_LINES} lines or {PREVIEW_CHARACTERS} characters before “see more”;
            the exact cut differs between the app and the website.
          </p>
        </div>
      </div>
    </ToolFrame>
  );
}
