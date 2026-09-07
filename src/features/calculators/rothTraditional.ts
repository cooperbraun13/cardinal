/**
 * A simplified comparison using the same gross, pre-tax amount for both
 * account scenarios. Tax rates are treated as marginal rates for illustration.
 */
export type RothTraditionalInput = {
  grossContribution: number;
  currentTaxRatePercent: number;
  futureTaxRatePercent: number;
};
export type RothTraditionalResult = { rothAfterTaxValue: number; traditionalAfterTaxValue: number; difference: number };

const roundToCents = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  if (!Number.isFinite(rounded)) throw new Error("Roth comparison result is outside the supported range.");
  return rounded;
};

export function compareRothTraditional(input: RothTraditionalInput): RothTraditionalResult {
  const { grossContribution, currentTaxRatePercent, futureTaxRatePercent } = input;
  if (![grossContribution, currentTaxRatePercent, futureTaxRatePercent].every(Number.isFinite)) throw new Error("Roth comparison inputs must be finite numbers.");
  if (grossContribution < 0 || currentTaxRatePercent < 0 || currentTaxRatePercent > 100 || futureTaxRatePercent < 0 || futureTaxRatePercent > 100) throw new Error("Roth comparison inputs are outside the supported range.");
  const rothAfterTaxValue = roundToCents(grossContribution * (1 - currentTaxRatePercent / 100));
  const traditionalAfterTaxValue = roundToCents(grossContribution * (1 - futureTaxRatePercent / 100));
  return { rothAfterTaxValue, traditionalAfterTaxValue, difference: roundToCents(rothAfterTaxValue - traditionalAfterTaxValue) };
}
