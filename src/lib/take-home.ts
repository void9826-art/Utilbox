/**
 * Take-home pay for a single employee with no other income.
 *
 * Every figure below was checked against the tax authority or official
 * government publication for the stated year on 10 September 2026:
 *  - UK 2026/27: GOV.UK income tax rates, Scottish income tax, and "Rates and
 *    thresholds for employers 2026 to 2027" (NI and student loans).
 *  - Canada 2026: CRA federal and provincial brackets; CPP, CPP2 and EI 2026;
 *    provincial basic personal amounts and Ontario surtax thresholds.
 *  - Australia 2026–27: resident rates (15% bracket from 1 July 2026), LITO,
 *    Medicare levy, and HELP marginal repayment thresholds.
 *  - India FY 2026–27: Budget 2026 retained the FY 2025–26 slabs, rebate,
 *    standard deductions, surcharge and cess.
 *
 * No imports: scripts/test-lib.mjs runs this under Node.
 */

export interface Band {
  /** Upper edge of the band, in taxable income. */
  upTo: number;
  rate: number;
}

export interface PayLine {
  label: string;
  amount: number;
  note?: string;
}

export interface TakeHomeResult {
  gross: number;
  taxableIncome: number;
  lines: PayLine[];
  totalDeductions: number;
  net: number;
  /** Paid by the employer on top of salary; shown, not deducted. */
  extras: PayLine[];
}

export function progressiveTax(income: number, bands: Band[]): number {
  let tax = 0;
  let lower = 0;
  for (const band of bands) {
    if (income <= lower) break;
    tax += (Math.min(income, band.upTo) - lower) * band.rate;
    lower = band.upTo;
  }
  return tax;
}

function finish(gross: number, taxableIncome: number, lines: PayLine[], extras: PayLine[] = []): TakeHomeResult {
  const kept = lines.filter((line) => line.amount > 0.004);
  const totalDeductions = kept.reduce((sum, line) => sum + line.amount, 0);
  return { gross, taxableIncome, lines: kept, totalDeductions, net: gross - totalDeductions, extras };
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/* -------------------------------------------------------------------------- */
/* United Kingdom, 2026/27                                                      */
/* -------------------------------------------------------------------------- */

export const UK_2026 = {
  personalAllowance: 12_570,
  taperStart: 100_000,
  englandBands: [
    { upTo: 37_700, rate: 0.2 },
    { upTo: 125_140, rate: 0.4 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.45 },
  ],
  /** Scottish bands as taxable income: £12,571–£16,537 starter ... over £125,140 top. */
  scotlandBands: [
    { upTo: 3_967, rate: 0.19 },
    { upTo: 16_956, rate: 0.2 },
    { upTo: 31_092, rate: 0.21 },
    { upTo: 62_430, rate: 0.42 },
    { upTo: 125_140, rate: 0.45 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.48 },
  ],
  niPrimaryThreshold: 12_570,
  niUpperEarningsLimit: 50_270,
  niMainRate: 0.08,
  niUpperRate: 0.02,
  studentLoanThresholds: { plan1: 26_900, plan2: 29_385, plan4: 33_795, plan5: 25_000 },
  studentLoanRate: 0.09,
  postgraduateThreshold: 21_000,
  postgraduateRate: 0.06,
};

export type UkRegion = "england" | "scotland";
export type UkPensionType = "salary-sacrifice" | "net-pay" | "relief-at-source";
export type UkStudentLoan = "none" | "plan1" | "plan2" | "plan4" | "plan5";

export interface UkInput {
  gross: number;
  region: UkRegion;
  pensionPercent: number;
  pensionType: UkPensionType;
  studentLoan: UkStudentLoan;
  postgraduateLoan: boolean;
}

export function ukTakeHome(input: UkInput): TakeHomeResult {
  const { gross } = input;
  const pension = (gross * input.pensionPercent) / 100;
  const sacrificed = input.pensionType === "salary-sacrifice" ? pension : 0;
  const netPayRelief = input.pensionType === "net-pay" ? pension : 0;
  const reliefAtSource = input.pensionType === "relief-at-source" ? pension : 0;

  // Salary sacrifice lowers pay itself; a net pay arrangement lowers taxable pay only.
  const pay = gross - sacrificed;
  const incomeForTax = pay - netPayRelief;
  const adjustedNetIncome = incomeForTax - reliefAtSource;
  const allowance = Math.max(
    0,
    UK_2026.personalAllowance - Math.max(0, Math.floor((adjustedNetIncome - UK_2026.taperStart) / 2)),
  );
  const taxableIncome = Math.max(0, incomeForTax - allowance);
  const incomeTax = progressiveTax(taxableIncome, input.region === "scotland" ? UK_2026.scotlandBands : UK_2026.englandBands);

  const nationalInsurance =
    Math.max(0, Math.min(pay, UK_2026.niUpperEarningsLimit) - UK_2026.niPrimaryThreshold) * UK_2026.niMainRate +
    Math.max(0, pay - UK_2026.niUpperEarningsLimit) * UK_2026.niUpperRate;

  const studentLoan =
    input.studentLoan === "none"
      ? 0
      : Math.max(0, pay - UK_2026.studentLoanThresholds[input.studentLoan]) * UK_2026.studentLoanRate;
  const postgraduate = input.postgraduateLoan
    ? Math.max(0, pay - UK_2026.postgraduateThreshold) * UK_2026.postgraduateRate
    : 0;

  return finish(gross, taxableIncome, [
    { label: "Income Tax", amount: incomeTax, note: `Personal Allowance £${allowance.toLocaleString("en-GB")}` },
    { label: "National Insurance", amount: nationalInsurance },
    { label: "Student loan", amount: studentLoan },
    { label: "Postgraduate loan", amount: postgraduate },
    {
      label: "Pension contribution",
      // Relief at source: you pay 80%, and the provider claims 20% basic-rate relief on top.
      amount: input.pensionType === "relief-at-source" ? pension * 0.8 : pension,
      note:
        input.pensionType === "salary-sacrifice"
          ? "salary sacrifice"
          : input.pensionType === "net-pay"
            ? "net pay arrangement"
            : "relief at source; the provider adds 20% relief",
    },
  ]);
}

/* -------------------------------------------------------------------------- */
/* Canada, 2026 (Ontario, British Columbia, Alberta)                             */
/* -------------------------------------------------------------------------- */

export type Province = "on" | "bc" | "ab";

export const CA_2026 = {
  federalBands: [
    { upTo: 58_523, rate: 0.14 },
    { upTo: 117_045, rate: 0.205 },
    { upTo: 181_440, rate: 0.26 },
    { upTo: 258_482, rate: 0.29 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.33 },
  ],
  federalCreditRate: 0.14,
  basicPersonalAmount: { max: 16_452, min: 14_829, phaseStart: 181_440, phaseEnd: 258_482 },
  canadaEmploymentAmount: 1_501,
  cpp: { exemption: 3_500, ympe: 74_600, rate: 0.0595, baseRate: 0.0495, yampe: 85_000, cpp2Rate: 0.04 },
  ei: { maxInsurable: 68_900, rate: 0.0163 },
  provinces: {
    on: {
      name: "Ontario",
      bands: [
        { upTo: 53_891, rate: 0.0505 },
        { upTo: 107_785, rate: 0.0915 },
        { upTo: 150_000, rate: 0.1116 },
        { upTo: 220_000, rate: 0.1216 },
        { upTo: Number.POSITIVE_INFINITY, rate: 0.1316 },
      ],
      creditRate: 0.0505,
      basicPersonalAmount: 12_989,
      surtax: [
        { threshold: 5_818, rate: 0.2 },
        { threshold: 7_446, rate: 0.36 },
      ],
    },
    bc: {
      name: "British Columbia",
      bands: [
        { upTo: 50_363, rate: 0.056 },
        { upTo: 100_728, rate: 0.077 },
        { upTo: 115_648, rate: 0.105 },
        { upTo: 140_430, rate: 0.1229 },
        { upTo: 190_405, rate: 0.147 },
        { upTo: 265_545, rate: 0.168 },
        { upTo: Number.POSITIVE_INFINITY, rate: 0.205 },
      ],
      creditRate: 0.056,
      basicPersonalAmount: 13_216,
      surtax: [],
    },
    ab: {
      name: "Alberta",
      bands: [
        { upTo: 61_200, rate: 0.08 },
        { upTo: 154_259, rate: 0.1 },
        { upTo: 185_111, rate: 0.12 },
        { upTo: 246_813, rate: 0.13 },
        { upTo: 370_220, rate: 0.14 },
        { upTo: Number.POSITIVE_INFINITY, rate: 0.15 },
      ],
      creditRate: 0.08,
      basicPersonalAmount: 22_769,
      surtax: [],
    },
  },
};

/** Ontario Health Premium, charged through the tax return on taxable income. */
export function ontarioHealthPremium(taxableIncome: number): number {
  const income = taxableIncome;
  if (income <= 20_000) return 0;
  if (income <= 36_000) return Math.min(300, 0.06 * (income - 20_000));
  if (income <= 48_000) return Math.min(450, 300 + 0.06 * (income - 36_000));
  if (income <= 72_000) return Math.min(600, 450 + 0.25 * (income - 48_000));
  if (income <= 200_000) return Math.min(750, 600 + 0.25 * (income - 72_000));
  return Math.min(900, 750 + 0.25 * (income - 200_000));
}

export function caTakeHome(gross: number, province: Province): TakeHomeResult {
  const { cpp, ei } = CA_2026;
  const pensionable = Math.max(0, Math.min(gross, cpp.ympe) - cpp.exemption);
  const cpp1 = pensionable * cpp.rate;
  const cppBase = pensionable * cpp.baseRate;
  const cpp2 = Math.max(0, Math.min(gross, cpp.yampe) - cpp.ympe) * cpp.cpp2Rate;
  const eiPremium = Math.min(gross, ei.maxInsurable) * ei.rate;

  // Enhanced CPP contributions (the part above the base rate, and all of CPP2) are deducted from income.
  const taxableIncome = Math.max(0, gross - (cpp1 - cppBase) - cpp2);

  const bpa = CA_2026.basicPersonalAmount;
  const phase = clamp((taxableIncome - bpa.phaseStart) / (bpa.phaseEnd - bpa.phaseStart), 0, 1);
  const federalPersonal = bpa.max - (bpa.max - bpa.min) * phase;
  const federalCredits =
    (federalPersonal + cppBase + eiPremium + Math.min(CA_2026.canadaEmploymentAmount, gross)) * CA_2026.federalCreditRate;
  const federalTax = Math.max(0, progressiveTax(taxableIncome, CA_2026.federalBands) - federalCredits);

  const region = CA_2026.provinces[province];
  const provincialCredits = (region.basicPersonalAmount + cppBase + eiPremium) * region.creditRate;
  const basicProvincial = Math.max(0, progressiveTax(taxableIncome, region.bands) - provincialCredits);
  const surtax = region.surtax.reduce((sum, tier) => sum + Math.max(0, basicProvincial - tier.threshold) * tier.rate, 0);

  return finish(gross, taxableIncome, [
    { label: "Federal income tax", amount: federalTax },
    { label: `${region.name} income tax`, amount: basicProvincial + surtax, note: surtax > 0 ? "including surtax" : undefined },
    { label: "Ontario Health Premium", amount: province === "on" ? ontarioHealthPremium(taxableIncome) : 0 },
    { label: "CPP contributions", amount: cpp1 + cpp2, note: cpp2 > 0 ? "including CPP2" : undefined },
    { label: "EI premiums", amount: eiPremium },
  ]);
}

/* -------------------------------------------------------------------------- */
/* Australia, 2026–27 (residents)                                                */
/* -------------------------------------------------------------------------- */

export const AU_2026 = {
  bands: [
    { upTo: 18_200, rate: 0 },
    { upTo: 45_000, rate: 0.15 },
    { upTo: 135_000, rate: 0.3 },
    { upTo: 190_000, rate: 0.37 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.45 },
  ],
  medicareRate: 0.02,
  /** Latest published single low-income thresholds; indexed yearly. */
  medicareLowerThreshold: 27_222,
  medicareUpperThreshold: 34_027,
  superGuaranteeRate: 0.12,
};

export function lowIncomeTaxOffset(taxableIncome: number): number {
  if (taxableIncome <= 37_500) return 700;
  if (taxableIncome <= 45_000) return 700 - 0.05 * (taxableIncome - 37_500);
  if (taxableIncome <= 66_667) return Math.max(0, 325 - 0.015 * (taxableIncome - 45_000));
  return 0;
}

export function medicareLevy(taxableIncome: number): number {
  // The shade-in ends where 10% of the excess reaches 2% of income: the published upper threshold.
  const { medicareLowerThreshold: lower, medicareRate } = AU_2026;
  if (taxableIncome <= lower) return 0;
  return Math.min(0.1 * (taxableIncome - lower), medicareRate * taxableIncome);
}

/** Study and training loan compulsory repayment, marginal system, 2026–27. */
export function helpRepayment(repaymentIncome: number): number {
  if (repaymentIncome <= 69_528) return 0;
  if (repaymentIncome <= 129_717) return 0.15 * (repaymentIncome - 69_528);
  if (repaymentIncome <= 186_050) return 9_028 + 0.17 * (repaymentIncome - 129_717);
  return 0.1 * repaymentIncome;
}

export function auTakeHome(gross: number, hasHelpDebt: boolean): TakeHomeResult {
  const incomeTax = Math.max(0, progressiveTax(gross, AU_2026.bands) - lowIncomeTaxOffset(gross));
  return finish(
    gross,
    gross,
    [
      { label: "Income tax", amount: incomeTax, note: "after the low income tax offset" },
      { label: "Medicare levy", amount: medicareLevy(gross) },
      { label: "HELP repayment", amount: hasHelpDebt ? helpRepayment(gross) : 0 },
    ],
    [{ label: "Employer super (12%, paid on top)", amount: gross * AU_2026.superGuaranteeRate }],
  );
}

/* -------------------------------------------------------------------------- */
/* India, FY 2026–27                                                             */
/* -------------------------------------------------------------------------- */

export type IndiaRegime = "new" | "old";

export const IN_2026 = {
  new: {
    standardDeduction: 75_000,
    bands: [
      { upTo: 400_000, rate: 0 },
      { upTo: 800_000, rate: 0.05 },
      { upTo: 1_200_000, rate: 0.1 },
      { upTo: 1_600_000, rate: 0.15 },
      { upTo: 2_000_000, rate: 0.2 },
      { upTo: 2_400_000, rate: 0.25 },
      { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
    ],
    rebateLimit: 1_200_000,
    surcharge: [
      { threshold: 5_000_000, rate: 0.1 },
      { threshold: 10_000_000, rate: 0.15 },
      { threshold: 20_000_000, rate: 0.25 },
    ],
  },
  old: {
    standardDeduction: 50_000,
    bands: [
      { upTo: 250_000, rate: 0 },
      { upTo: 500_000, rate: 0.05 },
      { upTo: 1_000_000, rate: 0.2 },
      { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
    ],
    rebateLimit: 500_000,
    surcharge: [
      { threshold: 5_000_000, rate: 0.1 },
      { threshold: 10_000_000, rate: 0.15 },
      { threshold: 20_000_000, rate: 0.25 },
      { threshold: 50_000_000, rate: 0.37 },
    ],
  },
  cess: 0.04,
};

/** Slab tax after the section 87A rebate, with the new regime's marginal relief just above ₹12 lakh. */
export function indiaSlabTax(taxableIncome: number, regime: IndiaRegime): number {
  const rules = IN_2026[regime];
  const tax = progressiveTax(taxableIncome, rules.bands);
  if (taxableIncome <= rules.rebateLimit) return 0;
  return regime === "new" ? Math.min(tax, taxableIncome - rules.rebateLimit) : tax;
}

/** Surcharge with marginal relief: crossing a threshold can never cost more than the income above it. */
export function indiaSurcharge(taxableIncome: number, regime: IndiaRegime): number {
  const tiers = IN_2026[regime].surcharge;
  const index = tiers.findLastIndex((tier) => taxableIncome > tier.threshold);
  if (index === -1) return 0;
  const tier = tiers[index];
  const tax = indiaSlabTax(taxableIncome, regime);
  const surcharge = tax * tier.rate;
  const belowRate = index > 0 ? tiers[index - 1].rate : 0;
  const atThreshold = indiaSlabTax(tier.threshold, regime) * (1 + belowRate);
  const ceiling = atThreshold + (taxableIncome - tier.threshold);
  return Math.max(0, Math.min(surcharge, ceiling - tax));
}

export interface IndiaInput {
  gross: number;
  regime: IndiaRegime;
  /** Old regime only: 80C, 80D, HRA exemption and similar, in rupees. */
  deductions: number;
  employeePf: number;
  professionalTax: number;
}

export function inTakeHome(input: IndiaInput): TakeHomeResult {
  const rules = IN_2026[input.regime];
  const taxableIncome =
    input.regime === "new"
      ? Math.max(0, input.gross - rules.standardDeduction)
      : Math.max(0, input.gross - rules.standardDeduction - input.professionalTax - input.deductions);

  const tax = indiaSlabTax(taxableIncome, input.regime);
  const surcharge = indiaSurcharge(taxableIncome, input.regime);
  const cess = (tax + surcharge) * IN_2026.cess;

  return finish(input.gross, taxableIncome, [
    { label: "Income tax", amount: tax },
    { label: "Surcharge", amount: surcharge },
    { label: "Health and education cess (4%)", amount: cess },
    { label: "Employee provident fund", amount: input.employeePf },
    { label: "Professional tax", amount: input.professionalTax },
  ]);
}
