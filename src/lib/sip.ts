/**
 * SIP (systematic investment plan) projections: a fixed monthly investment
 * growing at an assumed annual return, with an optional yearly step-up.
 *
 * The monthly rate is the annual rate ÷ 12 and each instalment is invested at
 * the start of its month — the convention most fund-house SIP calculators
 * use, which gives FV = P × ((1 + i)ⁿ − 1) ÷ i × (1 + i). Returns from real
 * funds vary from year to year; this is arithmetic, not a forecast.
 */

export interface SipInput {
  monthly: number;
  /** Expected annual return, as a percentage such as 12. */
  annualReturn: number;
  years: number;
  /** Yearly increase in the monthly amount, as a percentage. 0 for none. */
  stepUp: number;
}

export interface SipYear {
  year: number;
  invested: number;
  value: number;
}

export interface SipResult {
  invested: number;
  value: number;
  gains: number;
  rows: SipYear[];
}

export function sipProjection(input: SipInput): SipResult | null {
  const { monthly, annualReturn, years, stepUp } = input;
  if (!(monthly > 0) || !(annualReturn > -100) || !(years > 0) || years > 60 || !(stepUp >= 0)) return null;
  const months = Math.round(years * 12);
  const rate = annualReturn / 100 / 12;
  let value = 0;
  let invested = 0;
  let instalment = monthly;
  const rows: SipYear[] = [];
  for (let month = 1; month <= months; month += 1) {
    if (month > 1 && (month - 1) % 12 === 0) instalment *= 1 + stepUp / 100;
    value = (value + instalment) * (1 + rate);
    invested += instalment;
    if (month % 12 === 0 || month === months) rows.push({ year: Math.ceil(month / 12), invested, value });
  }
  return { invested, value, gains: value - invested, rows };
}

/** The closed-form future value for a level SIP, used to check the loop. */
export function sipFutureValue(monthly: number, annualReturn: number, years: number): number {
  const rate = annualReturn / 100 / 12;
  const months = Math.round(years * 12);
  if (rate === 0) return monthly * months;
  return monthly * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
}
