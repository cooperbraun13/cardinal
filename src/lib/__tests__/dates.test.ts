import { describe, expect, it } from "vitest";
import { daysUntil, formatDate, nextOccurrence } from "@/lib/format";
import { isRuleActive } from "@/services/rewards";
import { eligibleSpend } from "@/services/bonuses";
import { benefitStatus } from "@/services/benefits";

describe("financial calendar dates", () => {
  it("keeps due-today visible through the whole day", () => {
    const now = new Date("2026-09-05T23:00:00Z");
    expect(nextOccurrence(5, now).toISOString()).toBe("2026-09-05T00:00:00.000Z");
    expect(daysUntil(nextOccurrence(5, now), now)).toBe(0);
    expect(nextOccurrence(4, now).toISOString()).toBe("2026-10-04T00:00:00.000Z");
    expect(nextOccurrence(1, new Date("2026-12-31"))).toEqual(new Date("2027-01-01"));
  });
  it("formats date-only values without shifting to yesterday", () => {
    expect(formatDate("2026-09-05")).toBe("Sep 5, 2026");
  });
  it("includes the full last day of a promotion and bonus", () => {
    const date = new Date("2026-09-30T23:59:59Z");
    const rule = { category: "dining", multiplier: 5, startDate: null, endDate: new Date("2026-09-30"), spendingCap: null };
    expect(isRuleActive(rule, date)).toBe(true);
    expect(isRuleActive(rule, new Date("2026-10-01"))).toBe(false);
    expect(eligibleSpend([{ amount: 100, status: "posted", isRefund: false, transactionDate: date }], { openedAt: null, deadline: rule.endDate })).toBe(100);
  });
  it("does not expire a benefit at the start of its expiration date", () => {
    const benefit = { totalValue: 10, usedValue: 0, resetFrequency: "one_time", startDate: new Date("2026-09-01"), expirationDate: new Date("2026-09-30"), active: true };
    expect(benefitStatus(benefit, new Date("2026-09-30T23:00:00Z"))).toBe("expiring");
    expect(benefitStatus(benefit, new Date("2026-10-01"))).toBe("expired");
  });
});
