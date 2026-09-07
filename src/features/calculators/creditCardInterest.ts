export type CreditCardInterestInput = {
  balance: number;
  aprPercent: number;
  days: number;
};

export type CreditCardInterestResult = {
  estimatedInterest: number;
  endingBalance: number;
};

const roundToCents = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  if (!Number.isFinite(rounded)) throw new Error("Credit-card interest result is outside the supported range.");
  return rounded;
};

export function estimateCreditCardInterest(input: CreditCardInterestInput): CreditCardInterestResult {
  const { balance, aprPercent, days } = input;
  if (![balance, aprPercent, days].every(Number.isFinite)) throw new Error("Credit-card interest inputs must be finite numbers.");
  if (balance < 0 || aprPercent < 0 || days < 0) throw new Error("Credit-card interest inputs cannot be negative.");
  const estimatedInterest = roundToCents(balance * (aprPercent / 100) * (days / 365));
  return { estimatedInterest, endingBalance: roundToCents(balance + estimatedInterest) };
}
