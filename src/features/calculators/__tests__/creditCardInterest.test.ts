import { describe, expect, it } from "vitest";
import { estimateCreditCardInterest } from "@/features/calculators/creditCardInterest";

describe("estimateCreditCardInterest", () => {
  it("estimates daily simple interest and rounds to cents", () => {
    expect(estimateCreditCardInterest({ balance: 1000, aprPercent: 24, days: 30 })).toEqual({ estimatedInterest: 19.73, endingBalance: 1019.73 });
  });

  it("returns no interest for a zero balance or APR", () => {
    expect(estimateCreditCardInterest({ balance: 0, aprPercent: 24, days: 30 }).estimatedInterest).toBe(0);
    expect(estimateCreditCardInterest({ balance: 1000, aprPercent: 0, days: 30 }).estimatedInterest).toBe(0);
  });

  it("rejects negative inputs", () => {
    expect(() => estimateCreditCardInterest({ balance: -1, aprPercent: 24, days: 30 })).toThrow();
  });
});
