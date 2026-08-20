import { describe, it, expect } from "vitest";
import {
  utilization,
  overallUtilization,
  selectRewardRule,
  calculateReward,
  type RewardRule,
} from "@/services/rewards";

const rule = (overrides: Partial<RewardRule>): RewardRule => ({
  category: "dining",
  multiplier: 3,
  startDate: null,
  endDate: null,
  spendingCap: null,
  ...overrides,
});

describe("utilization", () => {
  it("computes balance / limit * 100", () => {
    expect(utilization(1000, 5000)).toBe(20); // practice ticket 1's correct answer
  });

  it("handles zero and negative limits safely", () => {
    expect(utilization(500, 0)).toBe(0);
    expect(utilization(500, -100)).toBe(0);
  });

  it("computes overall utilization across cards", () => {
    const cards = [
      { currentBalance: 1000, creditLimit: 5000 },
      { currentBalance: 500, creditLimit: 5000 },
    ];
    expect(overallUtilization(cards)).toBe(15);
  });

  it("returns 0 overall when there are no cards", () => {
    expect(overallUtilization([])).toBe(0);
  });
});

describe("selectRewardRule", () => {
  const now = new Date("2026-08-15");

  it("returns base 1x when no rule matches", () => {
    const result = selectRewardRule([rule({ category: "travel" })], "dining", now);
    expect(result.multiplier).toBe(1);
    expect(result.rule).toBeNull();
  });

  it("picks a matching category rule (practice ticket 2)", () => {
    const result = selectRewardRule([rule({ category: "dining", multiplier: 3 })], "dining", now);
    expect(result.multiplier).toBe(3);
  });

  it("falls back to an 'everything' rule over base 1x", () => {
    const result = selectRewardRule(
      [rule({ category: "everything", multiplier: 1.5 })],
      "dining",
      now
    );
    expect(result.multiplier).toBe(1.5);
  });

  it("prefers an active temporary promo over a permanent lower rule (practice ticket 9)", () => {
    const rules = [
      rule({ category: "groceries", multiplier: 3 }),
      rule({
        category: "groceries",
        multiplier: 5,
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-09-30"),
      }),
    ];
    expect(selectRewardRule(rules, "groceries", now).multiplier).toBe(5);
  });

  it("ignores promos outside their date window", () => {
    const rules = [
      rule({ category: "groceries", multiplier: 3 }),
      rule({
        category: "groceries",
        multiplier: 5,
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-03-31"),
      }),
    ];
    expect(selectRewardRule(rules, "groceries", now).multiplier).toBe(3);
  });

  it("skips rules whose spending cap is exhausted and falls through", () => {
    const rules = [
      rule({ category: "dining", multiplier: 4, spendingCap: 1500 }),
      rule({ category: "dining", multiplier: 2 }),
    ];
    const result = selectRewardRule(rules, "dining", now, 1500);
    expect(result.multiplier).toBe(2);
    expect(result.capped).toBe(true);
  });

  it("applies a capped rule while spend remains under the cap", () => {
    const rules = [rule({ category: "dining", multiplier: 4, spendingCap: 1500 })];
    expect(selectRewardRule(rules, "dining", now, 1499).multiplier).toBe(4);
  });
});

describe("calculateReward", () => {
  it("multiplies amount by multiplier", () => {
    expect(calculateReward(120, 3)).toBe(360);
  });

  it("earns negative rewards on refunds", () => {
    expect(calculateReward(50, 2, true)).toBe(-100);
  });

  it("rounds to 2 decimals", () => {
    expect(calculateReward(10.333, 3)).toBe(31);
  });
});
