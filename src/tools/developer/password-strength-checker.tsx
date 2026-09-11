"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { ProgressIndicator } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Alert, DataRow, Stat, StatGrid } from "@/components/ui/surfaces";
import { cn } from "@/lib/utils";

type ZxcvbnResult = import("@zxcvbn-ts/core").ZxcvbnResult;

interface Checker {
  check: (password: string) => ZxcvbnResult;
}

/** zxcvbn's run time grows with length; beyond this the estimate no longer changes meaningfully. */
const ANALYSED_LENGTH = 100;

const SCORE_LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];

const SCENARIOS: Array<{ key: keyof ZxcvbnResult["crackTimes"]; label: string; detail: string }> = [
  { key: "onlineThrottlingXPerHour", label: "Online attack, rate-limited", detail: "100 guesses an hour" },
  { key: "onlineNoThrottlingXPerSecond", label: "Online attack, no rate limit", detail: "10 guesses a second" },
  { key: "offlineSlowHashingXPerSecond", label: "Stolen database, slow hash", detail: "10,000 guesses a second" },
  { key: "offlineFastHashingXPerSecond", label: "Stolen database, fast hash", detail: "10 billion guesses a second" },
];

function describeMatch(match: ZxcvbnResult["sequence"][number]): string {
  const details = match as { pattern: string; dictionaryName?: string; l33t?: boolean; reversed?: boolean };
  switch (details.pattern) {
    case "dictionary": {
      const source = details.dictionaryName?.startsWith("passwords")
        ? "Common password"
        : /names/.test(details.dictionaryName ?? "")
          ? "Common name"
          : "Dictionary word";
      if (details.l33t) return `${source} with look-alike substitutions`;
      if (details.reversed) return `${source}, reversed`;
      return source;
    }
    case "spatial":
      return "Keyboard pattern";
    case "repeat":
      return "Repeated characters";
    case "sequence":
      return "Sequence such as abc or 123";
    case "regex":
      return "Recent year";
    case "date":
      return "Date";
    case "separator":
      return "Separator";
    case "bruteforce":
      return "Random characters";
    default:
      return "Pattern";
  }
}

function characterClasses(password: string) {
  return [
    { label: "Lower-case letters", present: /[a-z]/.test(password) },
    { label: "Upper-case letters", present: /[A-Z]/.test(password) },
    { label: "Digits", present: /\d/.test(password) },
    { label: "Symbols or spaces", present: /[^A-Za-z0-9]/.test(password) },
  ];
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [checker, setChecker] = React.useState<Checker | null>(null);
  const [loadFailed, setLoadFailed] = React.useState(false);

  // The estimator and its word lists are about a megabyte, so they load on first use.
  React.useEffect(() => {
    if (!password || checker) return;
    let cancelled = false;
    Promise.all([import("@zxcvbn-ts/core"), import("@zxcvbn-ts/language-common"), import("@zxcvbn-ts/language-en")])
      .then(([core, common, english]) => {
        if (cancelled) return;
        const factory = new core.ZxcvbnFactory({
          dictionary: { ...common.dictionary, ...english.dictionary },
          graphs: common.adjacencyGraphs,
          translations: english.translations,
          useLevenshteinDistance: true,
        });
        setChecker({ check: (value) => factory.check(value) });
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [password, checker]);

  const deferred = React.useDeferredValue(password);
  const result = React.useMemo(
    () => (checker && deferred ? checker.check(deferred.slice(0, ANALYSED_LENGTH)) : null),
    [checker, deferred],
  );

  const score = result?.score ?? 0;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="password-input" className="text-[0.8125rem] font-medium text-fg">
            Password to test
          </label>
          <div className="flex gap-2">
            <Input
              id="password-input"
              type={visible ? "text" : "password"}
              value={password}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Type a password"
              onChange={(event) => setPassword(event.target.value)}
              className="font-mono"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-pressed={visible}
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((current) => !current)}
            >
              {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            </Button>
            <Button type="button" variant="ghost" disabled={!password} onClick={() => setPassword("")}>
              Clear
            </Button>
          </div>
          <p className="text-xs text-fg-subtle">Checked on this device. The password is never sent anywhere.</p>
        </div>

        {password && !checker && !loadFailed ? <ProgressIndicator label="Loading the strength estimator…" /> : null}
        {loadFailed ? (
          <Alert tone="danger" title="The estimator could not load">
            Check your connection and reload the page.
          </Alert>
        ) : null}

        {result ? (
          <div className="space-y-4" aria-live="polite">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-lg font-semibold text-fg">{SCORE_LABELS[score]}</p>
                <p className="tabular text-sm text-fg-muted">Score {score} of 4</p>
              </div>
              <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
                {SCORE_LABELS.map((label, index) => (
                  <span
                    key={label}
                    className={cn("h-2 rounded-full", index <= score ? "bg-fg" : "bg-bg-muted")}
                  />
                ))}
              </div>
            </div>

            {result.feedback.warning || result.feedback.suggestions.length > 0 ? (
              <Alert tone={score >= 3 ? "info" : "warning"} title={result.feedback.warning ?? "How to make it stronger"}>
                {result.feedback.suggestions.length > 0 ? (
                  <ul className="list-disc space-y-0.5 pl-4">
                    {result.feedback.suggestions.map((suggestion) => (
                      <li key={suggestion}>{suggestion}</li>
                    ))}
                  </ul>
                ) : null}
              </Alert>
            ) : null}

            <StatGrid className="sm:grid-cols-2 lg:grid-cols-4">
              {SCENARIOS.map((scenario) => (
                <Stat
                  key={scenario.key}
                  label={scenario.label}
                  value={result.crackTimes[scenario.key].display}
                  hint={scenario.detail}
                  emphasis={scenario.key === "offlineSlowHashingXPerSecond"}
                />
              ))}
            </StatGrid>

            <dl className="rounded-lg border border-border bg-surface px-3.5">
              <DataRow label="Estimated guesses needed" value={`about 10^${result.guessesLog10.toFixed(1)}`} />
              <DataRow
                label="Length"
                value={`${[...password].length} characters${[...password].length > ANALYSED_LENGTH ? ` (first ${ANALYSED_LENGTH} analysed)` : ""}`}
              />
              {characterClasses(password).map((entry) => (
                <DataRow key={entry.label} label={entry.label} value={entry.present ? "Yes" : "No"} />
              ))}
            </dl>

            {result.sequence.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[0.8125rem] font-medium text-fg">How an attacker would break it down</p>
                <ol className="space-y-1.5">
                  {result.sequence.map((match, index) => (
                    <li
                      key={`${match.i}-${match.j}-${index}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-sunken px-3 py-2 text-[0.8125rem]"
                    >
                      <span className="font-mono break-all text-fg">{visible ? match.token : "•".repeat([...match.token].length)}</span>
                      <span className="text-fg-muted">{describeMatch(match)}</span>
                    </li>
                  ))}
                </ol>
                {!visible ? <p className="text-xs text-fg-subtle">Show the password to see each part.</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </ToolFrame>
  );
}
