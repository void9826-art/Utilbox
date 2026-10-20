"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import type { FindReplaceResult } from "@/lib/regex";
import { formatNumber } from "@/lib/utils";

import { REGEX_TIME_LIMIT_MS, useRegexWorker } from "../developer/_regex-runner";
import { TextInput, TextOutput } from "./_shared";

type ReplaceAnswer = { result: FindReplaceResult };

export default function FindAndReplace() {
  const [text, setText] = React.useState("");
  const [find, setFind] = React.useState("");
  const [replacement, setReplacement] = React.useState("");
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [wholeWord, setWholeWord] = React.useState(false);
  const [useRegex, setUseRegex] = React.useState(false);
  const [multiline, setMultiline] = React.useState(true);

  const state = useRegexWorker<ReplaceAnswer>(
    text && find
      ? { kind: "replace", find, replacement, text, options: { caseSensitive, wholeWord, useRegex, multiline } }
      : null,
  );
  const result = state.status === "done" ? state.data.result : null;
  const output = !find ? text : result?.ok ? result.output : "";

  return (
    <ToolFrame>
      <div className="space-y-5">
        <TextInput id="replace-input" label="Your text" value={text} onChange={setText} rows={8} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Find" htmlFor="replace-find">
            <Input
              id="replace-find"
              value={find}
              spellCheck={false}
              autoComplete="off"
              onChange={(event) => setFind(event.target.value)}
              className={useRegex ? "font-mono" : undefined}
            />
          </Field>
          <Field
            label="Replace with"
            htmlFor="replace-with"
            hint={useRegex ? "$1, $2… insert groups; $& the whole match." : "Leave empty to delete every match."}
          >
            <Input
              id="replace-with"
              value={replacement}
              spellCheck={false}
              autoComplete="off"
              onChange={(event) => setReplacement(event.target.value)}
              className={useRegex ? "font-mono" : undefined}
            />
          </Field>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Checkbox
            label="Match case"
            description="“Apple” does not match “apple”."
            checked={caseSensitive}
            onChange={(event) => setCaseSensitive(event.target.checked)}
          />
          <Checkbox
            label="Whole words only"
            description="“cat” will not match inside “concat”."
            checked={wholeWord}
            onChange={(event) => setWholeWord(event.target.checked)}
          />
          <Checkbox
            label="Use regular expressions"
            description="JavaScript syntax, such as \d+ or ^\s+."
            checked={useRegex}
            onChange={(event) => setUseRegex(event.target.checked)}
          />
          <Checkbox
            label="^ and $ match each line"
            description="Only applies to regular expressions."
            checked={multiline}
            disabled={!useRegex}
            onChange={(event) => setMultiline(event.target.checked)}
          />
        </div>

        <div aria-live="polite" className="space-y-3">
          {state.status === "timeout" ? (
            <Alert tone="danger" title="The search took too long and was stopped">
              It ran for more than {REGEX_TIME_LIMIT_MS / 1000} seconds. Simplify the regular expression — nested
              repeats such as (a+)+ can take exponentially long.
            </Alert>
          ) : null}
          {result && !result.ok ? (
            <Alert tone="danger" title="Invalid regular expression">
              {result.message}
            </Alert>
          ) : null}
          {find && result?.ok ? (
            <p className="text-sm text-fg">
              {result.count === 0
                ? "No matches — the text is unchanged."
                : `${formatNumber(result.count)} replacement${result.count === 1 ? "" : "s"} made.`}
            </p>
          ) : null}
        </div>

        <TextOutput
          id="replace-output"
          label="Result"
          value={output}
          rows={8}
          downloadName="replaced.txt"
          emptyMessage="Paste text and enter what to find."
        />
      </div>
    </ToolFrame>
  );
}
