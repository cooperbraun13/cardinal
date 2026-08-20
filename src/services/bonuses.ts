// Signup-bonus progress. Pure functions for testability.

export interface BonusWindow {
  openedAt: Date | null;
  deadline: Date;
}

export interface SpendTransaction {
  amount: number;
  status: string; // pending | posted
  isRefund: boolean;
  transactionDate: Date;
}

/**
 * Eligible spend toward a signup bonus.
 *
 * Rules (see CLAUDE.md + practice ticket 3):
 * - only POSTED transactions count (pending excluded)
 * - refunds SUBTRACT from progress (a purchase later refunded nets to zero)
 * - only transactions inside the bonus window count (card opened → deadline)
 * - never below zero
 */
export function eligibleSpend(
  transactions: SpendTransaction[],
  window: BonusWindow
): number {
  const total = transactions.reduce((sum, t) => {
    if (t.status !== "posted") return sum;
    if (window.openedAt && t.transactionDate < window.openedAt) return sum;
    if (t.transactionDate > window.deadline) return sum;
    return sum + (t.isRefund ? -t.amount : t.amount);
  }, 0);
  return Math.max(0, Math.round(total * 100) / 100);
}

export function bonusProgress(spend: number, requirement: number): number {
  if (requirement <= 0) return 100;
  return Math.min(100, (spend / requirement) * 100);
}
