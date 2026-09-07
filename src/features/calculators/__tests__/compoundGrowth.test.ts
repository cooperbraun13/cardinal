import { describe, expect, it } from "vitest";
import { calculateCompoundGrowth } from "@/features/calculators/compoundGrowth";

describe("calculateCompoundGrowth", () => {
  it("handles zero growth without losing contributions", () => {
    expect(calculateCompoundGrowth({ initialAmount: 100, monthlyContribution: 25, annualRatePercent: 0, years: 1 })).toEqual({
      endingBalance: 400,
      totalContributions: 400,
      estimatedGrowth: 0,
      months: 12,
    });
  });

  it("separates contributions from estimated growth", () => {
    const result = calculateCompoundGrowth({ initialAmount: 1000, monthlyContribution: 100, annualRatePercent: 6, years: 10 });
    expect(result.totalContributions).toBe(13000);
    expect(result.endingBalance).toBeGreaterThan(result.totalContributions);
    expect(result.estimatedGrowth).toBeCloseTo(result.endingBalance - result.totalContributions);
  });

  it("rounds monetary outputs to cents", () => {
    const result = calculateCompoundGrowth({ initialAmount: 100, monthlyContribution: 0, annualRatePercent: 5, years: 1 });
    expect(result).toEqual({
      endingBalance: 105.12,
      totalContributions: 100,
      estimatedGrowth: 5.12,
      months: 12,
    });
  });

  it("rejects negative amounts", () => {
    expect(() => calculateCompoundGrowth({ initialAmount: -1, monthlyContribution: 0, annualRatePercent: 5, years: 1 })).toThrow();
  });

  it("rejects rates that make the monthly growth base invalid", () => {
    expect(() => calculateCompoundGrowth({ initialAmount: 100, monthlyContribution: 0, annualRatePercent: -1200, years: 1 })).toThrow();
  });

  it("rejects calculations that overflow the numeric range", () => {
    expect(() => calculateCompoundGrowth({ initialAmount: 1, monthlyContribution: 0, annualRatePercent: 5, years: Number.MAX_VALUE })).toThrow();
  });

  it("returns finite monetary outputs", () => {
    const result = calculateCompoundGrowth({ initialAmount: 100, monthlyContribution: 10, annualRatePercent: 8, years: 5 });
    expect(Number.isFinite(result.endingBalance)).toBe(true);
    expect(Number.isFinite(result.totalContributions)).toBe(true);
    expect(Number.isFinite(result.estimatedGrowth)).toBe(true);
  });

  it("keeps very large finite balances finite when cents rounding would overflow", () => {
    const initialAmount = Number.MAX_VALUE / 2;
    const result = calculateCompoundGrowth({ initialAmount, monthlyContribution: 0, annualRatePercent: 0, years: 0 });
    expect(result.endingBalance).toBe(initialAmount);
    expect(Number.isFinite(result.endingBalance)).toBe(true);
    expect(Number.isFinite(result.totalContributions)).toBe(true);
    expect(Number.isFinite(result.estimatedGrowth)).toBe(true);
  });
});
