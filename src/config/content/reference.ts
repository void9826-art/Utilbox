import { LENGTH_UNITS, TIME_UNITS, convertUnits } from "@/lib/units";
import type { ToolReference } from "@/types/tool";

/**
 * Quick-reference tables for tool pages. Every figure is computed from the
 * same functions and factors the tool itself uses, so the table can never
 * disagree with the result the visitor gets.
 */

const number = (value: number, digits = 4) =>
  value.toLocaleString("en-US", { maximumFractionDigits: digits });

/** The standard 90/80/70/60 scale, the default in the Grade Calculator. */
function letter(percent: number): string {
  if (percent >= 90) return "A";
  if (percent >= 80) return "B";
  if (percent >= 70) return "C";
  if (percent >= 60) return "D";
  return "F";
}

const SCORES: Array<[number, number]> = [
  [7, 10], [8, 10], [15, 20], [17, 20], [18, 25], [21, 25], [30, 40], [34, 40],
  [35, 50], [42, 50], [45, 50], [56, 80], [61, 80], [64, 80], [72, 80], [65, 100],
];

const gradeReference: ToolReference = {
  title: "Common scores as percentages",
  intro: "Each score divided by the marks available, with the letter grade on the standard 90/80/70/60 scale.",
  columns: ["Score", "Percentage", "Letter grade"],
  rows: SCORES.map(([score, max]) => {
    const percent = (score / max) * 100;
    return [`${score}/${max}`, `${number(percent, 2)}%`, letter(percent)];
  }),
};

const length = (value: number, from: string, to: string) => convertUnits(LENGTH_UNITS, value, from, to);

const LENGTHS: Array<[number, string, string, string, string]> = [
  [1, "in", "cm", "inch", "cm"],
  [1, "ft", "cm", "foot", "cm"],
  [1, "ft", "m", "foot", "m"],
  [1, "yd", "m", "yard", "m"],
  [1, "mi", "km", "mile", "km"],
  [1, "cm", "in", "cm", "inches"],
  [1, "m", "ft", "metre", "feet"],
  [1, "m", "in", "metre", "inches"],
  [1, "km", "mi", "km", "miles"],
  [100, "m", "yd", "metres", "yards"],
  [5, "km", "mi", "km", "miles"],
  [10, "km", "mi", "km", "miles"],
];

const lengthReference: ToolReference = {
  title: "Common length conversions",
  intro: "Calculated with the exact definitions the converter uses: 1 inch is 2.54 cm and 1 mile is 1.609344 km.",
  columns: ["From", "Equals"],
  rows: [
    ...LENGTHS.map(([value, from, to, fromLabel, toLabel]) => [
      `${value} ${fromLabel}`,
      `${number(length(value, from, to))} ${toLabel}`,
    ]),
    // Height is the conversion people look up most often in feet and inches.
    ...[[5, 6], [5, 10], [6, 0]].map(([feet, inches]) => [
      `${feet} ft ${inches} in`,
      `${number(length(feet * 12 + inches, "in", "cm"), 1)} cm`,
    ]),
  ],
};

const time = (value: number, from: string, to: string) => convertUnits(TIME_UNITS, value, from, to);

const TIMES: Array<[number, string, string, string, string]> = [
  [1, "min", "s", "minute", "seconds"],
  [1, "h", "min", "hour", "minutes"],
  [1, "h", "s", "hour", "seconds"],
  [1, "d", "h", "day", "hours"],
  [1, "d", "min", "day", "minutes"],
  [1, "d", "s", "day", "seconds"],
  [1, "wk", "h", "week", "hours"],
  [1, "wk", "min", "week", "minutes"],
  [90, "min", "h", "minutes", "hours"],
  [45, "min", "h", "minutes", "hours"],
  [1000, "min", "h", "minutes", "hours"],
  [10000, "s", "h", "seconds", "hours"],
  [1, "yr", "d", "year (average)", "days"],
  [1, "yr", "h", "year (average)", "hours"],
];

const timeReference: ToolReference = {
  title: "Common time conversions",
  intro: "Months and years have no fixed length, so the converter uses the average Gregorian year of 365.2425 days.",
  columns: ["From", "Equals"],
  rows: TIMES.map(([value, from, to, fromLabel, toLabel]) => [
    `${number(value)} ${fromLabel}`,
    `${number(time(value, from, to))} ${toLabel}`,
  ]),
};

export const TOOL_REFERENCES: Record<string, ToolReference> = {
  "grade-calculator": gradeReference,
  "length-converter": lengthReference,
  "time-converter": timeReference,
};
