"use client";

import * as React from "react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Field, Segmented, Textarea } from "@/components/ui/field";
import { DEFAULT_SLUG_OPTIONS, slugify, type SlugOptions } from "@/lib/slug";

import { NumberField } from "../calculators/_shared";

export default function SlugGenerator() {
  const [input, setInput] = React.useState("Crème Brûlée: 10 Easy Recipes for Beginners (2026)");
  const [separator, setSeparator] = React.useState<SlugOptions["separator"]>(DEFAULT_SLUG_OPTIONS.separator);
  const [lowercase, setLowercase] = React.useState(true);
  const [removeStopWords, setRemoveStopWords] = React.useState(false);
  const [maxLength, setMaxLength] = React.useState("");

  const slugs = React.useMemo(() => {
    const limit = Number(maxLength);
    const options: SlugOptions = {
      separator,
      lowercase,
      removeStopWords,
      maxLength: Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 0,
    };
    return input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ line, slug: slugify(line, options) }));
  }, [input, lowercase, maxLength, removeStopWords, separator]);

  const all = slugs.map((entry) => entry.slug).join("\n");

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Field label="Titles" htmlFor="slug-input" hint="One title per line to make several slugs at once.">
          <Textarea
            id="slug-input"
            value={input}
            rows={4}
            onChange={(event) => setInput(event.target.value)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Separator</span>
            <Segmented
              name="slug-separator"
              ariaLabel="Separator"
              value={separator}
              onChange={setSeparator}
              options={[
                { value: "-", label: "Hyphen  -" },
                { value: "_", label: "Underscore  _" },
              ]}
            />
          </div>
          <NumberField
            id="slug-max"
            label="Maximum length"
            value={maxLength}
            onChange={setMaxLength}
            placeholder="No limit"
            min={1}
            step={1}
            inputMode="numeric"
            hint="Cut at a whole word."
          />
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Checkbox label="Lower case" checked={lowercase} onChange={(event) => setLowercase(event.target.checked)} />
          <Checkbox
            label="Remove short common words"
            description="the, a, of, and, for… — kept if nothing else is left."
            checked={removeStopWords}
            onChange={(event) => setRemoveStopWords(event.target.checked)}
          />
        </div>

        <section aria-labelledby="slug-results-heading" aria-live="polite" className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h2 id="slug-results-heading" className="text-[0.8125rem] font-medium text-fg">
              Slugs
            </h2>
            {slugs.length > 1 ? <CopyButton value={all} label="Copy all" /> : null}
          </div>
          {slugs.length > 0 ? (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {slugs.map((entry, index) => (
                <li key={index} className="flex items-center gap-2 px-3.5 py-2">
                  <div className="min-w-0 flex-1">
                    <code className="block font-mono text-[0.8125rem] break-all text-fg">{entry.slug || "—"}</code>
                    <span className="block truncate text-xs text-fg-subtle">
                      {entry.slug.length} characters · {entry.line}
                    </span>
                  </div>
                  <CopyButton value={entry.slug} iconOnly label="Copy slug" variant="ghost" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-fg-muted">Type a title to see its slug.</p>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
