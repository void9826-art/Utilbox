"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import {
  DOG_BREEDS,
  DOG_CHART,
  DOG_SIZE_LABELS,
  catHumanAge,
  dogEpigeneticAge,
  dogHumanAge,
  dogSizeFromWeightKg,
  type DogSize,
} from "@/lib/household";

import { EmptyResult, NumberField, ResultCard, ScheduleTable, SelectField, parseNumber } from "./_shared";

type Species = "dog" | "cat";

const WEIGHT_OPTION = "__weight";

function dogStage(years: number): string {
  if (years < 0.75) return "Puppy";
  if (years < 3.5) return "Young adult";
  return "Adult — larger breeds reach their senior years sooner than small ones";
}

function catStage(years: number): string {
  if (years < 1) return "Kitten";
  if (years <= 6) return "Young adult";
  if (years <= 10) return "Mature adult";
  return "Senior";
}

export default function PetAgeCalculator() {
  const [species, setSpecies] = React.useState<Species>("dog");
  const [years, setYears] = React.useState("6");
  const [months, setMonths] = React.useState("0");
  const [breed, setBreed] = React.useState("Labrador Retriever");
  const [weight, setWeight] = React.useState("20");
  const [weightUnit, setWeightUnit] = React.useState<"kg" | "lb">("kg");

  const yearValue = parseNumber(years);
  const monthValue = parseNumber(months);
  const age = yearValue !== null && monthValue !== null && yearValue >= 0 && monthValue >= 0 && monthValue < 12 ? yearValue + monthValue / 12 : null;
  const valid = age !== null && age > 0 && age <= 35;

  const weightValue = parseNumber(weight);
  const kilograms = weightValue === null ? null : weightUnit === "kg" ? weightValue : weightValue * 0.45359237;
  const size: DogSize | null =
    breed === WEIGHT_OPTION
      ? kilograms !== null && kilograms > 0
        ? dogSizeFromWeightKg(kilograms)
        : null
      : (DOG_BREEDS.find((entry) => entry.name === breed)?.size ?? null);

  const human = !valid ? null : species === "cat" ? catHumanAge(age) : size ? dogHumanAge(age, size) : null;
  const epigenetic = valid && species === "dog" ? dogEpigeneticAge(age) : null;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="pet-species"
          ariaLabel="Pet"
          value={species}
          onChange={setSpecies}
          options={[
            { value: "dog", label: "Dog" },
            { value: "cat", label: "Cat" },
          ]}
          className="sm:max-w-xs"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField id="pet-years" label="Age — years" value={years} onChange={setYears} min={0} step={1} inputMode="numeric" />
          <NumberField id="pet-months" label="and months" value={months} onChange={setMonths} min={0} max={11} step={1} inputMode="numeric" />
          {species === "dog" ? (
            <SelectField label="Breed" id="pet-breed" value={breed} onChange={setBreed}>
              <option value={WEIGHT_OPTION}>Mixed breed — choose by weight</option>
              {DOG_BREEDS.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </SelectField>
          ) : null}
          {species === "dog" && breed === WEIGHT_OPTION ? (
            <NumberField
              id="pet-weight"
              label="Adult weight"
              value={weight}
              onChange={setWeight}
              min={0}
              suffix={weightUnit}
              action={
                <button
                  type="button"
                  className="text-xs font-medium text-fg-muted underline underline-offset-2 hover:text-fg"
                  onClick={() => setWeightUnit((unit) => (unit === "kg" ? "lb" : "kg"))}
                >
                  Use {weightUnit === "kg" ? "lb" : "kg"}
                </button>
              }
            />
          ) : null}
        </div>

        {human !== null && age !== null ? (
          <div className="space-y-4">
            <ResultCard
              label="Age in human years"
              value={`${Math.round(human)} years`}
              sublabel={
                species === "dog" && size
                  ? `Using the size chart for ${DOG_SIZE_LABELS[size].split(" — ")[0].toLowerCase()} dogs.`
                  : "Using the International Cat Care chart."
              }
            />
            <StatGrid className="sm:grid-cols-3">
              <Stat label="Life stage" value={species === "dog" ? dogStage(age) : catStage(age)} />
              {species === "dog" ? (
                <Stat
                  label="DNA-based estimate"
                  value={epigenetic !== null ? `${Math.round(epigenetic)} years` : "From age 1"}
                  hint="16 × ln(age) + 31, measured in Labradors"
                />
              ) : null}
              {species === "dog" && size ? <Stat label="Size group" value={DOG_SIZE_LABELS[size]} /> : null}
            </StatGrid>
            {species === "dog" && size ? (
              <ScheduleTable
                caption={`Dog years to human years, ${size} dogs`}
                columns={["Dog age", "Human years"]}
                rows={DOG_CHART[size].map((value, index) => [
                  `${index + 1} year${index === 0 ? "" : "s"}${Math.floor(age) === index + 1 ? " ◀ now" : ""}`,
                  String(value),
                ])}
                maxHeight="18rem"
              />
            ) : null}
          </div>
        ) : (
          <EmptyResult
            message={
              species === "dog" && breed === WEIGHT_OPTION && size === null
                ? "Enter your dog's adult weight."
                : "Enter an age above zero, with months from 0 to 11."
            }
          />
        )}
      </div>
    </ToolFrame>
  );
}
