"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, NumberField, ResultCard, SelectField, Working, parseNumber } from "./_shared";

interface Boundary {
  letter: string;
  min: number;
}

const SCALES: Record<string, { name: string; boundaries: Boundary[] }> = {
  standard: {
    name: "Standard letter (A–F)",
    boundaries: [
      { letter: "A", min: 90 },
      { letter: "B", min: 80 },
      { letter: "C", min: 70 },
      { letter: "D", min: 60 },
      { letter: "F", min: 0 },
    ],
  },
  plusMinus: {
    name: "Plus / minus letter",
    boundaries: [
      { letter: "A+", min: 97 },
      { letter: "A", min: 93 },
      { letter: "A−", min: 90 },
      { letter: "B+", min: 87 },
      { letter: "B", min: 83 },
      { letter: "B−", min: 80 },
      { letter: "C+", min: 77 },
      { letter: "C", min: 73 },
      { letter: "C−", min: 70 },
      { letter: "D+", min: 67 },
      { letter: "D", min: 63 },
      { letter: "D−", min: 60 },
      { letter: "F", min: 0 },
    ],
  },
  uk: {
    name: "UK degree classification",
    boundaries: [
      { letter: "First (1st)", min: 70 },
      { letter: "Upper second (2:1)", min: 60 },
      { letter: "Lower second (2:2)", min: 50 },
      { letter: "Third (3rd)", min: 40 },
      { letter: "Fail", min: 0 },
    ],
  },
  pass: {
    name: "Pass / fail at 40%",
    boundaries: [
      { letter: "Pass", min: 40 },
      { letter: "Fail", min: 0 },
    ],
  },
};

interface Assessment {
  id: string;
  name: string;
  score: string;
  maximum: string;
  weight: string;
}

let sequence = 0;
function newAssessment(name: string, weight: string): Assessment {
  sequence += 1;
  return { id: `assessment-${sequence}`, name, score: "", maximum: "100", weight };
}

/** Fixed ids for the rows present on first render, so hydration matches. */
const SEED_ASSESSMENTS: Assessment[] = [
  { id: "seed-assessment-1", name: "Coursework", score: "42", maximum: "50", weight: "20" },
  { id: "seed-assessment-2", name: "Midterm", score: "61", maximum: "80", weight: "30" },
  { id: "seed-assessment-3", name: "Final exam", score: "70", maximum: "100", weight: "50" },
];

function letterFor(percentage: number, scaleId: string): string {
  const { boundaries } = SCALES[scaleId] ?? SCALES.standard;
  return boundaries.find((boundary) => percentage >= boundary.min)?.letter ?? boundaries[boundaries.length - 1].letter;
}

export default function GradeCalculator() {
  const [scaleId, setScaleId] = React.useState("standard");
  const [assessments, setAssessments] = React.useState<Assessment[]>(SEED_ASSESSMENTS);
  const [targetPercent, setTargetPercent] = React.useState("70");
  const [finalWeight, setFinalWeight] = React.useState("40");

  const update = (id: string, patch: Partial<Assessment>) =>
    setAssessments((previous) =>
      previous.map((assessment) => (assessment.id === id ? { ...assessment, ...patch } : assessment)),
    );

  const result = React.useMemo(() => {
    let weightedSum = 0;
    let totalWeight = 0;
    const rows: Array<{ name: string; percent: number; weight: number }> = [];

    for (const assessment of assessments) {
      const score = parseNumber(assessment.score);
      const maximum = parseNumber(assessment.maximum);
      const weight = parseNumber(assessment.weight);

      if (score === null || maximum === null || maximum <= 0 || weight === null || weight <= 0) continue;

      const percent = (score / maximum) * 100;
      weightedSum += percent * weight;
      totalWeight += weight;
      rows.push({ name: assessment.name, percent, weight });
    }

    if (totalWeight === 0) return null;

    const overall = weightedSum / totalWeight;
    return { overall, totalWeight, rows, letter: letterFor(overall, scaleId) };
  }, [assessments, scaleId]);

  const planner = React.useMemo(() => {
    if (!result) return null;
    const target = parseNumber(targetPercent);
    const weight = parseNumber(finalWeight);
    if (target === null || weight === null || weight <= 0 || weight >= 100) return null;

    // The work so far accounts for (100 − weight) percent of the course.
    const completedShare = (100 - weight) / 100;
    const needed = (target - result.overall * completedShare) / (weight / 100);

    return { needed, target, weight, achievable: needed <= 100, alreadyThere: needed <= 0 };
  }, [finalWeight, result, targetPercent]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <SelectField
          label="Grading scale"
          id="grade-scale"
          value={scaleId}
          onChange={setScaleId}
          className="sm:max-w-sm"
          hint="Boundaries vary between institutions — the percentage is the reliable figure."
        >
          {Object.entries(SCALES).map(([id, scale]) => (
            <option key={id} value={id}>
              {scale.name}
            </option>
          ))}
        </SelectField>

        <div className="space-y-2">
          <div className="hidden grid-cols-[1fr_6rem_6rem_6rem_2.25rem] gap-2 px-1 text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase sm:grid">
            <span>Assessment</span>
            <span>Score</span>
            <span>Out of</span>
            <span>Weight</span>
            <span className="sr-only">Remove</span>
          </div>

          <ul className="space-y-2">
            {assessments.map((assessment, index) => (
              <li
                key={assessment.id}
                className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-surface-sunken p-2 sm:grid-cols-[1fr_6rem_6rem_6rem_2.25rem] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
              >
                <Input
                  aria-label={`Assessment ${index + 1} name`}
                  value={assessment.name}
                  onChange={(event) => update(assessment.id, { name: event.target.value })}
                  className="col-span-3 sm:col-span-1"
                />
                <Input
                  aria-label={`${assessment.name} score`}
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0"
                  value={assessment.score}
                  onChange={(event) => update(assessment.id, { score: event.target.value })}
                  className="tabular"
                />
                <Input
                  aria-label={`${assessment.name} maximum`}
                  type="number"
                  min={0.01}
                  step="any"
                  value={assessment.maximum}
                  onChange={(event) => update(assessment.id, { maximum: event.target.value })}
                  className="tabular"
                />
                <Input
                  aria-label={`${assessment.name} weight`}
                  type="number"
                  min={0}
                  step="any"
                  value={assessment.weight}
                  onChange={(event) => update(assessment.id, { weight: event.target.value })}
                  className="tabular"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${assessment.name}`}
                  disabled={assessments.length <= 1}
                  onClick={() =>
                    setAssessments((previous) => previous.filter((item) => item.id !== assessment.id))
                  }
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
            onClick={() =>
              setAssessments((previous) => [
                ...previous,
                newAssessment(`Assessment ${previous.length + 1}`, "10"),
              ])
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            Add assessment
          </Button>
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Overall grade"
              value={`${result.overall.toFixed(2)}%`}
              sublabel={
                result.totalWeight === 100
                  ? "Weights add up to 100%."
                  : `Weights add up to ${formatNumber(result.totalWeight)} and have been normalised.`
              }
              breakdown={[
                { label: "Letter grade", value: result.letter },
                { label: "Assessments counted", value: String(result.rows.length) },
              ]}
            />

            <StatGrid className="sm:grid-cols-3">
              <Stat label="Percentage" value={`${result.overall.toFixed(2)}%`} emphasis />
              <Stat label="Grade" value={result.letter} />
              <Stat
                label="Total weight entered"
                value={formatNumber(result.totalWeight, { maximumFractionDigits: 2 })}
              />
            </StatGrid>

            <section className="rounded-lg border border-border p-4">
              <h2 className="text-sm font-semibold text-fg">What do I need on the final?</h2>
              <p className="mt-0.5 text-[0.8125rem] text-fg-muted">
                Enter the weight of the remaining assessment and the overall grade you are aiming for.
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="grade-target"
                  label="Target overall grade"
                  value={targetPercent}
                  onChange={setTargetPercent}
                  suffix="%"
                  min={0}
                  max={100}
                />
                <NumberField
                  id="grade-final-weight"
                  label="Weight of the remaining assessment"
                  value={finalWeight}
                  onChange={setFinalWeight}
                  suffix="%"
                  min={1}
                  max={99}
                />
              </div>

              {planner ? (
                <div className="mt-3">
                  {planner.alreadyThere ? (
                    <Alert tone="success" title="Already secured">
                      You have reached {planner.target}% regardless of the remaining assessment.
                    </Alert>
                  ) : planner.achievable ? (
                    <Alert
                      tone="info"
                      title={`You need ${planner.needed.toFixed(1)}% on the remaining assessment`}
                    >
                      That assumes the work entered above represents the other{" "}
                      {(100 - planner.weight).toFixed(0)}% of the course.
                    </Alert>
                  ) : (
                    <Alert tone="warning" title="Not reachable">
                      Reaching {planner.target}% would need {planner.needed.toFixed(1)}% on the remaining
                      assessment, which is above full marks.
                    </Alert>
                  )}
                </div>
              ) : null}
            </section>

            <Working
              lines={[
                ...result.rows.map(
                  (row) =>
                    `${row.name}: ${row.percent.toFixed(2)}% × ${row.weight} = ${(row.percent * row.weight).toFixed(2)}`,
                ),
                `Sum = ${(result.overall * result.totalWeight).toFixed(2)}`,
                `Overall = ${(result.overall * result.totalWeight).toFixed(2)} ÷ ${result.totalWeight} = ${result.overall.toFixed(2)}%`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a score, a maximum and a weight for at least one assessment." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() =>
              setAssessments([newAssessment("Assessment 1", "50"), newAssessment("Assessment 2", "50")])
            }
          >
            Clear assessments
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
