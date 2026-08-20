// Core reward math. Pure functions — no DB access — so they are trivially unit-testable.

import { EVERYTHING } from "@/lib/categories";

export interface RewardRule {
  category: string;
  multiplier: number;
  startDate: Date | null;
  endDate: Date | null;
  spendingCap: number | null;
}

/** Per-card utilization %. Zero/invalid limits are handled safely. */
export function utilization(balance: number, limit: number): number {
  if (!limit || limit <= 0) return 0;
  return (balance / limit) * 100;
}

/** Overall utilization % across cards: sum(balances) / sum(limits). */
export function overallUtilization(
  cards: Array<{ currentBalance: number; creditLimit: number }>
): number {
  const totalLimit = cards.reduce((s, c) => s + c.creditLimit, 0);
  const totalBalance = cards.reduce((s, c) => s + c.currentBalance, 0);
  return utilization(totalBalance, totalLimit);
}

/** A rule is active if `date` falls within its (optional) start/end window. */
export function isRuleActive(rule: RewardRule, date: Date): boolean {
  if (rule.startDate && date < rule.startDate) return false;
  if (rule.endDate && date > rule.endDate) return false;
  return true;
}

export interface RuleSelection {
  rule: RewardRule | null; // null → no matching rule, base 1x applies
  multiplier: number;
  capped: boolean; // true when a better rule existed but its spending cap was exhausted
}

/**
 * Selects the best applicable reward rule for a purchase.
 *
 * Precedence: among rules active on `date` that match the category (or apply to
 * everything), the highest multiplier wins — so a temporary 5x promo beats a
 * permanent 3x rule (see practice ticket 9). Rules whose spending cap is already
 * exhausted (categorySpendSoFar >= cap) are skipped and we fall through to the
 * next-best rule, ending at the base 1x.
 */
export function selectRewardRule(
  rules: RewardRule[],
  category: string,
  date: Date,
  categorySpendSoFar = 0
): RuleSelection {
  const applicable = rules
    .filter((r) => (r.category === category || r.category === EVERYTHING) && isRuleActive(r, date))
    .sort((a, b) => b.multiplier - a.multiplier);

  let capped = false;
  for (const rule of applicable) {
    if (rule.spendingCap != null && categorySpendSoFar >= rule.spendingCap) {
      capped = true;
      continue;
    }
    return { rule, multiplier: rule.multiplier, capped };
  }
  return { rule: null, multiplier: 1, capped };
}

/** Reward earned for a purchase, rounded to 2 decimals. Refunds earn negative rewards. */
export function calculateReward(
  amount: number,
  multiplier: number,
  isRefund = false
): number {
  const sign = isRefund ? -1 : 1;
  return Math.round(sign * amount * multiplier * 100) / 100;
}
