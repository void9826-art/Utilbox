"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { cn } from "@/lib/utils";

import { EmptyResult, NumberField, ResultCard, Working, parseNumber } from "./_shared";

const CATEGORIES = [
  { label: "Underweight", min: 0, max: 18.5, tone: "bg-border-strong" },
  { label: "Healthy weight", min: 18.5, max: 25, tone: "bg-border" },
  { label: "Overweight", min: 25, max: 30, tone: "bg-fg-subtle" },
  { label: "Obese", min: 30, max: Infinity, tone: "bg-fg" },
];

function categoryFor(bmi: number) {
  return CATEGORIES.find((category) => bmi >= category.min && bmi < category.max) ?? CATEGORIES[3];
}

export default function BmiCalculator() {
  const [units, setUnits] = React.useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = React.useState("175");
  const [weightKg, setWeightKg] = React.useState("72");
  const [feet, setFeet] = React.useState("5");
  const [inches, setInches] = React.useState("9");
  const [pounds, setPounds] = React.useState("159");

  const result = React.useMemo(() => {
    let metres: number | null = null;
    let kilograms: number | null = null;

    if (units === "metric") {
      const cm = parseNumber(heightCm);
      const kg = parseNumber(weightKg);
      if (cm !== null && cm > 0) metres = cm / 100;
      if (kg !== null && kg > 0) kilograms = kg;
    } else {
      const ft = parseNumber(feet) ?? 0;
      const inch = parseNumber(inches) ?? 0;
      const lb = parseNumber(pounds);
      const totalInches = ft * 12 + inch;
      if (totalInches > 0) metres = totalInches * 0.0254;
      if (lb !== null && lb > 0) kilograms = lb * 0.45359237;
    }

    if (metres === null || kilograms === null || metres < 0.5 || metres > 2.75) return null;

    const bmi = kilograms / metres ** 2;
    const healthyLow = 18.5 * metres ** 2;
    const healthyHigh = 24.9 * metres ** 2;

    return {
      bmi,
      metres,
      kilograms,
      category: categoryFor(bmi),
      healthyLow,
      healthyHigh,
      // Position on a 15–40 scale for the visual indicator.
      position: Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100)),
    };
  }, [feet, heightCm, inches, pounds, units, weightKg]);

  const formatWeight = (kg: number) =>
    units === "metric" ? `${kg.toFixed(1)} kg` : `${(kg / 0.45359237).toFixed(1)} lb`;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="bmi-units"
          ariaLabel="Unit system"
          value={units}
          onChange={setUnits}
          options={[
            { value: "metric", label: "Metric (cm / kg)" },
            { value: "imperial", label: "Imperial (ft, in / lb)" },
          ]}
          className="sm:max-w-md"
        />

        {units === "metric" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              id="bmi-height-cm"
              label="Height"
              value={heightCm}
              onChange={setHeightCm}
              suffix="cm"
              min={50}
              max={275}
            />
            <NumberField
              id="bmi-weight-kg"
              label="Weight"
              value={weightKg}
              onChange={setWeightKg}
              suffix="kg"
              min={1}
              step="0.1"
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              id="bmi-feet"
              label="Height (feet)"
              value={feet}
              onChange={setFeet}
              suffix="ft"
              min={1}
              max={8}
              step={1}
            />
            <NumberField
              id="bmi-inches"
              label="Height (inches)"
              value={inches}
              onChange={setInches}
              suffix="in"
              min={0}
              max={11}
              step="0.5"
            />
            <NumberField
              id="bmi-pounds"
              label="Weight"
              value={pounds}
              onChange={setPounds}
              suffix="lb"
              min={1}
              step="0.1"
            />
          </div>
        )}

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Body mass index"
              value={result.bmi.toFixed(1)}
              sublabel={result.category.label}
              breakdown={[
                {
                  label: "Healthy weight range for your height",
                  value: `${formatWeight(result.healthyLow)} – ${formatWeight(result.healthyHigh)}`,
                },
                {
                  label:
                    result.bmi < 18.5
                      ? "To reach a healthy BMI, gain"
                      : result.bmi >= 25
                        ? "To reach a healthy BMI, lose"
                        : "You are within the healthy range",
                  value:
                    result.bmi < 18.5
                      ? formatWeight(result.healthyLow - result.kilograms)
                      : result.bmi >= 25
                        ? formatWeight(result.kilograms - result.healthyHigh)
                        : "—",
                },
              ]}
            />

            {/* Scale from 15 to 40, with the categories in proportion. */}
            <div>
              <div className="relative">
                <div className="flex h-3 overflow-hidden rounded-full">
                  <div className="bg-border-strong" style={{ width: "14%" }} aria-hidden="true" />
                  <div className="bg-border" style={{ width: "26%" }} aria-hidden="true" />
                  <div className="bg-fg-subtle" style={{ width: "20%" }} aria-hidden="true" />
                  <div className="bg-fg" style={{ width: "40%" }} aria-hidden="true" />
                </div>
                <div
                  className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-fg shadow-raised"
                  style={{ left: `${result.position}%` }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-2 flex justify-between text-[0.6875rem] text-fg-subtle">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>

            <StatGrid className="sm:grid-cols-4">
              {CATEGORIES.map((category) => (
                <Stat
                  key={category.label}
                  label={category.label}
                  value={
                    category.max === Infinity
                      ? `${category.min}+`
                      : `${category.min} – ${(category.max - 0.1).toFixed(1)}`
                  }
                  className={cn(
                    category.label === result.category.label &&
                      "border-accent-soft-border bg-accent-soft",
                  )}
                />
              ))}
            </StatGrid>

            <Working
              lines={[
                `Height : ${result.metres.toFixed(4)} m`,
                `Weight : ${result.kilograms.toFixed(3)} kg`,
                `BMI    = ${result.kilograms.toFixed(3)} ÷ ${result.metres.toFixed(4)}² = ${result.kilograms.toFixed(3)} ÷ ${(result.metres ** 2).toFixed(4)}`,
                `       = ${result.bmi.toFixed(4)}`,
                `Healthy range = 18.5 × ${(result.metres ** 2).toFixed(4)} to 24.9 × ${(result.metres ** 2).toFixed(4)}`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a height and a weight to calculate BMI." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setHeightCm("");
              setWeightKg("");
              setFeet("");
              setInches("");
              setPounds("");
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
