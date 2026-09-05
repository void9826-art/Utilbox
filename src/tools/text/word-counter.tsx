"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Input } from "@/components/ui/field";
import { formatNumber } from "@/lib/utils";

import {
  Metric,
  MetricGrid,
  READING_WORDS_PER_MINUTE,
  SPEAKING_WORDS_PER_MINUTE,
  TextInput,
  analyseText,
  formatDuration,
} from "./_shared";

/** Words excluded from the density list — they say nothing about the subject. */
const STOP_WORDS = new Set(
  "a an the and or but if then than that this these those of to in on at by for with from as is are was were be been being it its it's i you he she they we them his her their our your my me not no do does did have has had will would can could should about into over after before".split(
    " ",
  ),
);

export default function WordCounter() {
  const [text, setText] = React.useState("");
  const [target, setTarget] = React.useState("");

  const stats = React.useMemo(() => analyseText(text), [text]);

  const keywords = React.useMemo(() => {
    if (!text.trim()) return [];

    const counts = new Map<string, number>();
    for (const raw of text.toLowerCase().split(/\s+/)) {
      const word = raw.replace(/[^\p{L}\p{N}'-]/gu, "");
      if (word.length < 3 || STOP_WORDS.has(word)) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        count,
        density: stats.words > 0 ? (count / stats.words) * 100 : 0,
      }));
  }, [stats.words, text]);

  const targetValue = Number(target);
  const hasTarget = target.trim() !== "" && Number.isFinite(targetValue) && targetValue > 0;
  const progress = hasTarget ? Math.min(100, (stats.words / targetValue) * 100) : 0;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <TextInput
          id="word-counter-input"
          value={text}
          onChange={setText}
          rows={12}
          placeholder="Paste your essay, article or draft here. The counts update as you type."
        />

        <MetricGrid>
          <Metric label="Words" value={stats.words} emphasis />
          <Metric label="Characters" value={stats.characters} />
          <Metric label="Characters (no spaces)" value={stats.charactersNoSpaces} />
          <Metric label="Sentences" value={stats.sentences} />
          <Metric label="Paragraphs" value={stats.paragraphs} />
          <Metric label="Lines" value={stats.lines} />
          <Metric
            label="Reading time"
            value={stats.words === 0 ? "—" : formatDuration(stats.words / READING_WORDS_PER_MINUTE)}
            hint={`${READING_WORDS_PER_MINUTE} wpm`}
          />
          <Metric
            label="Speaking time"
            value={stats.words === 0 ? "—" : formatDuration(stats.words / SPEAKING_WORDS_PER_MINUTE)}
            hint={`${SPEAKING_WORDS_PER_MINUTE} wpm`}
          />
        </MetricGrid>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="space-y-2">
            <label htmlFor="word-counter-target" className="text-[0.8125rem] font-medium text-fg">
              Target word count
            </label>
            <Input
              id="word-counter-target"
              type="number"
              min={1}
              inputMode="numeric"
              value={target}
              placeholder="e.g. 1500"
              onChange={(event) => setTarget(event.target.value)}
              className="tabular max-w-40"
            />
            {hasTarget ? (
              <div className="space-y-1.5 pt-1">
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progress toward the target word count"
                >
                  <div
                    className={progress >= 100 ? "h-full bg-fg" : "h-full bg-fg-subtle"}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[0.8125rem] text-fg-muted" aria-live="polite">
                  {stats.words >= targetValue
                    ? `Target reached — ${formatNumber(stats.words - targetValue)} words over.`
                    : `${formatNumber(targetValue - stats.words)} words to go (${progress.toFixed(0)}%).`}
                </p>
              </div>
            ) : (
              <p className="text-xs text-fg-subtle">
                Set a target and a progress bar appears here.
              </p>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="text-[0.8125rem] font-medium text-fg">Most used words</h2>
            {keywords.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-fg-subtle">
                Common filler words are ignored, so this fills in once there is some text.
              </p>
            ) : (
              <ul className="space-y-1">
                {keywords.map((entry) => (
                  <li key={entry.word} className="flex items-center gap-2 text-[0.8125rem]">
                    <span className="w-28 shrink-0 truncate font-medium text-fg">{entry.word}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                      <span
                        className="block h-full rounded-full bg-accent"
                        style={{ width: `${(entry.count / keywords[0].count) * 100}%` }}
                      />
                    </span>
                    <span className="tabular w-16 shrink-0 text-right text-xs text-fg-muted">
                      {entry.count} · {entry.density.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {stats.words > 0 ? (
          <p className="text-xs text-fg-subtle">
            Longest word: <strong className="font-medium text-fg-muted">{stats.longestWord}</strong> ·
            Average word length: {stats.averageWordLength.toFixed(1)} characters · Unique words:{" "}
            {formatNumber(stats.uniqueWords)}
          </p>
        ) : null}
      </div>
    </ToolFrame>
  );
}
