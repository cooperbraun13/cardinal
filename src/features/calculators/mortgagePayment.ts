export type MortgagePaymentInput = { principal: number; annualRatePercent: number; years: number };
export type MortgagePaymentResult = { monthlyPrincipalAndInterest: number; totalPayments: number; totalInterest: number; payments: number };

const roundToCents = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  if (!Number.isFinite(rounded)) throw new Error("Mortgage result is outside the supported range.");
  return rounded;
};

export function calculateMortgagePayment(input: MortgagePaymentInput): MortgagePaymentResult {
  const { principal, annualRatePercent, years } = input;
  if (![principal, annualRatePercent, years].every(Number.isFinite)) throw new Error("Mortgage inputs must be finite numbers.");
  if (years <= 0) throw new Error("Mortgage term must be greater than zero.");
  if (principal < 0 || annualRatePercent < 0) throw new Error("Mortgage inputs cannot be negative.");
  const payments = Math.round(years * 12);
  if (payments < 1) throw new Error("Mortgage term must represent at least one monthly payment.");
  const monthlyRate = annualRatePercent / 100 / 12;
  const monthlyPrincipalAndInterest = monthlyRate === 0
    ? principal / payments
    : principal * (monthlyRate * (1 + monthlyRate) ** payments) / ((1 + monthlyRate) ** payments - 1);
  if (!Number.isFinite(monthlyPrincipalAndInterest)) throw new Error("Mortgage result is outside the supported range.");
  const monthly = roundToCents(monthlyPrincipalAndInterest);
  const unroundedTotalPayments = monthlyPrincipalAndInterest * payments;
  return {
    monthlyPrincipalAndInterest: monthly,
    totalPayments: roundToCents(unroundedTotalPayments),
    totalInterest: roundToCents(unroundedTotalPayments - principal),
    payments,
  };
}
