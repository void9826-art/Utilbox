/**
 * Money arithmetic.
 *
 * Amortisation schedules are built from integer minor units (cents/paise) so
 * the rows always add back up to the principal — accumulating rounded floats
 * drifts by a few cents over a 30-year term, which shows up in the totals.
 *
 * Rates and exponents still use IEEE-754 doubles, because compound interest is
 * defined in terms of real-valued powers. Only the *money* is kept exact.
 */

const MINOR_UNITS = 100;

export function toMinor(amount: number): number {
  return Math.round(amount * MINOR_UNITS);
}

export function fromMinor(minor: number): number {
  return minor / MINOR_UNITS;
}

/** Half-up rounding: 2.005 → 2.01, matching how invoices are normally read. */
export function roundMoney(amount: number): number {
  const scaled = amount * MINOR_UNITS;
  const rounded = Math.sign(scaled) * Math.round(Math.abs(scaled) + Number.EPSILON * Math.abs(scaled));
  return rounded / MINOR_UNITS;
}

export function formatMoney(amount: number, currency = "USD", locale?: string): string {
  if (!Number.isFinite(amount)) return "—";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export interface AmortisationRow {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface AmortisationResult {
  /** The level payment charged every period. */
  payment: number;
  totalPaid: number;
  totalInterest: number;
  rows: AmortisationRow[];
}

/**
 * Standard level-payment (annuity) amortisation.
 *
 * @param principal      Amount borrowed, in major units.
 * @param periodRate     Interest rate per period as a decimal (0.01 = 1%).
 * @param periods        Total number of payments.
 */
export function amortise(principal: number, periodRate: number, periods: number): AmortisationResult {
  const wholePeriods = Math.max(1, Math.round(periods));
  const principalMinor = toMinor(principal);

  const paymentMinor =
    periodRate === 0
      ? Math.round(principalMinor / wholePeriods)
      : Math.round(
          (principalMinor * periodRate * (1 + periodRate) ** wholePeriods) /
            ((1 + periodRate) ** wholePeriods - 1),
        );

  const rows: AmortisationRow[] = [];
  let balanceMinor = principalMinor;
  let totalPaidMinor = 0;
  let totalInterestMinor = 0;

  for (let period = 1; period <= wholePeriods; period += 1) {
    const interestMinor = Math.round(balanceMinor * periodRate);
    let principalPartMinor = paymentMinor - interestMinor;
    let actualPaymentMinor = paymentMinor;

    // The final instalment absorbs the rounding remainder so the balance
    // lands on exactly zero.
    if (period === wholePeriods || principalPartMinor >= balanceMinor) {
      principalPartMinor = balanceMinor;
      actualPaymentMinor = balanceMinor + interestMinor;
    }

    balanceMinor -= principalPartMinor;
    totalPaidMinor += actualPaymentMinor;
    totalInterestMinor += interestMinor;

    rows.push({
      period,
      payment: fromMinor(actualPaymentMinor),
      interest: fromMinor(interestMinor),
      principal: fromMinor(principalPartMinor),
      balance: fromMinor(Math.max(0, balanceMinor)),
    });

    if (balanceMinor <= 0) break;
  }

  return {
    payment: fromMinor(paymentMinor),
    totalPaid: fromMinor(totalPaidMinor),
    totalInterest: fromMinor(totalInterestMinor),
    rows,
  };
}

export interface GrowthRow {
  period: number;
  contributions: number;
  interest: number;
  balance: number;
}

/**
 * Compound growth with optional level contributions.
 *
 * @param principal            Opening balance.
 * @param annualRate           Nominal annual rate as a decimal.
 * @param years                Length of the projection.
 * @param compoundsPerYear     Compounding frequency.
 * @param contribution         Amount added at each contribution date.
 * @param contributionsPerYear How often contributions are made.
 * @param contributeAtStart    Deposit before interest is applied for the period.
 */
export function compoundGrowth(options: {
  principal: number;
  annualRate: number;
  years: number;
  compoundsPerYear: number;
  contribution?: number;
  contributionsPerYear?: number;
  contributeAtStart?: boolean;
}): { finalBalance: number; totalContributed: number; totalInterest: number; rows: GrowthRow[] } {
  const {
    principal,
    annualRate,
    years,
    compoundsPerYear,
    contribution = 0,
    contributionsPerYear = 0,
    contributeAtStart = false,
  } = options;

  // Step through the finer of the two schedules so both land on exact dates.
  const stepsPerYear = Math.max(compoundsPerYear, contributionsPerYear || 1, 1);
  const totalSteps = Math.round(stepsPerYear * years);
  const ratePerCompound = annualRate / compoundsPerYear;

  let balanceMinor = toMinor(principal);
  let contributedMinor = 0;
  let interestMinor = 0;
  const rows: GrowthRow[] = [];

  let yearContributionMinor = 0;
  let yearInterestMinor = 0;

  for (let step = 1; step <= totalSteps; step += 1) {
    const depositDue =
      contribution > 0 &&
      contributionsPerYear > 0 &&
      (step * contributionsPerYear) % stepsPerYear === 0;

    if (depositDue && contributeAtStart) {
      const deposit = toMinor(contribution);
      balanceMinor += deposit;
      contributedMinor += deposit;
      yearContributionMinor += deposit;
    }

    if ((step * compoundsPerYear) % stepsPerYear === 0) {
      const gain = Math.round(balanceMinor * ratePerCompound);
      balanceMinor += gain;
      interestMinor += gain;
      yearInterestMinor += gain;
    }

    if (depositDue && !contributeAtStart) {
      const deposit = toMinor(contribution);
      balanceMinor += deposit;
      contributedMinor += deposit;
      yearContributionMinor += deposit;
    }

    if (step % stepsPerYear === 0 || step === totalSteps) {
      rows.push({
        period: Math.ceil(step / stepsPerYear),
        contributions: fromMinor(yearContributionMinor),
        interest: fromMinor(yearInterestMinor),
        balance: fromMinor(balanceMinor),
      });
      yearContributionMinor = 0;
      yearInterestMinor = 0;
    }
  }

  if (rows.length === 0) {
    rows.push({ period: 0, contributions: 0, interest: 0, balance: fromMinor(balanceMinor) });
  }

  return {
    finalBalance: fromMinor(balanceMinor),
    totalContributed: fromMinor(contributedMinor),
    totalInterest: fromMinor(interestMinor),
    rows,
  };
}
