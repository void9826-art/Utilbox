# Quality findings — 2026-10-20

A correctness, robustness, accessibility, mobile, performance and SEO pass over the existing tools. Fixes are small and local; anything risky is listed under "Not fixed".

## 1. Calculators and converters

Every formula was checked against its standard definition. These were correct and are now covered by edge-case tests:

- EMI and loan amortisation (reducing balance)
- compound interest
- mortgage (PITI)
- GPA and CGPA (credit-weighted)
- grade needed on the final
- percentage of, change, and add/subtract
- adding and removing tax
- stacked and reverse discounts
- BMI (exact lb and inch factors)
- salary periods (52.1775 weeks a year)
- every unit factor (the international foot and pound, US and imperial volumes, Gregorian year, decimal and binary data units)
- temperature
- the newer libraries (date maths, time card, fuel, SIP, BMR, number words, bases, loans)

### Bugs fixed

| Tool | Input | Before | After |
|---|---|---|---|
| Age Calculator | born 31 Jan 2000, on 1 Mar 2026 | 26 years, 1 month, **−2 days** | 26 years, 1 month, 1 day |
| Age Calculator | born 30 Jan 2000, on 1 Mar 2026 | 26 years, 1 month, **−1 day** | 26 years, 1 month, 1 day |
| Age Calculator | born 31 Jan, on 28 Feb (common year) | 0 months, 28 days (the page's own how-it-works said "1 month") | 1 month, 0 days |
| Attendance Calculator | 7 of 10 attended, 80% required | must attend **6** more | 5 more (12/15 = 80%) — `1 − 0.8` is `0.19999999999999996` in floating point |
| CGPA Calculator | 4-point scale, CGPA 3.5 | "Percentage (CGPA × 9.5): **33.3%**" | The × 9.5 figure is shown only on 10-point scales |
| CGPA Calculator | 8.5 typed on a 4-point scale | counted, inflating the CGPA | left out, with a note saying so |
| Percentage Calculator | change from −50 to −25 | working showed −50% next to "increase" | 50% increase (measured against \|start\|), working consistent |
| All money output | 1,234.5 in yen | ¥1,234.50 | ¥1,235 (each currency's own decimals: 0 for JPY, 3 for KWD) |

What moved into libraries:

- The age logic is now `src/lib/age.ts`. It counts whole months from the last birthday, clamps short months to their last day, and keeps the 1 March rule for 29 February birthdays that the page and guide describe. The page text was updated to describe the method accurately.
- Attendance logic is now `src/lib/attendance.ts`, using whole-percent arithmetic.

### Tests added

- `scripts/test-lib.mjs` → "QUALITY AUDIT TESTS". 49 checks:
  - age: month ends, leap birthdays, the same day, future dates, DST weeks, impossible dates
  - attendance: 70, 75, 80 and 72.5%, the exact boundary, invalid input
  - currency formatting: JPY, USD, KWD, NaN, unknown codes
  - half-up rounding of negatives
  - single-period, 30-year and huge loans
  - negative and zero-year growth
  - temperature at −40 and absolute zero
  - zero, negative, NaN and huge unit inputs
- `scripts/verify-examples.mjs`: the age page's 25 years 5 months 21 days and 191-day examples now run through the real code, plus the 31 January cases.
