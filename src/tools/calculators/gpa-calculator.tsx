"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Input, Select } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, ResultCard, SelectField, Working, parseNumber } from "./_shared";

interface Scale {
  id: string;
  name: string;
  max: number;
  grades: Array<{ letter: string; points: number }>;
}

const SCALES: Scale[] = [
  {
    id: "4.0",
    name: "4.0 scale (standard)",
    max: 4,
    grades: [
      { letter: "A", points: 4 },
      { letter: "A−", points: 3.7 },
      { letter: "B+", points: 3.3 },
      { letter: "B", points: 3 },
      { letter: "B−", points: 2.7 },
      { letter: "C+", points: 2.3 },
      { letter: "C", points: 2 },
      { letter: "C−", points: 1.7 },
      { letter: "D+", points: 1.3 },
      { letter: "D", points: 1 },
      { letter: "F", points: 0 },
    ],
  },
  {
    id: "4.3",
    name: "4.3 scale (with A+)",
    max: 4.3,
    grades: [
      { letter: "A+", points: 4.3 },
      { letter: "A", points: 4 },
      { letter: "A−", points: 3.7 },
      { letter: "B+", points: 3.3 },
      { letter: "B", points: 3 },
      { letter: "B−", points: 2.7 },
      { letter: "C+", points: 2.3 },
      { letter: "C", points: 2 },
      { letter: "C−", points: 1.7 },
      { letter: "D", points: 1 },
      { letter: "F", points: 0 },
    ],
  },
  {
    id: "5.0",
    name: "5.0 scale (weighted / honours)",
    max: 5,
    grades: [
      { letter: "A+", points: 5 },
      { letter: "A", points: 4.5 },
      { letter: "B+", points: 4 },
      { letter: "B", points: 3.5 },
      { letter: "C+", points: 3 },
      { letter: "C", points: 2.5 },
      { letter: "D", points: 2 },
      { letter: "F", points: 0 },
    ],
  },
];

interface Course {
  id: string;
  name: string;
  credits: string;
  grade: string;
  excluded: boolean;
}

let sequence = 0;
function newCourse(grade: string): Course {
  sequence += 1;
  return { id: `course-${sequence}`, name: "", credits: "3", grade, excluded: false };
}

/**
 * Rows present on first render use fixed ids so the server-rendered markup and
 * the client's first render agree.
 */
function seedCourses(grades: string[]): Course[] {
  return grades.map((grade, index) => ({
    id: `seed-course-${index + 1}`,
    name: "",
    credits: "3",
    grade,
    excluded: false,
  }));
}

export default function GpaCalculator() {
  const [scaleId, setScaleId] = React.useState("4.0");
  const [usePoints, setUsePoints] = React.useState(false);
  const [courses, setCourses] = React.useState<Course[]>(() => seedCourses(["A", "B+", "B"]));

  const scale = SCALES.find((item) => item.id === scaleId) ?? SCALES[0];

  /**
   * Switching scale can leave a row holding a letter the new scale does not
   * define — a B− has no equivalent on the 5.0 scale. Remapping happens here,
   * in the event that caused it, rather than in an effect that would let one
   * render paint with an invalid grade first.
   */
  const changeScale = (nextScaleId: string) => {
    const nextScale = SCALES.find((item) => item.id === nextScaleId) ?? SCALES[0];
    setScaleId(nextScaleId);
    setCourses((previous) =>
      previous.map((course) =>
        nextScale.grades.some((grade) => grade.letter === course.grade)
          ? course
          : { ...course, grade: nextScale.grades[0].letter },
      ),
    );
  };

  const update = (id: string, patch: Partial<Course>) =>
    setCourses((previous) => previous.map((course) => (course.id === id ? { ...course, ...patch } : course)));

  const result = React.useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    let counted = 0;
    let excludedCredits = 0;

    for (const course of courses) {
      const credits = parseNumber(course.credits);
      if (credits === null || credits <= 0) continue;

      if (course.excluded) {
        excludedCredits += credits;
        continue;
      }

      const points = usePoints
        ? parseNumber(course.grade)
        : (scale.grades.find((grade) => grade.letter === course.grade)?.points ?? null);

      if (points === null || points < 0) continue;

      totalPoints += points * credits;
      totalCredits += credits;
      counted += 1;
    }

    if (totalCredits === 0) return null;

    return {
      gpa: totalPoints / totalCredits,
      totalPoints,
      totalCredits,
      counted,
      excludedCredits,
    };
  }, [courses, scale, usePoints]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Grading scale" id="gpa-scale" value={scaleId} onChange={changeScale}>
            {SCALES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </SelectField>

          <div className="flex items-end pb-2">
            <Checkbox
              label="Enter grade points directly"
              description="Use this if your transcript lists numeric points rather than letters."
              checked={usePoints}
              onChange={(event) => {
                const next = event.target.checked;
                setUsePoints(next);
                setCourses((previous) =>
                  previous.map((course) => ({
                    ...course,
                    grade: next
                      ? String(scale.grades.find((g) => g.letter === course.grade)?.points ?? scale.max)
                      : scale.grades[0].letter,
                  })),
                );
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="hidden grid-cols-[1fr_5.5rem_8rem_5.5rem_2.25rem] gap-2 px-1 text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase sm:grid">
            <span>Course</span>
            <span>Credits</span>
            <span>{usePoints ? "Points" : "Grade"}</span>
            <span>Pass/fail</span>
            <span className="sr-only">Remove</span>
          </div>

          <ul className="space-y-2">
            {courses.map((course, index) => (
              <li
                key={course.id}
                className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface-sunken p-2 sm:grid-cols-[1fr_5.5rem_8rem_5.5rem_2.25rem] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
              >
                <Input
                  aria-label={`Course ${index + 1} name`}
                  placeholder={`Course ${index + 1}`}
                  value={course.name}
                  onChange={(event) => update(course.id, { name: event.target.value })}
                  className="col-span-2 sm:col-span-1"
                />
                <Input
                  aria-label={`Course ${index + 1} credits`}
                  type="number"
                  min={0}
                  step="0.5"
                  value={course.credits}
                  onChange={(event) => update(course.id, { credits: event.target.value })}
                  className="tabular"
                />
                {usePoints ? (
                  <Input
                    aria-label={`Course ${index + 1} grade points`}
                    type="number"
                    min={0}
                    max={scale.max}
                    step="0.1"
                    value={course.grade}
                    onChange={(event) => update(course.id, { grade: event.target.value })}
                    className="tabular"
                  />
                ) : (
                  <Select
                    aria-label={`Course ${index + 1} grade`}
                    value={course.grade}
                    onChange={(event) => update(course.id, { grade: event.target.value })}
                  >
                    {scale.grades.map((grade) => (
                      <option key={grade.letter} value={grade.letter}>
                        {grade.letter} ({grade.points})
                      </option>
                    ))}
                  </Select>
                )}
                <div className="flex items-center">
                  <Checkbox
                    label={<span className="text-xs sm:sr-only">Exclude</span>}
                    checked={course.excluded}
                    onChange={(event) => update(course.id, { excluded: event.target.checked })}
                    aria-label={`Exclude course ${index + 1} from the GPA`}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove course ${index + 1}`}
                  disabled={courses.length <= 1}
                  onClick={() => setCourses((previous) => previous.filter((item) => item.id !== course.id))}
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
              setCourses((previous) => [
                ...previous,
                newCourse(usePoints ? String(scale.max) : scale.grades[0].letter),
              ])
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            Add course
          </Button>
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Grade point average"
              value={result.gpa.toFixed(2)}
              sublabel={`Out of ${scale.max} · ${result.counted} graded course${result.counted === 1 ? "" : "s"}`}
              breakdown={[
                { label: "Total grade points", value: formatNumber(result.totalPoints, { maximumFractionDigits: 2 }) },
                { label: "Total credits", value: formatNumber(result.totalCredits, { maximumFractionDigits: 1 }) },
              ]}
            />

            <StatGrid className="sm:grid-cols-3">
              <Stat label="GPA" value={result.gpa.toFixed(2)} emphasis />
              <Stat
                label="Percentage of scale"
                value={`${((result.gpa / scale.max) * 100).toFixed(1)}%`}
              />
              <Stat
                label="Excluded credits"
                value={formatNumber(result.excludedCredits, { maximumFractionDigits: 1 })}
                hint="Pass/fail courses"
              />
            </StatGrid>

            <Working
              lines={[
                ...courses
                  .filter((course) => !course.excluded && parseNumber(course.credits))
                  .map((course, index) => {
                    const credits = parseNumber(course.credits) ?? 0;
                    const points = usePoints
                      ? (parseNumber(course.grade) ?? 0)
                      : (scale.grades.find((g) => g.letter === course.grade)?.points ?? 0);
                    return `${course.name || `Course ${index + 1}`}: ${points} × ${credits} = ${(points * credits).toFixed(2)}`;
                  }),
                `Sum of points = ${result.totalPoints.toFixed(2)}`,
                `Sum of credits = ${result.totalCredits}`,
                `GPA = ${result.totalPoints.toFixed(2)} ÷ ${result.totalCredits} = ${result.gpa.toFixed(4)}`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Add at least one graded course with credits above zero." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() =>
              setCourses([
                newCourse(usePoints ? String(scale.max) : scale.grades[0].letter),
                newCourse(usePoints ? String(scale.max) : scale.grades[0].letter),
                newCourse(usePoints ? String(scale.max) : scale.grades[0].letter),
              ])
            }
          >
            Clear all courses
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
