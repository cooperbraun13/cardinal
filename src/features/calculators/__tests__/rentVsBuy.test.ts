import { describe, expect, it } from "vitest";
import { compareRentVsBuy } from "@/features/calculators/rentVsBuy";

describe("compareRentVsBuy", () => {
  it("compares simplified rent and buy totals", () => {
    const result = compareRentVsBuy({ monthlyRent: 2000, homePrice: 300000, downPayment: 60000, mortgageRatePercent: 6, years: 30, annualPropertyTaxAndInsurance: 6000 });
    expect(result.totalRent).toBe(720000);
    expect(result.totalBuyCashPaid).toBeGreaterThan(0);
    expect(result.difference).toBeCloseTo(result.totalRent - result.totalBuyCashPaid, 2);
  });

  it("rejects a down payment above the home price", () => {
    expect(() => compareRentVsBuy({ monthlyRent: 2000, homePrice: 100000, downPayment: 100001, mortgageRatePercent: 6, years: 30, annualPropertyTaxAndInsurance: 3000 })).toThrow();
  });

  it("rejects invalid and zero-term inputs", () => {
    expect(() => compareRentVsBuy({ monthlyRent: Number.NaN, homePrice: 100000, downPayment: 10000, mortgageRatePercent: 0, years: 1, annualPropertyTaxAndInsurance: 0 })).toThrow();
    expect(() => compareRentVsBuy({ monthlyRent: 1000, homePrice: 100000, downPayment: 10000, mortgageRatePercent: 0, years: 0, annualPropertyTaxAndInsurance: 0 })).toThrow();
  });
});
