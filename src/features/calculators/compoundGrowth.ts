export type CompoundGrowthInput = {
  initialAmount: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
};

export type CompoundGrowthResult = {
  endingBalance: number;
  totalContributions: number;
  estimatedGrowth: number;
  months: number;
};

export const COMPOUND_GROWTH_MAX_RATE_PERCENT = 1_000;
export const COMPOUND_GROWTH_MAX_YEARS = 100;

function roundToCents(value: number): number {
  const scaledValue = value * 100;
  // At the edge of the representable range, multiplying by 100 can overflow
  // even though the original finite value is still a valid calculation result.
  return Number.isFinite(scaledValue) ? Math.round(scaledValue) / 100 : value;
}

export function calculateCompoundGrowth(input: CompoundGrowthInput): CompoundGrowthResult {
  const { initialAmount, monthlyContribution, annualRatePercent, years } = input;
  if (![initialAmount, monthlyContribution, annualRatePercent, years].every(Number.isFinite)) {
    throw new Error("Compound growth inputs must be finite numbers.");
  }
  if (initialAmount < 0 || monthlyContribution < 0 || years < 0) {
    throw new Error("Amounts and years cannot be negative.");
  }
  if (annualRatePercent > COMPOUND_GROWTH_MAX_RATE_PERCENT) {
    throw new Error(`Annual rate must be ${COMPOUND_GROWTH_MAX_RATE_PERCENT}% or lower.`);
  }
  if (years > COMPOUND_GROWTH_MAX_YEARS) {
    throw new Error(`Years must be ${COMPOUND_GROWTH_MAX_YEARS} or lower.`);
  }
  if (annualRatePercent <= -1200) {
    throw new Error("Annual rate must be greater than -1200 percent.");
  }
  const months = Math.round(years * 12);
  const monthlyRate = annualRatePercent / 100 / 12;
  const growthFactor = (1 + monthlyRate) ** months;
  const contributionGrowth = monthlyRate === 0
    ? monthlyContribution * months
    : monthlyContribution * ((growthFactor - 1) / monthlyRate);
  const endingBalance = initialAmount * growthFactor + contributionGrowth;
  const totalContributions = initialAmount + monthlyContribution * months;
  const estimatedGrowth = endingBalance - totalContributions;
  if (![months, monthlyRate, growthFactor, contributionGrowth, endingBalance, totalContributions, estimatedGrowth].every(Number.isFinite)) {
    throw new Error("Compound growth calculation exceeded the supported numeric range.");
  }
  return {
    endingBalance: roundToCents(endingBalance),
    totalContributions: roundToCents(totalContributions),
    estimatedGrowth: roundToCents(estimatedGrowth),
    months,
  };
}
