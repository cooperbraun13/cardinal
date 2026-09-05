import { describe, expect, it } from "vitest";
import { countsTowardCap, evaluatePurchase, type RewardRule } from "@/services/rewards";
import { rankCards } from "@/services/recommend";

const date = new Date("2026-08-15");
const promo: RewardRule = { category: "dining", multiplier: 5, spendingCap: 100,
  startDate: new Date("2026-08-01"), endDate: new Date("2026-08-31") };

describe("cap-aware rewards", () => {
  it("splits purchases between the remaining promo allowance and base rate", () => {
    expect(evaluatePurchase([promo], "dining", 100, date, 90))
      .toMatchObject({ rewardAmount: 140, multiplier: 1.4, capped: true, promo: true });
  });

  it("falls through multiple independently tracked category/everything caps", () => {
    const fallback = { ...promo, category: "everything", multiplier: 3, spendingCap: 200 };
    const result = evaluatePurchase([promo, fallback], "dining", 100, date,
      (rule) => rule === promo ? 90 : 160);
    expect(result.rewardAmount).toBe(200); // $10 * 5 + $30 * 3 + $60 * 1
  });

  it("only counts posted purchases matching each rule's inclusive window", () => {
    const transaction = { category: "gas", status: "posted", isRefund: false, transactionDate: date };
    expect(countsTowardCap(promo, transaction)).toBe(false);
    expect(countsTowardCap({ ...promo, category: "everything" }, transaction)).toBe(true);
    expect(countsTowardCap(promo, { ...transaction, category: "dining", transactionDate: new Date("2026-07-31") })).toBe(false);
    expect(countsTowardCap(promo, { ...transaction, category: "dining", status: "pending" })).toBe(false);
    expect(countsTowardCap(promo, { ...transaction, category: "dining", isRefund: true })).toBe(false);
  });

  it("ranks on the blended reward, not the headline multiplier", () => {
    const card = { id: "promo", name: "Promo", issuer: "Fixture", rewardType: "points", rules: [promo], categorySpendSoFar: 90 };
    const ranked = rankCards([card, { ...card, id: "steady", rules: [{ ...promo, multiplier: 2, spendingCap: null }] }], "dining", 100, date);
    expect(ranked.map((result) => [result.cardId, result.estimatedRewards])).toEqual([["steady", 200], ["promo", 140]]);
  });
});
