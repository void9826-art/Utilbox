"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Field, Input } from "@/components/ui/field";
import { Alert, Card } from "@/components/ui/surfaces";
import { describeCron, explainFields, nextRuns, parseCron } from "@/lib/cron";

const EXAMPLES = [
  { expression: "*/15 * * * *", label: "Every 15 minutes" },
  { expression: "0 9 * * 1-5", label: "Weekdays at 9:00" },
  { expression: "0 0 * * 0", label: "Sundays at midnight" },
  { expression: "30 2 1 * *", label: "Monthly, 1st at 2:30" },
  { expression: "0 */6 * * *", label: "Every 6 hours" },
  { expression: "@daily", label: "@daily" },
];

const RUN_COUNT = 10;

export default function CronExpressionExplainer() {
  const [expression, setExpression] = React.useState("0 9 * * 1-5");
  // The visitor's clock and time zone are not knowable on the server, so the
  // run list is filled in after mount to keep server and client HTML equal.
  const [clock, setClock] = React.useState<{ now: Date; timeZone: string } | null>(null);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the current time and time zone differ between the server render and the client
    setClock({ now: new Date(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  }, []);

  const result = React.useMemo(() => {
    const parsed = parseCron(expression);
    if (!parsed.ok) return parsed;
    return {
      ok: true as const,
      description: describeCron(parsed.cron),
      fields: explainFields(parsed.cron),
      runs: clock ? nextRuns(parsed.cron, clock.now, RUN_COUNT) : null,
    };
  }, [clock, expression]);

  const format = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Field
          label="Cron expression"
          htmlFor="cron-input"
          hint="Five fields: minute, hour, day of month, month, day of week."
        >
          <Input
            id="cron-input"
            value={expression}
            spellCheck={false}
            autoComplete="off"
            onChange={(event) => setExpression(event.target.value)}
            className="font-mono text-base"
          />
        </Field>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Example expressions">
          {EXAMPLES.map((example) => (
            <button
              key={example.expression}
              type="button"
              onClick={() => setExpression(example.expression)}
              aria-pressed={expression === example.expression}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-accent-soft-border hover:text-fg aria-pressed:border-accent-soft-border aria-pressed:bg-accent-soft aria-pressed:text-accent-text"
            >
              {example.label}
            </button>
          ))}
        </div>

        {!result.ok ? (
          <Alert tone="danger" title="This expression is not valid standard cron">
            {result.message}
          </Alert>
        ) : (
          <div className="space-y-5">
            <Card className="border-accent-soft-border bg-accent-soft px-4 py-4 sm:px-5" aria-live="polite">
              <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">Runs</p>
              <p className="mt-1 text-lg font-semibold text-fg sm:text-xl">{result.description}</p>
            </Card>

            <div
              className="scrollbar-slim overflow-x-auto rounded-lg border border-border"
              role="region"
              aria-label="Field by field"
              tabIndex={0}
            >
              <table className="w-full border-collapse text-[0.8125rem]">
                <caption className="sr-only">What each field of the expression means</caption>
                <thead className="bg-surface-sunken">
                  <tr>
                    <th scope="col" className="border-b border-border px-3 py-2 text-left font-semibold text-fg">
                      Field
                    </th>
                    <th scope="col" className="border-b border-border px-3 py-2 text-left font-semibold text-fg">
                      Value
                    </th>
                    <th scope="col" className="border-b border-border px-3 py-2 text-left font-semibold text-fg">
                      Means
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.fields.map((field) => (
                    <tr key={field.field} className="even:bg-bg-muted/60">
                      <th scope="row" className="px-3 py-1.5 text-left font-medium whitespace-nowrap text-fg">
                        {field.field}
                      </th>
                      <td className="px-3 py-1.5 font-mono text-fg">{field.source}</td>
                      <td className="px-3 py-1.5 text-fg-muted">{field.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <section aria-labelledby="cron-runs-heading" className="space-y-2">
              <h2 id="cron-runs-heading" className="text-[0.8125rem] font-medium text-fg">
                Next {RUN_COUNT} runs{" "}
                {clock ? (
                  <span className="font-normal text-fg-subtle">in your time zone ({clock.timeZone})</span>
                ) : null}
              </h2>
              {result.runs === null ? null : result.runs.length > 0 ? (
                <ol className="divide-y divide-border rounded-lg border border-border">
                  {result.runs.map((run) => (
                    <li key={run.getTime()} className="tabular px-3.5 py-1.5 text-[0.8125rem] text-fg-muted">
                      {format.format(run)}
                    </li>
                  ))}
                </ol>
              ) : (
                <Alert tone="warning" title="This schedule never runs">
                  No date in the next five years matches — for example, 31 February.
                </Alert>
              )}
              <p className="text-xs text-fg-subtle">
                Servers run cron in their own time zone, often UTC. If yours does, shift these times by your offset
                from UTC.
              </p>
            </section>
          </div>
        )}
      </div>
    </ToolFrame>
  );
}
