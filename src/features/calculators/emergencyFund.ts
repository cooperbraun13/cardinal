export type EmergencyFundInput = {
  monthlyEssentialExpenses: number;
  targetMonths: number;
  currentSavings: number;
};

export type EmergencyFundResult = {
  targetAmount: number;
  currentSavings: number;
  remainingGap: number;
};

const roundToCents = (value: number) => {
  const scaledValue = value * 100;
  if (!Number.isFinite(scaledValue)) {
    throw new Error("Emergency-fund calculation exceeded the supported numeric range.");
  }
  const roundedValue = Math.round(scaledValue) / 100;
  if (!Number.isFinite(roundedValue)) {
    throw new Error("Emergency-fund calculation exceeded the supported numeric range.");
  }
  return roundedValue;
};

export function calculateEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const { monthlyEssentialExpenses, targetMonths, currentSavings } = input;
  if (![monthlyEssentialExpenses, targetMonths, currentSavings].every(Number.isFinite)) {
    throw new Error("Emergency-fund inputs must be finite numbers.");
  }
  if (monthlyEssentialExpenses < 0 || targetMonths < 0 || currentSavings < 0) {
    throw new Error("Emergency-fund inputs cannot be negative.");
  }
  const targetAmountBeforeRounding = monthlyEssentialExpenses * targetMonths;
  if (!Number.isFinite(targetAmountBeforeRounding)) {
    throw new Error("Emergency-fund calculation exceeded the supported numeric range.");
  }
  const targetAmount = roundToCents(targetAmountBeforeRounding);
  const roundedCurrentSavings = roundToCents(currentSavings);
  const remainingGap = roundToCents(Math.max(0, targetAmount - roundedCurrentSavings));
  return { targetAmount, currentSavings: roundedCurrentSavings, remainingGap };
}
