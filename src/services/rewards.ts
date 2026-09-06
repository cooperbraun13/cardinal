// Core reward math. Pure functions — no DB access — so they are trivially unit-testable.

import { EVERYTHING } from "@/lib/categories";
import { dayAfter, dayStart } from "@/lib/dates";

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
  if (rule.startDate && date < dayStart(rule.startDate)) return false;
  if (rule.endDate && date >= dayAfter(rule.endDate)) return false;
  return true;
}

export interface RuleSelection {
  rule: RewardRule | null; // null → no matching rule, base 1x applies
  multiplier: number;
  capped: boolean; // true when a better rule existed but its spending cap was exhausted
}

export type RuleSpend = number | ((rule: RewardRule) => number);

/** Spend belonging to this rule's category and inclusive UTC date window. */
export function countsTowardCap(
  rule: RewardRule,
  transaction: { category: string; transactionDate: Date; status: string; isRefund: boolean }
): boolean {
  return transaction.status === "posted" && !transaction.isRefund &&
    (rule.category === EVERYTHING || rule.category === transaction.category) &&
    isRuleActive(rule, transaction.transactionDate);
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
  categorySpendSoFar: RuleSpend = 0
): RuleSelection {
  const applicable = rules
    .filter((r) => (r.category === category || r.category === EVERYTHING) && isRuleActive(r, date))
    .sort((a, b) => b.multiplier - a.multiplier);

  let capped = false;
  for (const rule of applicable) {
    const spend = typeof categorySpendSoFar === "number" ? categorySpendSoFar : categorySpendSoFar(rule);
    if (rule.spendingCap != null && spend >= rule.spendingCap) {
      capped = true;
      continue;
    }
    return { rule, multiplier: rule.multiplier, capped };
  }
  return { rule: null, multiplier: 1, capped };
}

/** Split a purchase at cap boundaries; the remainder earns the next available rate. */
export function evaluatePurchase(
  rules: RewardRule[], category: string, amount: number, date: Date, spend: RuleSpend = 0
) {
  const totalCents = Math.round(amount * 100);
  let consumed = 0;
  let earned = 0;
  let capped = false;
  let promo = false;
  while (consumed < totalCents) {
    const usage = (rule: RewardRule) =>
      (typeof spend === "number" ? spend : spend(rule)) + consumed / 100;
    const selection = selectRewardRule(rules, category, date, usage);
    const rule = selection.rule;
    const portion = rule?.spendingCap == null ? totalCents - consumed :
      Math.min(totalCents - consumed, Math.max(1, Math.round((rule.spendingCap - usage(rule)) * 100)));
    earned += portion * selection.multiplier;
    consumed += portion;
    capped ||= selection.capped || consumed < totalCents;
    promo ||= !!rule && (rule.startDate != null || rule.endDate != null);
  }
  const rewardAmount = Math.round(earned) / 100;
  return { rewardAmount, multiplier: amount > 0 ? rewardAmount / amount : 1, capped, promo };
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
