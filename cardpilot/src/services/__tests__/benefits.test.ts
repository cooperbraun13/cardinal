import { describe, it, expect } from "vitest";
import {
  benefitStatus,
  benefitRemaining,
  currentPeriodEnd,
  effectiveExpiry,
  type BenefitLike,
} from "@/services/benefits";

const benefit = (overrides: Partial<BenefitLike>): BenefitLike => ({
  totalValue: 120,
  usedValue: 0,
  resetFrequency: "annual",
  startDate: new Date("2026-01-01"),
  expirationDate: null,
  active: true,
  ...overrides,
});

const now = new Date("2026-08-15");

describe("benefitRemaining", () => {
  it("computes total minus used", () => {
    expect(benefitRemaining(benefit({ usedValue: 45 }))).toBe(75);
  });

  it("never goes negative", () => {
    expect(benefitRemaining(benefit({ usedValue: 200 }))).toBe(0);
  });
});

describe("currentPeriodEnd", () => {
  it("monthly resets at the start of next month", () => {
    expect(currentPeriodEnd(benefit({ resetFrequency: "monthly" }), now)).toEqual(
      new Date(2026, 8, 1)
    );
  });

  it("quarterly resets at the next quarter boundary", () => {
    expect(currentPeriodEnd(benefit({ resetFrequency: "quarterly" }), now)).toEqual(
      new Date(2026, 9, 1)
    );
  });

  it("annual resets at the start of next year", () => {
    expect(currentPeriodEnd(benefit({ resetFrequency: "annual" }), now)).toEqual(
      new Date(2027, 0, 1)
    );
  });

  it("one_time uses the expiration date", () => {
    const exp = new Date("2026-12-31");
    expect(
      currentPeriodEnd(benefit({ resetFrequency: "one_time", expirationDate: exp }), now)
    ).toEqual(exp);
  });
});

describe("effectiveExpiry", () => {
  it("uses the earlier of period end and hard expiration", () => {
    const exp = new Date("2026-08-20");
    expect(effectiveExpiry(benefit({ resetFrequency: "annual", expirationDate: exp }), now)).toEqual(
      exp
    );
  });
});

describe("benefitStatus", () => {
  it("is available when unused and not near expiry", () => {
    expect(benefitStatus(benefit({}), new Date("2026-03-01"))).toBe("available");
  });

  it("is partial once some value is used", () => {
    expect(benefitStatus(benefit({ usedValue: 40 }), new Date("2026-03-01"))).toBe("partial");
  });

  it("is used when fully consumed", () => {
    expect(benefitStatus(benefit({ usedValue: 120 }), now)).toBe("used");
  });

  it("is expiring within 14 days of the period end", () => {
    expect(benefitStatus(benefit({ resetFrequency: "monthly" }), new Date("2026-08-25"))).toBe(
      "expiring"
    );
  });

  it("is expired after the hard expiration date", () => {
    expect(benefitStatus(benefit({ expirationDate: new Date("2026-08-01") }), now)).toBe("expired");
  });

  it("is inactive when disabled or not yet started", () => {
    expect(benefitStatus(benefit({ active: false }), now)).toBe("inactive");
    expect(benefitStatus(benefit({ startDate: new Date("2026-12-01") }), now)).toBe("inactive");
  });
});
