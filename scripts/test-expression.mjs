import { evaluateExpression, formatResult } from "../src/lib/expression.ts";

const cases = [
  ["2 + 3 * 4", 14],
  ["(2 + 3) * 4", 20],
  ["2^3^2", 512],
  ["-3^2", -9],
  ["(-3)^2", 9],
  ["10 / 4", 2.5],
  ["2(3+4)", 14],
  ["3pi", Math.PI * 3],
  ["sqrt(144)", 12],
  ["log(1000)", 3],
  ["ln(e)", 1],
  ["5!", 120],
  ["3! + 2", 8],
  ["abs(-7)", 7],
  ["1.5e3", 1500],
  ["100 % 7", 2],
  ["2 * -3", -6],
  ["--5", 5],
  ["cbrt(27)", 3],
  ["1,234 + 1", 1235],
];

const degCases = [
  ["sin(30)", 0.5],
  ["cos(60)", 0.5],
  ["asin(0.5)", 30],
];

const radCases = [["sin(pi/2)", 1]];

const errors = [
  "2 +",
  "(2 + 3",
  "2 + 3)",
  "foo(3)",
  "1/0",
  "sqrt(-4)",
  "log(0)",
  "tan(90)",
  "2 3",
  "",
  "alert(1)",
];

let failures = 0;
const near = (a, b) => Math.abs(a - b) < 1e-9;

for (const [expr, expected] of cases) {
  try {
    const actual = evaluateExpression(expr, "deg");
    if (!near(actual, expected)) {
      console.log(`FAIL ${expr} => ${actual}, expected ${expected}`);
      failures += 1;
    }
  } catch (error) {
    console.log(`FAIL ${expr} threw: ${error.message}`);
    failures += 1;
  }
}

for (const [expr, expected] of degCases) {
  const actual = evaluateExpression(expr, "deg");
  if (!near(actual, expected)) {
    console.log(`FAIL(deg) ${expr} => ${actual}, expected ${expected}`);
    failures += 1;
  }
}

for (const [expr, expected] of radCases) {
  const actual = evaluateExpression(expr, "rad");
  if (!near(actual, expected)) {
    console.log(`FAIL(rad) ${expr} => ${actual}, expected ${expected}`);
    failures += 1;
  }
}

for (const expr of errors) {
  try {
    const value = evaluateExpression(expr, "deg");
    console.log(`FAIL "${expr}" should have thrown, got ${value}`);
    failures += 1;
  } catch (error) {
    if (error.name !== "ExpressionError") {
      console.log(`FAIL "${expr}" threw wrong error type: ${error.name} ${error.message}`);
      failures += 1;
    }
  }
}

console.log("formatResult samples:", formatResult(1 / 3), formatResult(1e20), formatResult(42));
console.log(failures === 0 ? "EXPRESSION PARSER OK" : `${failures} FAILURES`);

// Regression checks added after the first run.
const extra = [
  ["2^-3", 0.125],
  ["-2^2", -4],
  ["-2*3", -6],
  ["(1+2)(3+4)", 21],
  ["2sin(30)", 1],
  ["1_000 * 2", 2000],
  ["10-3-2", 5],
  ["100/10/2", 5],
];
let extraFails = 0;
for (const [expr, expected] of extra) {
  try {
    const actual = evaluateExpression(expr, "deg");
    if (Math.abs(actual - expected) > 1e-9) { console.log(`FAIL ${expr} => ${actual}, expected ${expected}`); extraFails++; }
  } catch (e) { console.log(`FAIL ${expr} threw: ${e.message}`); extraFails++; }
}
console.log(extraFails === 0 ? "REGRESSION CHECKS OK" : `${extraFails} regression failures`);
