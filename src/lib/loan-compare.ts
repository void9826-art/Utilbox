/**
 * Side-by-side loan comparison: level monthly payment, total interest, fees
 * and an APR-style rate that folds the up-front fees into the cost.
 */

export interface LoanOffer {
  amount: number;
  /** Nominal annual interest rate, percent. */
  annualRate: number;
  months: number;
  /** Arrangement or processing fees paid up front or added to the cost. */
  fees: number;
}

export interface LoanSummary {
  payment: number;
  totalRepaid: number;
  totalInterest: number;
  totalCost: number;
  /** Annual rate at which the amount actually received equals the payments; percent. */
  aprWithFees: number;
}

export function levelPayment(amount: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return amount / months;
  const growth = Math.pow(1 + monthlyRate, months);
  return (amount * monthlyRate * growth) / (growth - 1);
}

/** Present value of `months` payments at a monthly rate. */
function presentValue(payment: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return payment * months;
  return (payment * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate;
}

/**
 * The monthly rate at which the payments are worth exactly the money you
 * receive after fees, found by bisection, times 12 — the nominal APR
 * convention used for US Truth in Lending disclosures. Other countries
 * compound it (UK APR), which gives a slightly higher figure.
 */
export function aprWithFees(offer: LoanOffer): number {
  const payment = levelPayment(offer.amount, offer.annualRate / 1200, offer.months);
  const received = offer.amount - offer.fees;
  if (received <= 0) return NaN;
  let low = 0;
  let high = 1;
  for (let step = 0; step < 200; step += 1) {
    const mid = (low + high) / 2;
    if (presentValue(payment, mid, offer.months) > received) low = mid;
    else high = mid;
  }
  return ((low + high) / 2) * 1200;
}

export function summariseLoan(offer: LoanOffer): LoanSummary | null {
  if (!(offer.amount > 0) || !(offer.annualRate >= 0) || !(offer.months >= 1) || !(offer.fees >= 0) || offer.fees >= offer.amount) {
    return null;
  }
  const months = Math.round(offer.months);
  const payment = levelPayment(offer.amount, offer.annualRate / 1200, months);
  const totalRepaid = payment * months;
  const totalInterest = totalRepaid - offer.amount;
  return {
    payment,
    totalRepaid,
    totalInterest,
    totalCost: totalInterest + offer.fees,
    aprWithFees: offer.fees > 0 ? aprWithFees({ ...offer, months }) : offer.annualRate,
  };
}
