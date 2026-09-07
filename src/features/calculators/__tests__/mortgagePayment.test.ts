import { describe, expect, it } from "vitest";
import { calculateMortgagePayment } from "@/features/calculators/mortgagePayment";

describe("calculateMortgagePayment", () => {
  it("calculates principal and interest for a standard loan", () => {
    const result = calculateMortgagePayment({ principal: 100000, annualRatePercent: 6, years: 30 });
    expect(result.payments).toBe(360);
    expect(result.monthlyPrincipalAndInterest).toBe(599.55);
    expect(result.totalInterest).toBe(115838.19);
  });

  it("handles a zero-rate loan", () => {
    expect(calculateMortgagePayment({ principal: 12000, annualRatePercent: 0, years: 1 }).monthlyPrincipalAndInterest).toBe(1000);
  });

  it("rejects negative inputs", () => {
    expect(() => calculateMortgagePayment({ principal: -1, annualRatePercent: 6, years: 30 })).toThrow();
  });

  it("rejects a zero-length mortgage term with a clear validation error", () => {
    expect(() => calculateMortgagePayment({ principal: 100000, annualRatePercent: 6, years: 0 }))
      .toThrow("Mortgage term must be greater than zero.");
  });

  it("preserves aggregate totals for a tiny zero-rate principal", () => {
    expect(calculateMortgagePayment({ principal: 0.01, annualRatePercent: 0, years: 1 })).toMatchObject({
      monthlyPrincipalAndInterest: 0,
      totalPayments: 0.01,
      totalInterest: 0,
    });
  });

  it("rejects a term that rounds to fewer than one monthly payment", () => {
    expect(() => calculateMortgagePayment({ principal: 100000, annualRatePercent: 6, years: 0.01 }))
      .toThrow("Mortgage term must represent at least one monthly payment.");
  });
});
