import { describe, expect, it } from "vitest";
import { compareRothTraditional } from "@/features/calculators/rothTraditional";

describe("compareRothTraditional", () => {
  it("compares the simplified after-tax values at two rates", () => {
    expect(compareRothTraditional({ grossContribution: 10000, currentTaxRatePercent: 24, futureTaxRatePercent: 18 })).toEqual({
      rothAfterTaxValue: 7600,
      traditionalAfterTaxValue: 8200,
      difference: -600,
    });
  });

  it("rejects rates outside zero to one hundred percent", () => {
    expect(() => compareRothTraditional({ grossContribution: 100, currentTaxRatePercent: 101, futureTaxRatePercent: 20 })).toThrow();
  });

  it("supports zero tax rates without changing the gross amount", () => {
    expect(compareRothTraditional({ grossContribution: 1250, currentTaxRatePercent: 0, futureTaxRatePercent: 0 })).toEqual({
      rothAfterTaxValue: 1250,
      traditionalAfterTaxValue: 1250,
      difference: 0,
    });
  });

  it("rejects non-finite, negative, and missing gross amounts", () => {
    expect(() => compareRothTraditional({ grossContribution: Number.NaN, currentTaxRatePercent: 20, futureTaxRatePercent: 20 })).toThrow();
    expect(() => compareRothTraditional({ grossContribution: -1, currentTaxRatePercent: 20, futureTaxRatePercent: 20 })).toThrow();
    expect(() => compareRothTraditional({ grossContribution: Number.POSITIVE_INFINITY, currentTaxRatePercent: 20, futureTaxRatePercent: 20 })).toThrow();
  });

  it("rejects results that overflow the supported numeric range", () => {
    expect(() => compareRothTraditional({ grossContribution: Number.MAX_VALUE, currentTaxRatePercent: 0, futureTaxRatePercent: 0 })).toThrow();
  });
});
