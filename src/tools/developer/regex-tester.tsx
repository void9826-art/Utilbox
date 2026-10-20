"use client";

import * as React from "react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import type { RegexMatch } from "@/lib/regex";
import { formatNumber } from "@/lib/utils";

import { REGEX_TIME_LIMIT_MS, useRegexWorker } from "./_regex-runner";

const FLAG_OPTIONS = [
  { flag: "g", label: "g — global", description: "Find every match, not just the first." },
  { flag: "i", label: "i — ignore case", description: "A matches a." },
  { flag: "m", label: "m — multiline", description: "^ and $ match at each line." },
  { flag: "s", label: "s — dotAll", description: "The dot also matches line breaks." },
  { flag: "u", label: "u — unicode", description: "Full Unicode, \\p{…} classes." },
  { flag: "y", label: "y — sticky", description: "Match only at lastIndex." },
];

const CHEATSHEET: Array<[string, string]> = [
  ["\\d \\w \\s", "digit, word character, whitespace"],
  ["\\D \\W \\S", "not a digit, word character, whitespace"],
  [".", "any character except a line break"],
  ["[abc] [^abc] [a-z]", "one of, none of, a range"],
  ["^ $", "start, end of text (or line with m)"],
  ["\\b", "word boundary"],
  ["* + ?", "0 or more, 1 or more, 0 or 1"],
  ["{3} {2,5}", "exactly 3, between 2 and 5"],
  ["*? +?", "lazy: as few as possible"],
  ["(…) (?:…)", "capture group, non-capturing group"],
  ["(?<name>…)", "named group"],
  ["a|b", "a or b"],
  ["(?=…) (?!…)", "followed by, not followed by"],
  ["(?<=…) (?<!…)", "preceded by, not preceded by"],
];

type TestResult = { error?: string; matches?: RegexMatch[]; truncated?: boolean; replaced?: string | null };

function Highlighted({ text, matches }: { text: string; matches: RegexMatch[] }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((match, index) => {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index));
    parts.push(
      match.text === "" ? (
        <span key={index} className="inline-block h-4 w-px translate-y-0.5 bg-accent" aria-hidden="true" />
      ) : (
        <mark key={index} className="rounded-sm bg-accent-soft px-0.5 text-fg ring-1 ring-accent-soft-border">
          {match.text}
        </mark>
      ),
    );
    cursor = Math.max(cursor, match.end);
  });
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

export default function RegexTester() {
  const [pattern, setPattern] = React.useState("(\\d{4})-(\\d{2})-(\\d{2})");
  const [flags, setFlags] = React.useState("g");
  const [text, setText] = React.useState("Invoices dated 2026-10-20 and 2026-11-03 are due.\nRef 1999-12-31 is old.");
  const [replacement, setReplacement] = React.useState("$3/$2/$1");
  const [useReplace, setUseReplace] = React.useState(false);

  const toggleFlag = (flag: string, on: boolean) =>
    setFlags((current) => {
      const set = new Set(current);
      if (on) set.add(flag);
      else set.delete(flag);
      return FLAG_OPTIONS.map((option) => option.flag).filter((f) => set.has(f)).join("");
    });

  const state = useRegexWorker<TestResult>(
    pattern ? { kind: "test", pattern, flags, text, replacement: useReplace ? replacement : null } : null,
  );
  const result = state.status === "done" ? state.data : null;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Field label="Regular expression" htmlFor="regex-pattern" hint="JavaScript syntax. Type the pattern without the surrounding slashes.">
          <div className="flex h-10 items-center gap-1 rounded-lg border border-border-strong bg-surface pr-3 font-mono focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
            <span className="pl-3 text-fg-subtle" aria-hidden="true">
              /
            </span>
            <input
              id="regex-pattern"
              value={pattern}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              onChange={(event) => setPattern(event.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent px-1 font-mono text-sm text-fg outline-none"
            />
            <span className="text-fg-subtle" aria-hidden="true">
              /{flags}
            </span>
          </div>
        </Field>

        <fieldset className="space-y-2">
          <legend className="text-[0.8125rem] font-medium text-fg">Flags</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {FLAG_OPTIONS.map((option) => (
              <Checkbox
                key={option.flag}
                label={option.label}
                description={option.description}
                checked={flags.includes(option.flag)}
                onChange={(event) => toggleFlag(option.flag, event.target.checked)}
              />
            ))}
          </div>
        </fieldset>

        <Field label="Test text" htmlFor="regex-text">
          <Textarea
            id="regex-text"
            value={text}
            rows={6}
            spellCheck={false}
            onChange={(event) => setText(event.target.value)}
            className="font-mono text-[0.8125rem]"
          />
        </Field>

        <div className="space-y-2.5">
          <Checkbox
            label="Test a replacement"
            description="Use $1, $2 or $<name> for groups and $& for the whole match."
            checked={useReplace}
            onChange={(event) => setUseReplace(event.target.checked)}
          />
          {useReplace ? (
            <Field label="Replace with" htmlFor="regex-replacement">
              <Input
                id="regex-replacement"
                value={replacement}
                spellCheck={false}
                autoComplete="off"
                onChange={(event) => setReplacement(event.target.value)}
                className="font-mono"
              />
            </Field>
          ) : null}
        </div>

        <div aria-live="polite" className="space-y-4">
          {state.status === "timeout" ? (
            <Alert tone="danger" title="This pattern took too long and was stopped">
              It ran for more than {REGEX_TIME_LIMIT_MS / 1000} seconds, which usually means catastrophic backtracking —
              nested quantifiers such as (a+)+ or (.*)* that can match the same text in exponentially many ways. Make the
              inner part more specific, or use a lazy or bounded quantifier.
            </Alert>
          ) : null}
          {result?.error ? (
            <Alert tone="danger" title="Invalid regular expression">
              {result.error}
            </Alert>
          ) : null}

          {result?.matches ? (
            <>
              <StatGrid className="sm:grid-cols-3">
                <Stat
                  label="Matches"
                  value={`${formatNumber(result.matches.length)}${result.truncated ? "+" : ""}`}
                  emphasis
                />
                <Stat label="Groups per match" value={formatNumber(result.matches[0]?.groups.length ?? 0)} />
                <Stat label="Mode" value={flags.includes("g") ? "All matches" : "First match only"} />
              </StatGrid>

              <section aria-labelledby="regex-highlight-heading" className="space-y-1.5">
                <h2 id="regex-highlight-heading" className="text-[0.8125rem] font-medium text-fg">
                  Matches highlighted
                </h2>
                <div className="scrollbar-slim max-h-72 overflow-auto rounded-lg border border-border bg-surface-sunken p-3 font-mono text-[0.8125rem] break-words whitespace-pre-wrap text-fg-muted">
                  <Highlighted text={text} matches={result.matches} />
                </div>
              </section>

              {result.matches.length > 0 ? (
                <div className="scrollbar-slim max-h-80 overflow-auto rounded-lg border border-border" role="region" aria-label="Match details" tabIndex={0}>
                  <table className="w-full border-collapse text-[0.8125rem]">
                    <caption className="sr-only">Each match with its position and capture groups</caption>
                    <thead className="sticky top-0 bg-surface-sunken">
                      <tr>
                        <th scope="col" className="border-b border-border px-3 py-2 text-left font-semibold text-fg">#</th>
                        <th scope="col" className="border-b border-border px-3 py-2 text-left font-semibold text-fg">Match</th>
                        <th scope="col" className="border-b border-border px-3 py-2 text-left font-semibold text-fg">Position</th>
                        <th scope="col" className="border-b border-border px-3 py-2 text-left font-semibold text-fg">Groups</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.matches.slice(0, 200).map((match, index) => (
                        <tr key={index} className="align-top even:bg-bg-muted/60">
                          <td className="px-3 py-1.5 text-fg-subtle">{index + 1}</td>
                          <td className="px-3 py-1.5 font-mono break-all text-fg">{match.text || "(empty)"}</td>
                          <td className="tabular px-3 py-1.5 whitespace-nowrap text-fg-muted">
                            {match.index}–{match.end}
                          </td>
                          <td className="px-3 py-1.5 font-mono break-all text-fg-muted">
                            {match.groups.length === 0
                              ? "—"
                              : match.groups.map((group, groupIndex) => (
                                  <div key={groupIndex}>
                                    ${groupIndex + 1}: {group === undefined ? <em>not matched</em> : `“${group}”`}
                                  </div>
                                ))}
                            {Object.entries(match.named).map(([name, value]) => (
                              <div key={name} className="text-fg">
                                &lt;{name}&gt;: {value === undefined ? <em>not matched</em> : `“${value}”`}
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-fg-muted">No matches.</p>
              )}

              {result.replaced !== null && result.replaced !== undefined ? (
                <section aria-labelledby="regex-replace-heading" className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 id="regex-replace-heading" className="text-[0.8125rem] font-medium text-fg">
                      After replacement
                    </h2>
                    <CopyButton value={result.replaced} />
                  </div>
                  <pre className="scrollbar-slim max-h-72 overflow-auto rounded-lg border border-border bg-surface-sunken p-3 font-mono text-[0.8125rem] break-words whitespace-pre-wrap text-fg">
                    {result.replaced}
                  </pre>
                </section>
              ) : null}
            </>
          ) : null}
        </div>

        <details className="rounded-lg border border-border bg-surface-sunken">
          <summary className="cursor-pointer px-3.5 py-2.5 text-[0.8125rem] font-medium text-fg">Quick reference</summary>
          <dl className="grid gap-x-4 gap-y-1.5 px-3.5 pb-3.5 text-[0.8125rem] sm:grid-cols-[auto_1fr]">
            {CHEATSHEET.map(([syntax, meaning]) => (
              <React.Fragment key={syntax}>
                <dt className="font-mono text-fg">{syntax}</dt>
                <dd className="mb-1 text-fg-muted sm:mb-0">{meaning}</dd>
              </React.Fragment>
            ))}
          </dl>
        </details>
      </div>
    </ToolFrame>
  );
}
