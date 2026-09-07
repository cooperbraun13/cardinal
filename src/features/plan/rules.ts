import type { PlanContext, PlanRecommendation } from "@/features/plan/types";

const PROFILE_BASICS = [
  "creditCardDebtStatus",
  "emergencyFundStatus",
  "employer401kStatus",
  "employerMatchStatus",
  "investingExperience",
] as const;

function needsProfileContext(context: PlanContext) {
  return !context || PROFILE_BASICS.some((field) => context[field] === null);
}

/**
 * Produces educational next steps from only the context a person explicitly saved.
 * Rules are ordered by priority and intentionally avoid product execution or advice.
 */
export function buildCardinalPlan(context: PlanContext): PlanRecommendation[] {
  const recommendations: PlanRecommendation[] = [];

  if (needsProfileContext(context)) {
    recommendations.push({
      id: "complete-profile-basics",
      priority: 100,
      title: "Share a little more context",
      action: "Answer only the profile questions you are comfortable sharing.",
      rationale:
        "A few optional answers help Cardinal explain which financial topics may be most useful to explore first.",
      whySuggested:
        "Some of the information used to organize your next steps has not been shared yet.",
      href: "/profile",
      linkLabel: "Update profile",
      inputsUsed: PROFILE_BASICS.filter(
        (field) => !context || context[field] === null,
      ),
      assumptions: ["Unanswered questions are treated as unknown, never as zero or no."],
    });
  }

  if (context?.creditCardDebtStatus === "some") {
    recommendations.push({
      id: "understand-high-interest-card-debt",
      priority: 90,
      title: "Understand your high-interest card debt",
      action:
        "Review the balances, rates, and payment dates that affect what you owe.",
      rationale:
        "Interest can increase the cost of a balance over time, so understanding the debt is a useful first step before adding new financial goals.",
      whySuggested:
        "You shared that you have some high-interest credit card debt.",
      href: "/money",
      linkLabel: "Review Money",
      inputsUsed: ["creditCardDebtStatus"],
      assumptions: ["This step does not calculate a payoff amount or replace help from a qualified professional."],
    });
  }

  if (context?.emergencyFundStatus === "not_started") {
    recommendations.push({
      id: "start-emergency-savings",
      priority: 80,
      title: "Start an emergency savings cushion",
      action:
        "Learn what expenses you would want cash set aside to cover when something unexpected happens.",
      rationale:
        "A cash buffer can make an unexpected expense easier to handle without relying as heavily on new debt.",
      whySuggested:
        "You shared that you have not started emergency savings yet.",
      href: "/learn/emergency-fund",
      linkLabel: "Read emergency-fund lesson",
      inputsUsed: ["emergencyFundStatus"],
      assumptions: ["Cardinal has not calculated a savings target for you."],
    });
  }

  if (
    context?.employer401kStatus === "available" &&
    context.employerMatchStatus === "available"
  ) {
    recommendations.push({
      id: "learn-employer-match",
      priority: 70,
      title: "Understand your employer contribution match",
      action:
        "Read your plan materials to learn the contribution rules, match formula, and eligibility details.",
      rationale:
        "Employer retirement plans can have contribution-match rules that are useful to understand as you consider longer-term goals.",
      whySuggested:
        "You shared that a workplace retirement plan and employer match are available.",
      href: "/learn/employer-match",
      linkLabel: "Read employer-match lesson",
      inputsUsed: ["employer401kStatus", "employerMatchStatus"],
      assumptions: ["Plan terms and eligibility can vary; Cardinal does not have your plan documents."],
    });
  }

  if (context?.emergencyFundStatus === "starter_fund") {
    recommendations.push({
      id: "grow-emergency-savings",
      priority: 60,
      title: "Decide how to grow your emergency savings",
      action:
        "Learn how people think about emergency expenses and the tradeoffs between savings goals.",
      rationale:
        "A starter fund is a beginning. Understanding likely expenses can help you decide what additional cushion would feel useful.",
      whySuggested:
        "You shared that you have some emergency savings set aside.",
      href: "/learn/emergency-fund",
      linkLabel: "Read emergency-fund lesson",
      inputsUsed: ["emergencyFundStatus"],
      assumptions: ["Cardinal has not calculated a savings target for you."],
    });
  }

  if (context?.investingExperience === "new") {
    recommendations.push({
      id: "learn-investing-basics",
      priority: 50,
      title: "Build an investing foundation",
      action:
        "Start with the basic account and investment concepts before deciding what to do.",
      rationale:
        "A shared vocabulary can make retirement accounts, funds, and investment choices easier to understand.",
      whySuggested: "You shared that you are new to investing.",
      href: "/learn/investing-basics",
      linkLabel: "Read investing-basics lesson",
      inputsUsed: ["investingExperience"],
      assumptions: ["This is education, not a recommendation to buy or sell an investment."],
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "review-current-money-picture",
      priority: 10,
      title: "Keep your money picture current",
      action:
        "Review your card balances, payment dates, and benefits whenever your situation changes.",
      rationale:
        "A current picture of your credit cards makes it easier to understand the decisions in front of you.",
      whySuggested:
        "The context you shared does not currently point to one of Cardinal’s focused education steps.",
      href: "/money",
      linkLabel: "Review Money",
      inputsUsed: [],
      assumptions: ["This is a general reminder, not a personalized financial recommendation."],
    });
  }

  return recommendations.sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
}
