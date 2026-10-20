"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { ACTIVITY_LEVELS, CM_PER_INCH, KG_PER_LB, dailyCalories, mifflinStJeor, type ActivityId, type Sex } from "@/lib/bmr";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, NumberField, ResultCard, ScheduleTable, SelectField, Working, parseNumber } from "./_shared";

const kcal = (value: number) => `${formatNumber(Math.round(value))} kcal`;

export default function BmrCalculator() {
  const [units, setUnits] = React.useState<"metric" | "imperial">("metric");
  const [sex, setSex] = React.useState<Sex>("female");
  const [age, setAge] = React.useState("35");
  const [weight, setWeight] = React.useState("68");
  const [heightCm, setHeightCm] = React.useState("168");
  const [feet, setFeet] = React.useState("5");
  const [inches, setInches] = React.useState("6");
  const [activity, setActivity] = React.useState<ActivityId>("light");

  const weightKg = units === "metric" ? (parseNumber(weight) ?? NaN) : (parseNumber(weight) ?? NaN) * KG_PER_LB;
  const height =
    units === "metric"
      ? (parseNumber(heightCm) ?? NaN)
      : ((parseNumber(feet) ?? NaN) * 12 + (parseNumber(inches) ?? 0)) * CM_PER_INCH;
  const ageValue = parseNumber(age) ?? NaN;
  const bmr = mifflinStJeor(sex, weightKg, height, ageValue);
  const tdee = bmr === null ? null : dailyCalories(bmr, activity);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Units</span>
            <Segmented
              name="bmr-units"
              ariaLabel="Units"
              value={units}
              onChange={(value) => {
                // Convert what is already typed so switching units keeps the same person.
                const w = parseNumber(weight);
                if (w !== null) setWeight(String(Math.round((value === "imperial" ? w / KG_PER_LB : w * KG_PER_LB) * 10) / 10));
                if (value === "imperial") {
                  const cm = parseNumber(heightCm);
                  if (cm !== null) {
                    const total = cm / CM_PER_INCH;
                    setFeet(String(Math.floor(total / 12)));
                    setInches(String(Math.round(total % 12)));
                  }
                } else {
                  const total = (parseNumber(feet) ?? 0) * 12 + (parseNumber(inches) ?? 0);
                  if (total > 0) setHeightCm(String(Math.round(total * CM_PER_INCH)));
                }
                setUnits(value);
              }}
              options={[
                { value: "metric", label: "kg / cm" },
                { value: "imperial", label: "lb / ft in" },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Sex</span>
            <Segmented
              name="bmr-sex"
              ariaLabel="Sex used in the equation"
              value={sex}
              onChange={setSex}
              options={[
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
              ]}
            />
          </div>
          <NumberField id="bmr-age" label="Age" value={age} onChange={setAge} suffix="years" min={15} max={120} step={1} />
          <NumberField id="bmr-weight" label="Weight" value={weight} onChange={setWeight} suffix={units === "metric" ? "kg" : "lb"} min={0} />
          {units === "metric" ? (
            <NumberField id="bmr-height" label="Height" value={heightCm} onChange={setHeightCm} suffix="cm" min={0} />
          ) : (
            <div className="grid grid-cols-2 items-end gap-2">
              <NumberField id="bmr-feet" label="Height" value={feet} onChange={setFeet} suffix="ft" min={0} step={1} />
              <NumberField id="bmr-inches" label={<span className="sr-only">Inches</span>} value={inches} onChange={setInches} suffix="in" min={0} max={11} />
            </div>
          )}
          <SelectField label="Activity level" id="bmr-activity" value={activity} onChange={(value) => setActivity(value as ActivityId)}>
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level.id} value={level.id}>
                {level.label}
              </option>
            ))}
          </SelectField>
        </div>

        {bmr !== null && tdee !== null ? (
          <div className="space-y-4">
            <ResultCard
              label="Estimated calories per day to maintain your weight"
              value={kcal(tdee)}
              sublabel={`Basal metabolic rate ${kcal(bmr)} × activity factor ${ACTIVITY_LEVELS.find((level) => level.id === activity)?.factor}.`}
              breakdown={[
                { label: "BMR (at complete rest)", value: kcal(bmr) },
                { label: "Maintenance (TDEE)", value: kcal(tdee) },
              ]}
            />
            <ScheduleTable
              caption="Daily calories at each activity level"
              columns={["Activity level", "Calories a day"]}
              rows={ACTIVITY_LEVELS.map((level) => [`${level.label.split(" — ")[0]} (× ${level.factor})`, kcal(bmr * level.factor)])}
              maxHeight="20rem"
            />
            <Working
              lines={[
                `BMR = 10 × ${formatNumber(weightKg, { maximumFractionDigits: 1 })} kg + 6.25 × ${formatNumber(height, { maximumFractionDigits: 1 })} cm − 5 × ${ageValue} ${sex === "male" ? "+ 5" : "− 161"} = ${formatNumber(bmr, { maximumFractionDigits: 1 })} kcal`,
                `maintenance = BMR × ${ACTIVITY_LEVELS.find((level) => level.id === activity)?.factor} = ${formatNumber(tdee, { maximumFractionDigits: 0 })} kcal`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter an age from 15 to 120, a weight and a height." />
        )}
      </div>
    </ToolFrame>
  );
}
