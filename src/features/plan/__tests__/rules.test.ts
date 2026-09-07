import { describe, expect, it } from "vitest";
import { buildCardinalPlan } from "@/features/plan/rules";
import type { FinancialProfileValues } from "@/features/profile/types";

const profile = (
  changes: Partial<FinancialProfileValues> = {},
): FinancialProfileValues => ({
  employmentStatus: null,
  annualIncomeRange: null,
  savingsRange: null,
  emergencyFundStatus: null,
  creditCardDebtStatus: null,
  otherDebtStatus: null,
  employer401kStatus: null,
  employerMatchStatus: null,
  investingExperience: null,
  riskComfort: null,
  primaryGoal: null,
  ...changes,
});

describe("Cardinal Plan rules", () => {
  it("asks for missing context without treating it as a financial answer", () => {
    const [recommendation] = buildCardinalPlan(null);

    expect(recommendation).toMatchObject({
      id: "complete-profile-basics",
      href: "/profile",
      inputsUsed: [
        "creditCardDebtStatus",
        "emergencyFundStatus",
        "employer401kStatus",
        "employerMatchStatus",
        "investingExperience",
      ],
    });
    expect(recommendation.assumptions[0]).toContain("unknown");
  });

  it("orders debt, emergency savings, employer-match, and investing education transparently", () => {
    const recommendations = buildCardinalPlan(
      profile({
        creditCardDebtStatus: "some",
        emergencyFundStatus: "not_started",
        employer401kStatus: "available",
        employerMatchStatus: "available",
        investingExperience: "new",
      }),
    );

    expect(recommendations.map((recommendation) => recommendation.id)).toEqual([
      "understand-high-interest-card-debt",
      "start-emergency-savings",
      "learn-employer-match",
      "learn-investing-basics",
    ]);
    expect(recommendations.every((recommendation) => recommendation.whySuggested)).toBe(true);
    expect(recommendations.every((recommendation) => recommendation.action)).toBe(true);
    expect(Object.fromEntries(recommendations.map(({ id, href }) => [id, href]))).toMatchObject({
      "start-emergency-savings": "/learn/emergency-fund",
      "learn-employer-match": "/learn/employer-match",
      "learn-investing-basics": "/learn/investing-basics",
    });
  });

  it("does not show an employer-match step when either availability answer is unknown", () => {
    const recommendations = buildCardinalPlan(
      profile({ employer401kStatus: "available", employerMatchStatus: "not_sure" }),
    );

    expect(recommendations.map((recommendation) => recommendation.id)).not.toContain(
      "learn-employer-match",
    );
  });

  it("keeps one general next step when no focused rule applies", () => {
    const recommendations = buildCardinalPlan(
      profile({
        creditCardDebtStatus: "none",
        emergencyFundStatus: "three_months_or_more",
        employer401kStatus: "not_available",
        employerMatchStatus: "not_available",
        investingExperience: "experienced",
      }),
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0]).toMatchObject({
      id: "review-current-money-picture",
      href: "/money",
    });
  });
});
