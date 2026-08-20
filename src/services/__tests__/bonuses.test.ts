import { describe, it, expect } from "vitest";
import { eligibleSpend, bonusProgress, type SpendTransaction } from "@/services/bonuses";

const window = {
  openedAt: new Date("2026-06-01"),
  deadline: new Date("2026-09-01"),
};

const txn = (overrides: Partial<SpendTransaction>): SpendTransaction => ({
  amount: 100,
  status: "posted",
  isRefund: false,
  transactionDate: new Date("2026-07-01"),
  ...overrides,
});

describe("eligibleSpend", () => {
  it("sums posted purchases inside the window", () => {
    expect(eligibleSpend([txn({}), txn({ amount: 250 })], window)).toBe(350);
  });

  it("excludes pending transactions", () => {
    expect(eligibleSpend([txn({}), txn({ status: "pending", amount: 500 })], window)).toBe(100);
  });

  it("subtracts refunds (practice ticket 3)", () => {
    expect(eligibleSpend([txn({ amount: 500 }), txn({ amount: 500, isRefund: true })], window)).toBe(0);
  });

  it("excludes transactions outside the bonus window", () => {
    const txns = [
      txn({ transactionDate: new Date("2026-05-30"), amount: 999 }), // before opening
      txn({ transactionDate: new Date("2026-09-02"), amount: 999 }), // after deadline
      txn({ amount: 100 }),
    ];
    expect(eligibleSpend(txns, window)).toBe(100);
  });

  it("never returns a negative total", () => {
    expect(eligibleSpend([txn({ amount: 100, isRefund: true })], window)).toBe(0);
  });

  it("handles a null openedAt window start", () => {
    expect(
      eligibleSpend([txn({ transactionDate: new Date("2020-01-01") })], {
        openedAt: null,
        deadline: window.deadline,
      })
    ).toBe(100);
  });
});

describe("bonusProgress", () => {
  it("computes percentage toward the requirement", () => {
    expect(bonusProgress(1000, 4000)).toBe(25);
  });

  it("caps at 100%", () => {
    expect(bonusProgress(5000, 4000)).toBe(100);
  });

  it("treats a non-positive requirement as complete", () => {
    expect(bonusProgress(0, 0)).toBe(100);
  });
});
