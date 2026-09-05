"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, NumberField, ResultCard, Working, parseNumber } from "./_shared";

interface Semester {
  id: string;
  label: string;
  gpa: string;
  credits: string;
}

let sequence = 0;
function newSemester(index: number): Semester {
  sequence += 1;
  return { id: `sem-${sequence}`, label: `Semester ${index}`, gpa: "", credits: "18" };
}

/** Fixed ids for the rows present on first render, so hydration matches. */
function seedSemesters(gpas: string[]): Semester[] {
  return gpas.map((gpa, index) => ({
    id: `seed-sem-${index + 1}`,
    label: `Semester ${index + 1}`,
    gpa,
    credits: "18",
  }));
}

export default function CgpaCalculator() {
  const [semesters, setSemesters] = React.useState<Semester[]>(() =>
    seedSemesters(["8.2", "7.9", "8.6"]),
  );
  const [maxScale, setMaxScale] = React.useState("10");
  const [targetCgpa, setTargetCgpa] = React.useState("");
  const [plannedCredits, setPlannedCredits] = React.useState("18");

  const update = (id: string, patch: Partial<Semester>) =>
    setSemesters((previous) =>
      previous.map((semester) => (semester.id === id ? { ...semester, ...patch } : semester)),
    );

  const scale = parseNumber(maxScale) ?? 10;

  const result = React.useMemo(() => {
    let weighted = 0;
    let credits = 0;
    let counted = 0;

    for (const semester of semesters) {
      const gpa = parseNumber(semester.gpa);
      const semesterCredits = parseNumber(semester.credits);
      if (gpa === null || semesterCredits === null || semesterCredits <= 0 || gpa < 0) continue;

      weighted += gpa * semesterCredits;
      credits += semesterCredits;
      counted += 1;
    }

    if (credits === 0) return null;
    return { cgpa: weighted / credits, weighted, credits, counted };
  }, [semesters]);

  const projection = React.useMemo(() => {
    if (!result) return null;
    const target = parseNumber(targetCgpa);
    const upcoming = parseNumber(plannedCredits);
    if (target === null || upcoming === null || upcoming <= 0) return null;

    // Solve (weighted + x·upcoming) / (credits + upcoming) = target for x.
    const required = (target * (result.credits + upcoming) - result.weighted) / upcoming;

    return {
      required,
      achievable: required <= scale && required >= 0,
      target,
      upcoming,
    };
  }, [plannedCredits, result, scale, targetCgpa]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="cgpa-scale"
            label="Maximum GPA on your scale"
            value={maxScale}
            onChange={setMaxScale}
            min={1}
            step="0.1"
            hint="Usually 10 in India, 4 in North America."
          />
        </div>

        <div className="space-y-2">
          <div className="hidden grid-cols-[1fr_7rem_7rem_2.25rem] gap-2 px-1 text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase sm:grid">
            <span>Semester</span>
            <span>GPA</span>
            <span>Credits</span>
            <span className="sr-only">Remove</span>
          </div>

          <ul className="space-y-2">
            {semesters.map((semester, index) => (
              <li
                key={semester.id}
                className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface-sunken p-2 sm:grid-cols-[1fr_7rem_7rem_2.25rem] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
              >
                <Input
                  aria-label={`Semester ${index + 1} label`}
                  value={semester.label}
                  onChange={(event) => update(semester.id, { label: event.target.value })}
                  className="col-span-2 sm:col-span-1"
                />
                <Input
                  aria-label={`${semester.label} GPA`}
                  type="number"
                  min={0}
                  max={scale}
                  step="0.01"
                  placeholder="0.00"
                  value={semester.gpa}
                  onChange={(event) => update(semester.id, { gpa: event.target.value })}
                  className="tabular"
                />
                <Input
                  aria-label={`${semester.label} credits`}
                  type="number"
                  min={0}
                  step="0.5"
                  value={semester.credits}
                  onChange={(event) => update(semester.id, { credits: event.target.value })}
                  className="tabular"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${semester.label}`}
                  disabled={semesters.length <= 1}
                  onClick={() => setSemesters((previous) => previous.filter((item) => item.id !== semester.id))}
                  className="justify-self-end"
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSemesters((previous) => [...previous, newSemester(previous.length + 1)])}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add semester
          </Button>
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Cumulative GPA"
              value={result.cgpa.toFixed(2)}
              sublabel={`Across ${result.counted} semester${result.counted === 1 ? "" : "s"} and ${formatNumber(result.credits, { maximumFractionDigits: 1 })} credits`}
              breakdown={[
                { label: "Weighted points", value: formatNumber(result.weighted, { maximumFractionDigits: 2 }) },
                { label: "Total credits", value: formatNumber(result.credits, { maximumFractionDigits: 1 }) },
              ]}
            />

            <StatGrid className="sm:grid-cols-3">
              <Stat label="CGPA" value={result.cgpa.toFixed(2)} emphasis />
              <Stat
                label="Percentage (CGPA × 9.5)"
                value={`${(result.cgpa * 9.5).toFixed(1)}%`}
                hint="Common approximation — check your institution's table"
              />
              <Stat label="Percentage of scale" value={`${((result.cgpa / scale) * 100).toFixed(1)}%`} />
            </StatGrid>

            <section className="rounded-lg border border-border p-4">
              <h2 className="text-sm font-semibold text-fg">Plan your next semester</h2>
              <p className="mt-0.5 text-[0.8125rem] text-fg-muted">
                Work out the GPA you would need next semester to reach a target CGPA.
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="cgpa-target"
                  label="Target CGPA"
                  value={targetCgpa}
                  onChange={setTargetCgpa}
                  min={0}
                  max={scale}
                  step="0.01"
                  placeholder={(result.cgpa + 0.2).toFixed(2)}
                />
                <NumberField
                  id="cgpa-planned"
                  label="Credits next semester"
                  value={plannedCredits}
                  onChange={setPlannedCredits}
                  min={0.5}
                  step="0.5"
                />
              </div>

              {projection ? (
                <div className="mt-3">
                  {projection.achievable ? (
                    <Alert tone="success" title={`You need a ${projection.required.toFixed(2)} GPA next semester`}>
                      Taking {formatNumber(projection.upcoming, { maximumFractionDigits: 1 })} credits at that
                      average would bring your CGPA to {projection.target.toFixed(2)}.
                    </Alert>
                  ) : projection.required < 0 ? (
                    <Alert tone="success" title="You are already there">
                      Your CGPA is above the target, so any passing grade keeps you above{" "}
                      {projection.target.toFixed(2)}.
                    </Alert>
                  ) : (
                    <Alert tone="warning" title="Not reachable in one semester">
                      That target would need a {projection.required.toFixed(2)} GPA, which is above the maximum
                      of {scale}. Spreading it over more semesters, or raising the credit load, would make it
                      possible.
                    </Alert>
                  )}
                </div>
              ) : null}
            </section>

            <Working
              lines={[
                ...semesters
                  .filter((s) => parseNumber(s.gpa) !== null && (parseNumber(s.credits) ?? 0) > 0)
                  .map(
                    (s) =>
                      `${s.label}: ${parseNumber(s.gpa)} × ${parseNumber(s.credits)} = ${((parseNumber(s.gpa) ?? 0) * (parseNumber(s.credits) ?? 0)).toFixed(2)}`,
                  ),
                `Total weighted points = ${result.weighted.toFixed(2)}`,
                `Total credits = ${result.credits}`,
                `CGPA = ${result.weighted.toFixed(2)} ÷ ${result.credits} = ${result.cgpa.toFixed(4)}`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a GPA and credit load for at least one semester." />
        )}

        <div className="flex justify-end">
          <ResetButton onReset={() => setSemesters([newSemester(1), newSemester(2)])}>
            Clear semesters
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
