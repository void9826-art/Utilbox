"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Segmented } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { formatMoney } from "@/lib/money";
import {
  auTakeHome,
  caTakeHome,
  inTakeHome,
  ukTakeHome,
  type IndiaRegime,
  type Province,
  type TakeHomeResult,
  type UkPensionType,
  type UkRegion,
  type UkStudentLoan,
} from "@/lib/take-home";

import { EmptyResult, NumberField, ResultCard, ScheduleTable, SelectField, parseNumber } from "./_shared";

type Country = "uk" | "ca" | "au" | "in";

const COUNTRIES: Array<{ value: Country; label: string; currency: string; locale: string; year: string }> = [
  { value: "uk", label: "UK", currency: "GBP", locale: "en-GB", year: "2026/27 tax year" },
  { value: "ca", label: "Canada", currency: "CAD", locale: "en-CA", year: "2026 tax year" },
  { value: "au", label: "Australia", currency: "AUD", locale: "en-AU", year: "2026–27 income year" },
  { value: "in", label: "India", currency: "INR", locale: "en-IN", year: "FY 2026–27" },
];

export default function TakeHomePayCalculator() {
  const [country, setCountry] = React.useState<Country>("uk");
  const [salary, setSalary] = React.useState("40000");
  const [period, setPeriod] = React.useState<"year" | "month">("year");

  const [region, setRegion] = React.useState<UkRegion>("england");
  const [pensionPercent, setPensionPercent] = React.useState("0");
  const [pensionType, setPensionType] = React.useState<UkPensionType>("salary-sacrifice");
  const [studentLoan, setStudentLoan] = React.useState<UkStudentLoan>("none");
  const [postgraduate, setPostgraduate] = React.useState(false);

  const [province, setProvince] = React.useState<Province>("on");
  const [help, setHelp] = React.useState(false);

  const [regime, setRegime] = React.useState<IndiaRegime>("new");
  const [deductions, setDeductions] = React.useState("150000");
  const [pf, setPf] = React.useState("0");
  const [professionalTax, setProfessionalTax] = React.useState("0");

  const meta = COUNTRIES.find((entry) => entry.value === country)!;
  const money = (value: number) => formatMoney(value, meta.currency, meta.locale);

  const salaryValue = parseNumber(salary);
  const gross = salaryValue === null ? null : period === "year" ? salaryValue : salaryValue * 12;
  const pensionValue = parseNumber(pensionPercent) ?? 0;

  const calculate = React.useCallback(
    (amount: number): TakeHomeResult => {
      switch (country) {
        case "uk":
          return ukTakeHome({
            gross: amount,
            region,
            pensionPercent: Math.min(100, Math.max(0, pensionValue)),
            pensionType,
            studentLoan,
            postgraduateLoan: postgraduate,
          });
        case "ca":
          return caTakeHome(amount, province);
        case "au":
          return auTakeHome(amount, help);
        case "in":
          return inTakeHome({
            gross: amount,
            regime,
            deductions: Math.max(0, parseNumber(deductions) ?? 0),
            employeePf: Math.max(0, parseNumber(pf) ?? 0),
            professionalTax: Math.max(0, parseNumber(professionalTax) ?? 0),
          });
      }
    },
    [country, deductions, help, pensionType, pensionValue, pf, postgraduate, professionalTax, province, region, regime, studentLoan],
  );

  const valid = gross !== null && gross > 0 && gross < 1e9;
  const result = valid ? calculate(gross) : null;
  // Over £1,000 of extra pay, so allowance tapers and bands register as the real marginal rate.
  const marginal = valid && result ? (calculate(gross + 1000).totalDeductions - result.totalDeductions) / 1000 : 0;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="take-home-country"
          ariaLabel="Country"
          value={country}
          onChange={(value) => {
            setCountry(value);
            setSalary(value === "in" ? "1500000" : value === "uk" ? "40000" : "60000");
          }}
          options={COUNTRIES.map((entry) => ({ value: entry.value, label: entry.label }))}
          className="sm:max-w-md"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NumberField id="take-home-salary" label="Gross salary" value={salary} onChange={setSalary} min={0} />
          <SelectField label="Salary is" id="take-home-period" value={period} onChange={(value) => setPeriod(value as "year" | "month")}>
            <option value="year">Per year</option>
            <option value="month">Per month</option>
          </SelectField>

          {country === "uk" ? (
            <>
              <SelectField label="Where you live" id="take-home-region" value={region} onChange={(value) => setRegion(value as UkRegion)}>
                <option value="england">England, Wales or Northern Ireland</option>
                <option value="scotland">Scotland</option>
              </SelectField>
              <NumberField id="take-home-pension" label="Pension contribution" value={pensionPercent} onChange={setPensionPercent} suffix="%" min={0} max={100} />
              <SelectField label="Pension scheme type" id="take-home-pension-type" value={pensionType} onChange={(value) => setPensionType(value as UkPensionType)}>
                <option value="salary-sacrifice">Salary sacrifice</option>
                <option value="net-pay">Net pay arrangement</option>
                <option value="relief-at-source">Relief at source</option>
              </SelectField>
              <SelectField label="Student loan" id="take-home-loan" value={studentLoan} onChange={(value) => setStudentLoan(value as UkStudentLoan)}>
                <option value="none">None</option>
                <option value="plan1">Plan 1</option>
                <option value="plan2">Plan 2</option>
                <option value="plan4">Plan 4 (Scotland)</option>
                <option value="plan5">Plan 5</option>
              </SelectField>
              <Checkbox label="Postgraduate loan" checked={postgraduate} onChange={(event) => setPostgraduate(event.target.checked)} className="self-end" />
            </>
          ) : null}

          {country === "ca" ? (
            <SelectField label="Province" id="take-home-province" value={province} onChange={(value) => setProvince(value as Province)} hint="Other provinces and Quebec are not covered yet.">
              <option value="on">Ontario</option>
              <option value="bc">British Columbia</option>
              <option value="ab">Alberta</option>
            </SelectField>
          ) : null}

          {country === "au" ? (
            <Checkbox label="I have a HELP or other study loan" checked={help} onChange={(event) => setHelp(event.target.checked)} className="self-end" />
          ) : null}

          {country === "in" ? (
            <>
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Tax regime</span>
                <Segmented
                  name="take-home-regime"
                  ariaLabel="Tax regime"
                  value={regime}
                  onChange={setRegime}
                  options={[
                    { value: "new", label: "New regime" },
                    { value: "old", label: "Old regime" },
                  ]}
                />
              </div>
              {regime === "old" ? (
                <NumberField
                  id="take-home-deductions"
                  label="Deductions (80C, 80D, HRA…)"
                  value={deductions}
                  onChange={setDeductions}
                  prefix="₹"
                  min={0}
                  hint="Include your PF contribution under 80C."
                />
              ) : null}
              <NumberField id="take-home-pf" label="Employee PF per year" value={pf} onChange={setPf} prefix="₹" min={0} />
              <NumberField
                id="take-home-pt"
                label="Professional tax per year"
                value={professionalTax}
                onChange={setProfessionalTax}
                prefix="₹"
                min={0}
                hint="Up to ₹2,500 in states that charge it."
              />
            </>
          ) : null}
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label={`Take-home pay, ${meta.year}`}
              value={`${money(result.net)} a year`}
              sublabel={`From ${money(result.gross)} gross, after ${money(result.totalDeductions)} in deductions.`}
              breakdown={[
                { label: "Per month", value: money(result.net / 12) },
                { label: country === "au" ? "Per fortnight" : "Per week", value: money(result.net / (country === "au" ? 26 : 52)) },
              ]}
            />
            <StatGrid className="sm:grid-cols-3">
              <Stat label="Effective rate" value={`${((result.totalDeductions / result.gross) * 100).toFixed(1)}%`} hint="All deductions ÷ gross" />
              <Stat label="Marginal rate" value={`${(marginal * 100).toFixed(1)}%`} hint="Deducted from your next pay rise" />
              <Stat label="Taxable income" value={money(result.taxableIncome)} />
            </StatGrid>
            <ScheduleTable
              caption="Deductions"
              columns={["", "Per year", "Per month"]}
              rows={[
                ["Gross pay", money(result.gross), money(result.gross / 12)],
                ...result.lines.map((line) => [
                  line.note ? `${line.label} (${line.note})` : line.label,
                  `−${money(line.amount)}`,
                  `−${money(line.amount / 12)}`,
                ]),
                ["Take-home pay", money(result.net), money(result.net / 12)],
                ...result.extras.map((line) => [line.label, money(line.amount), money(line.amount / 12)]),
              ]}
              maxHeight="auto"
            />
          </div>
        ) : (
          <EmptyResult message="Enter a gross salary above zero." />
        )}
      </div>
    </ToolFrame>
  );
}
