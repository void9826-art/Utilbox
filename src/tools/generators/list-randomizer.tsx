"use client";

import * as React from "react";
import { Shuffle } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Segmented, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { shuffle } from "@/lib/random";
import { chunkBySize, dealIntoGroups, parseEntries } from "@/lib/teams";

import { NumberField } from "../calculators/_shared";

type Mode = "shuffle" | "pick" | "teams";

export default function ListRandomizer() {
  const [text, setText] = React.useState("Ava\nBen\nChloe\nDev\nElla\nFinn\nGrace\nHugo");
  const [mode, setMode] = React.useState<Mode>("teams");
  const [count, setCount] = React.useState("2");
  const [teamsBy, setTeamsBy] = React.useState<"number" | "size">("number");
  const [dedupe, setDedupe] = React.useState(true);
  const [result, setResult] = React.useState<string[][] | null>(null);
  const [stamp, setStamp] = React.useState<string | null>(null);

  const entries = parseEntries(text, dedupe);
  const n = Math.max(1, Math.floor(Number(count) || 1));

  const run = () => {
    const mixed = shuffle(entries);
    if (mode === "shuffle") setResult([mixed]);
    else if (mode === "pick") setResult([mixed.slice(0, Math.min(n, mixed.length))]);
    else setResult(teamsBy === "number" ? dealIntoGroups(mixed, n) : chunkBySize(mixed, n));
    setStamp(new Date().toLocaleString());
  };

  const asText = result
    ? result.length === 1
      ? result[0].join("\n")
      : result.map((team, index) => `Team ${index + 1}: ${team.join(", ")}`).join("\n")
    : "";

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Field label="Names or items, one per line" htmlFor="list-input" hint={`${entries.length} entries${dedupe ? ", duplicates ignored" : ""}.`}>
          <Textarea id="list-input" rows={8} value={text} onChange={(event) => setText(event.target.value)} />
        </Field>

        <Segmented
          name="list-mode"
          ariaLabel="What to do"
          value={mode}
          onChange={(value) => {
            setMode(value);
            setResult(null);
          }}
          options={[
            { value: "teams", label: "Make teams" },
            { value: "pick", label: "Pick winners" },
            { value: "shuffle", label: "Shuffle" },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "teams" ? (
            <>
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Split by</span>
                <Segmented
                  name="list-teams-by"
                  ariaLabel="Split by"
                  value={teamsBy}
                  onChange={setTeamsBy}
                  options={[
                    { value: "number", label: "Number of teams" },
                    { value: "size", label: "People per team" },
                  ]}
                />
              </div>
              <NumberField id="list-count" label={teamsBy === "number" ? "Teams" : "People per team"} value={count} onChange={setCount} min={1} step={1} inputMode="numeric" />
            </>
          ) : null}
          {mode === "pick" ? (
            <NumberField id="list-count" label="How many to pick" value={count} onChange={setCount} min={1} step={1} inputMode="numeric" />
          ) : null}
          <div className="sm:col-span-2">
            <Checkbox
              label="Ignore duplicate entries"
              description="Each name counts once, ignoring capital letters."
              checked={dedupe}
              onChange={(event) => setDedupe(event.target.checked)}
            />
          </div>
        </div>

        <Button type="button" onClick={run} disabled={entries.length === 0}>
          <Shuffle className="size-4" aria-hidden="true" />
          {mode === "teams" ? "Make teams" : mode === "pick" ? "Pick" : "Shuffle"}
        </Button>

        {mode === "pick" && n > entries.length && entries.length > 0 ? (
          <Alert tone="info">Only {entries.length} entries, so everyone is picked, in random order.</Alert>
        ) : null}

        <div aria-live="polite">
          {result ? (
            <section aria-labelledby="list-result-heading" className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 id="list-result-heading" className="text-[0.8125rem] font-medium text-fg">
                  {mode === "teams" ? `${result.length} teams` : mode === "pick" ? "Picked" : "Shuffled order"}
                  {stamp ? <span className="font-normal text-fg-subtle"> · {stamp}</span> : null}
                </h2>
                <CopyButton value={asText} label="Copy result" />
              </div>
              {result.length === 1 ? (
                <ol className="list-decimal space-y-1 rounded-lg border border-border py-3 pr-3 pl-9 text-sm text-fg">
                  {result[0].map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {result.map((team, index) => (
                    <div key={index} className="rounded-lg border border-border p-3">
                      <p className="text-xs font-semibold tracking-wide text-fg-muted uppercase">
                        Team {index + 1} · {team.length}
                      </p>
                      <ul className="mt-1.5 space-y-0.5 text-sm text-fg">
                        {team.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}
        </div>
      </div>
    </ToolFrame>
  );
}
