import { describe, expect, it } from "vitest";
import { benefitSchema, benefitUpdateSchema, cardSchema, cardUpdateSchema, rewardCategorySchema, transactionSchema, transactionUpdateSchema } from "@/lib/validation";

describe("partial updates", () => {
  it("does not populate card creation defaults", () => {
    expect(cardUpdateSchema.parse({ name: "Renamed" })).toEqual({ name: "Renamed" });
  });
  it("does not post a pending transaction or clear a refund implicitly", () => {
    expect(transactionUpdateSchema.parse({ merchant: "Corrected" })).toEqual({ merchant: "Corrected" });
  });
  it("does not reset benefit usage or activation", () => {
    expect(benefitUpdateSchema.parse({ name: "Renamed" })).toEqual({ name: "Renamed" });
  });
  it("distinguishes an omitted date from a cleared date", () => {
    expect(cardUpdateSchema.parse({ openedAt: null })).toEqual({ openedAt: null });
    expect(cardUpdateSchema.parse({})).toEqual({});
  });
});

describe("financial input validation", () => {
  const purchase = { cardId: "card", merchant: "Shop", amount: 0.29, category: "dining", transactionDate: "2026-09-05" };
  it("accepts cents but rejects sub-cent amounts, non-finite values, and unsafe numbers", () => {
    expect(transactionSchema.parse(purchase).amount).toBe(0.29);
    for (const amount of [0.001, Infinity, NaN, Number.MAX_SAFE_INTEGER, true, null]) {
      expect(transactionSchema.safeParse({ ...purchase, amount }).success).toBe(false);
    }
  });
  it("rejects impossible calendar dates", () => {
    expect(transactionSchema.safeParse({ ...purchase, transactionDate: "2026-02-30" }).success).toBe(false);
  });
  it("preserves credit balances", () => {
    expect(cardSchema.shape.currentBalance.parse(-50)).toBe(-50);
  });
  it("rejects backwards promotion windows", () => {
    expect(rewardCategorySchema.safeParse({ category: "dining", multiplier: 3, startDate: "2026-09-10", endDate: "2026-09-01" }).success).toBe(false);
  });
  it("rejects benefit usage beyond total and backwards validity windows", () => {
    const benefit = { name: "Credit", benefitType: "dining_credit", totalValue: 10, resetFrequency: "monthly", startDate: "2026-09-05" };
    expect(benefitSchema.safeParse({ ...benefit, usedValue: 11 }).success).toBe(false);
    expect(benefitSchema.safeParse({ ...benefit, expirationDate: "2026-09-04" }).success).toBe(false);
  });
});
