/**
 * Checks the worked examples printed on the tool pages against the code that
 * actually produces them. A number in the copy that the tool would not produce
 * is worse than no example at all.
 */
import { amortise, compoundGrowth, roundMoney } from "../src/lib/money.ts";
import { convertUnits, convertTemperature, LENGTH_UNITS, WEIGHT_UNITS, AREA_UNITS, DATA_UNITS } from "../src/lib/units.ts";

let problems = 0;
const near = (a, b, eps = 0.01) => Math.abs(a - b) <= eps;
const check = (label, actual, expected, eps) => {
  const ok = typeof expected === "number" ? near(actual, expected, eps ?? 0.01) : actual === expected;
  if (!ok) {
    console.log(`MISMATCH  ${label}\n          copy says ${expected}, code produces ${actual}`);
    problems += 1;
  }
};

/* emi-calculator */
const emi = amortise(500000, 9 / 12 / 100, 60);
check("emi payment", Number(emi.payment.toFixed(0)), 10379);
check("emi total paid", Number(emi.totalPaid.toFixed(2)), 622750.59);
check("emi total interest", Number(emi.totalInterest.toFixed(2)), 122750.59);

/* mortgage-calculator */
const mortgage = amortise(280000, 6.5 / 12 / 100, 360);
check("mortgage principal+interest", Number(mortgage.payment.toFixed(0)), 1770);
check("mortgage total monthly", Number((mortgage.payment + 4200 / 12 + 1200 / 12).toFixed(0)), 2220);

/* compound-interest-calculator */
const growth = compoundGrowth({
  principal: 5000,
  annualRate: 0.07,
  years: 10,
  compoundsPerYear: 12,
  contribution: 200,
  contributionsPerYear: 12,
});
check("compound final balance", Number(growth.finalBalance.toFixed(0)), 44665);
check("compound interest", Number(growth.totalInterest.toFixed(0)), 15665);
const alone = compoundGrowth({ principal: 5000, annualRate: 0.07, years: 10, compoundsPerYear: 12 });
check("compound principal alone", Number(alone.finalBalance.toFixed(0)), 10048);
check(
  "compound contributions grow to",
  Number((growth.finalBalance - alone.finalBalance).toFixed(0)),
  34617,
  1,
);

/* percentage-calculator: 80 -> 60 */
check("percentage change", ((60 - 80) / 80) * 100, -25);

/* discount-calculator: 120 with 30% then 15% */
const stacked = roundMoney(120 * 0.7 * 0.85);
check("stacked discount price", stacked, 71.4);
check("stacked saving", roundMoney(120 - stacked), 48.6);
check("effective discount", Number((((120 - stacked) / 120) * 100).toFixed(1)), 40.5);

/* tax-calculator: 240 including 20% */
check("tax net", roundMoney(240 / 1.2), 200);
check("tax amount", roundMoney(240 - 240 / 1.2), 40);
check("wrong method figure quoted in copy", roundMoney(240 * 0.2), 48);

/* grade-calculator worked example */
const weighted = (42 / 50) * 20 + (61 / 80) * 30 + (70 / 100) * 50;
check("grade coursework share", Number(((42 / 50) * 20).toFixed(1)), 16.8);
check("grade midterm share", Number(((61 / 80) * 30).toFixed(1)), 22.9);
check("grade final share", Number(((70 / 100) * 50).toFixed(1)), 35.0);
check("grade overall", Number(weighted.toFixed(1)), 74.7);

/* gpa-calculator worked example */
const points = 4 * 4 + 3.3 * 3 + 3 * 4 + 3.7 * 2;
check("gpa total points", Number(points.toFixed(1)), 45.3);
check("gpa result", Number((points / 13).toFixed(2)), 3.48);

/* attendance-calculator: 38 of 52, 75% required */
check("attendance current", Number(((38 / 52) * 100).toFixed(1)), 73.1);
check("attendance needed", Math.ceil((0.75 * 52 - 38) / 0.25), 4);

/* salary-calculator: 25/hr, 37.5h, 52 weeks as quoted in the copy */
check("salary weekly", 25 * 37.5, 937.5);
check("salary annual", 25 * 37.5 * 52, 48750);
check("salary monthly", Number(((25 * 37.5 * 52) / 12).toFixed(2)), 4062.5);

/* bmi-calculator: 1.75 m, 72 kg */
check("bmi value", Number((72 / 1.75 ** 2).toFixed(1)), 23.5);
check("bmi healthy low", Number((18.5 * 1.75 ** 2).toFixed(1)), 56.7);
check("bmi healthy high", Number((24.9 * 1.75 ** 2).toFixed(1)), 76.3);

/* length-converter: 5 ft 11 in */
check("height in metres", Number(convertUnits(LENGTH_UNITS, 71, "in", "m").toFixed(4)), 1.8034);

/* weight-converter: 11 st 4 lb */
check("weight in kg", Number(convertUnits(WEIGHT_UNITS, 158, "lb", "kg").toFixed(2)), 71.67);

/* area-converter: 1200 sq ft */
check("area in m2", Number(convertUnits(AREA_UNITS, 1200, "ft2", "m2").toFixed(2)), 111.48);
check("area in acres", Number(convertUnits(AREA_UNITS, 1200, "ft2", "acre").toFixed(4)), 0.0275);

/* data-storage-converter: 1 TB as GiB */
check("1 TB in GiB", Number(convertUnits(DATA_UNITS, 1, "TB", "GiB").toFixed(2)), 931.32);

/* temperature-converter: 180 C */
check("180C in F", convertTemperature(180, "c", "f"), 356);
check("180C in K", convertTemperature(180, "c", "k"), 453.15);

/* timestamp-converter: 1788604200 */
const stamp = new Date(1788604200 * 1000);
check("timestamp UTC string", stamp.toUTCString(), "Sat, 05 Sep 2026 10:30:00 GMT");

/* age-calculator: 15 March 2001 measured on 5 September 2026 */
const birth = Date.UTC(2001, 2, 15);
const today = Date.UTC(2026, 8, 5);
check("age total days", Math.round((today - birth) / 86400000), 9305);

/* pdf-resize-page: the formula note and the Letter-to-A4 worked example */
import { fitToPaper, PAPER_SIZES } from "../src/lib/pdf-geometry.ts";
const a4ToLetter = fitToPaper({ x: 0, y: 0, ...PAPER_SIZES.a4 }, PAPER_SIZES.letter, "fit");
check("A4 to Letter scale %", Number((a4ToLetter.scale * 100).toFixed(1)), 94.1);
const letterToA4 = fitToPaper({ x: 0, y: 0, ...PAPER_SIZES.letter }, PAPER_SIZES.a4, "fit");
check("Letter to A4 scale %", Number((letterToA4.scale * 100).toFixed(1)), 97.3);
check("Letter to A4 space above and below, mm", Math.round((letterToA4.translateY / 72) * 25.4), 13);

/* shoe-size-converter: a 25 cm foot */
import { sizeFromFootLength, estimateHorsepower, convertPower, CC_PER_CUBIC_INCH } from "../src/lib/sizing.ts";
check("25 cm in inches", Number((25 / 2.54).toFixed(2)), 9.84);
check("25 cm UK before rounding", Number((3 * (25 / 2.54) - 23).toFixed(2)), 6.53);
check("25 cm UK", sizeFromFootLength("uk", 25), 6.5);
check("25 cm US men", sizeFromFootLength("us-men", 25), 7.5);
check("25 cm US women", sizeFromFootLength("us-women", 25), 8.5);
check("25 cm EU", sizeFromFootLength("eu", 25), 39.5);
check("25 cm Japan", sizeFromFootLength("jp", 25), 25);
check("25 cm Mondopoint", sizeFromFootLength("mondopoint", 25), 250);

/* engine-cc-to-hp: 1500 cc turbo petrol, 1998 cc, 100 PS, 150 cc */
check("1500 cc cubic inches", Number((1500 / CC_PER_CUBIC_INCH).toFixed(1)), 91.5);
const turboEstimate = estimateHorsepower(1500, "turbo-petrol");
check("1500 cc turbo low", Math.round(turboEstimate.low), 150);
check("1500 cc turbo high", Math.round(turboEstimate.high), 240);
check("1500 cc turbo typical", Math.round(turboEstimate.typical), 180);
check("1998 cc cubic inches", Number((1998 / CC_PER_CUBIC_INCH).toFixed(1)), 121.9);
check("100 PS in hp", Number(convertPower(100, "ps").hp.toFixed(1)), 98.6);
check("100 PS in kW", Number(convertPower(100, "ps").kw.toFixed(1)), 73.5);
const scooter150 = estimateHorsepower(150, "scooter");
check("150 cc scooter low", Math.round(scooter150.low), 9);
check("150 cc scooter high", Math.round(scooter150.high), 14);

console.log(problems === 0 ? "ALL DOCUMENTED EXAMPLES MATCH THE CODE" : `${problems} EXAMPLE(S) DISAGREE WITH THE CODE`);
if (problems > 0) process.exitCode = 1;
