import "server-only";
import { prisma } from "@/lib/db";
import { utilization, overallUtilization, countsTowardCap } from "@/services/rewards";
import { eligibleSpend, bonusProgress } from "@/services/bonuses";
import { benefitStatus, benefitRemaining, effectiveExpiry } from "@/services/benefits";
import { rankCards, type CandidateCard, type Recommendation } from "@/services/recommend";
import { nextOccurrence } from "@/lib/format";
import type { Card, SignupBonus } from "@prisma/client";

/** Card reward type derived from its signup bonus (schema keeps reward type per reward/bonus). */
function cardRewardType(card: Card & { signupBonuses: SignupBonus[] }): string {
  return card.signupBonuses[0]?.rewardType ?? "points";
}

/**
 * Loads candidates and cap history in batches, never one query per card/rule.
 */
export async function getCandidateCards(userId: string): Promise<CandidateCard[]> {
  const cards = await prisma.card.findMany({
    where: { userId, active: true },
    include: { rewardCategories: true, signupBonuses: true },
  });
  if (cards.length === 0) return [];

  const spend = await prisma.transaction.findMany({
    where: {
      cardId: { in: cards.filter((card) => card.rewardCategories.some((rule) => rule.spendingCap != null)).map((c) => c.id) },
      transactionDate: { lte: new Date() },
      status: "posted",
      isRefund: false,
    },
    select: { cardId: true, amount: true, category: true, transactionDate: true, status: true, isRefund: true },
  });
  const spendByCard = new Map<string, typeof spend>();
  for (const transaction of spend) {
    const history = spendByCard.get(transaction.cardId) ?? [];
    history.push(transaction);
    spendByCard.set(transaction.cardId, history);
  }

  return cards.map((card) => ({
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    rewardType: cardRewardType(card),
    rules: card.rewardCategories,
    categorySpendSoFar: (rule) => Math.round((spendByCard.get(card.id) ?? [])
      .reduce((sum, transaction) => sum + (countsTowardCap(rule, transaction) ? transaction.amount : 0), 0) * 100) / 100,
  }));
}

export async function recommendCard(
  userId: string,
  category: string,
  amount: number
): Promise<{ recommendation: Recommendation | null; alternatives: Recommendation[] }> {
  const candidates = await getCandidateCards(userId);
  const ranked = rankCards(candidates, category, amount);
  return { recommendation: ranked[0] ?? null, alternatives: ranked.slice(1, 4) };
}


/** Signup bonuses with computed progress for a set of cards (single transaction query). */
export async function getBonusesWithProgress(userId: string) {
  const bonuses = await prisma.signupBonus.findMany({
    where: { card: { userId } },
    include: { card: { select: { id: true, name: true, cardTheme: true, openedAt: true } } },
  });
  if (bonuses.length === 0) return [];
  const txns = await prisma.transaction.findMany({
    where: { cardId: { in: bonuses.map((b) => b.cardId) } },
    select: { cardId: true, amount: true, status: true, isRefund: true, transactionDate: true },
  });
  return bonuses.map((bonus) => {
    const spend = eligibleSpend(
      txns.filter((t) => t.cardId === bonus.cardId),
      { openedAt: bonus.card.openedAt, deadline: bonus.deadline }
    );
    return {
      ...bonus,
      eligibleSpend: spend,
      progress: bonusProgress(spend, bonus.spendRequirement),
      met: bonus.completed || spend >= bonus.spendRequirement,
    };
  });
}

/** Everything the dashboard needs in one aggregated payload. */
export async function getDashboardData(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [cards, monthRewards, monthSpendByCategory, prevMonthSpend, recentTransactions, benefits, bonuses] =
    await Promise.all([
      prisma.card.findMany({
        where: { userId, active: true },
        include: { rewardCategories: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.reward.groupBy({
        by: ["rewardType"],
        where: { card: { userId }, transaction: { transactionDate: { gte: monthStart }, status: "posted" } },
        _sum: { rewardAmount: true },
      }),
      prisma.transaction.groupBy({
        by: ["category"],
        where: { userId, status: "posted", isRefund: false, transactionDate: { gte: monthStart } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          status: "posted",
          isRefund: false,
          transactionDate: { gte: prevMonthStart, lt: monthStart },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { transactionDate: "desc" },
        take: 6,
        include: {
          card: { select: { name: true, cardTheme: true } },
          rewards: { select: { rewardAmount: true, rewardType: true, multiplier: true } },
        },
      }),
      prisma.benefit.findMany({
        where: { card: { userId }, active: true },
        include: { card: { select: { name: true } } },
      }),
      getBonusesWithProgress(userId),
    ]);

  const totalLimit = cards.reduce((s, c) => s + c.creditLimit, 0);
  const totalBalance = cards.reduce((s, c) => s + c.currentBalance, 0);

  // Convert mixed reward types into a comparable dollar value
  // (1 pt = 1¢, 1 mile = 1.2¢; cashback rewards are stored as percent-units).
  const REWARD_VALUE: Record<string, number> = { points: 0.01, miles: 0.012, cashback: 0.01 };
  const rewardsValueThisMonth = monthRewards.reduce(
    (sum, r) => sum + (r._sum.rewardAmount ?? 0) * (REWARD_VALUE[r.rewardType] ?? 0.01),
    0
  );
  const pointsThisMonth = monthRewards
    .filter((r) => r.rewardType !== "cashback")
    .reduce((sum, r) => sum + (r._sum.rewardAmount ?? 0), 0);

  const spendThisMonth = monthSpendByCategory.reduce((s, c) => s + (c._sum.amount ?? 0), 0);
  const spendLastMonth = prevMonthSpend._sum.amount ?? 0;
  // Month-over-month spend delta %; null when there's no prior month to compare.
  const spendDeltaPct =
    spendLastMonth > 0 ? ((spendThisMonth - spendLastMonth) / spendLastMonth) * 100 : null;

  const upcomingDueDates = cards
    .map((c) => ({
      cardId: c.id,
      cardName: c.name,
      cardTheme: c.cardTheme,
      balance: c.currentBalance,
      dueDate: nextOccurrence(c.dueDay, now),
    }))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  const expiringBenefits = benefits
    .map((b) => ({
      id: b.id,
      name: b.name,
      cardName: b.card.name,
      remaining: benefitRemaining(b),
      expiry: effectiveExpiry(b, now),
      status: benefitStatus(b, now),
    }))
    .filter((b) => b.status === "expiring")
    .sort((a, b) => (a.expiry?.getTime() ?? 0) - (b.expiry?.getTime() ?? 0));

  return {
    cards: cards.map((c) => ({ ...c, utilization: utilization(c.currentBalance, c.creditLimit) })),
    totals: {
      totalLimit,
      totalBalance,
      availableCredit: Math.max(0, totalLimit - totalBalance),
      overallUtilization: overallUtilization(cards),
      rewardsValueThisMonth,
      pointsThisMonth,
      spendThisMonth,
      spendDeltaPct,
    },
    spendingByCategory: monthSpendByCategory
      .map((s) => ({ category: s.category, amount: s._sum.amount ?? 0 }))
      .sort((a, b) => b.amount - a.amount),
    recentTransactions,
    upcomingDueDates,
    expiringBenefits,
    bonuses: bonuses.filter((b) => !b.met),
  };
}
