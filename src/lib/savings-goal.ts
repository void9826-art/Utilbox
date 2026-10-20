/**
 * Savings goals: the monthly deposit needed to reach a target by a date, or
 * the months needed at a given deposit. Interest is compounded monthly at the
 * annual rate ÷ 12 and deposits are made at the end of each month.
 */

function growth(rate: number, months: number): number {
  return Math.pow(1 + rate, months);
}

/** Monthly deposit that turns `current` into `target` in `months`. 0 if no saving is needed. */
export function monthlyDepositNeeded(target: number, current: number, annualRate: number, months: number): number | null {
  if (!(target > 0) || !(current >= 0) || !(months >= 1) || !(annualRate > -100)) return null;
  const rate = annualRate / 1200;
  const n = Math.round(months);
  const fromCurrent = current * growth(rate, n);
  if (fromCurrent >= target) return 0;
  const shortfall = target - fromCurrent;
  if (rate === 0) return shortfall / n;
  return (shortfall * rate) / (growth(rate, n) - 1);
}

/** Whole months until the balance reaches `target`, or null if it never does within 100 years. */
export function monthsToGoal(target: number, current: number, monthly: number, annualRate: number): number | null {
  if (!(target > 0) || !(current >= 0) || !(monthly >= 0)) return null;
  const rate = annualRate / 1200;
  let balance = current;
  for (let month = 0; month <= 1200; month += 1) {
    if (balance >= target - 1e-9) return month;
    balance = balance * (1 + rate) + monthly;
  }
  return null;
}

export interface GoalRow {
  month: number;
  deposited: number;
  interest: number;
  balance: number;
}

export function goalSchedule(current: number, monthly: number, annualRate: number, months: number): GoalRow[] {
  const rate = annualRate / 1200;
  let balance = current;
  let deposited = current;
  const rows: GoalRow[] = [];
  for (let month = 1; month <= Math.round(months); month += 1) {
    balance = balance * (1 + rate) + monthly;
    deposited += monthly;
    if (month % 12 === 0 || month === Math.round(months)) {
      rows.push({ month, deposited, interest: balance - deposited, balance });
    }
  }
  return rows;
}
