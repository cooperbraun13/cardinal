import "server-only";
import { prisma } from "@/lib/db";
import { utilization, overallUtilization, selectRewardRule, calculateReward } from "@/services/rewards";
import { eligibleSpend, bonusProgress } from "@/services/bonuses";
import { benefitStatus, benefitRemaining, effectiveExpiry } from "@/services/benefits";
import { rankCards, type CandidateCard, type Recommendation } from "@/services/recommend";
import { nextOccurrence } from "@/lib/format";
import type { Card, SignupBonus, Transaction } from "@prisma/client";

/** Card reward type derived from its signup bonus (schema keeps reward type per reward/bonus). */
function cardRewardType(card: Card & { signupBonuses: SignupBonus[] }): string {
  return card.signupBonuses[0]?.rewardType ?? "points";
}

/**
 * Assembles optimizer candidates in two queries total (cards+rules, category spend)
 * — no per-card queries (see practice ticket 7).
 */
export async function getCandidateCards(userId: string, category: string): Promise<CandidateCard[]> {
  const cards = await prisma.card.findMany({
    where: { userId, active: true },
    include: { rewardCategories: true, signupBonuses: true },
  });
  if (cards.length === 0) return [];

  const spend = await prisma.transaction.groupBy({
    by: ["cardId"],
    where: {
      cardId: { in: cards.map((c) => c.id) },
      category,
      status: "posted",
      isRefund: false,
    },
    _sum: { amount: true },
  });
  const spendByCard = new Map(spend.map((s) => [s.cardId, s._sum.amount ?? 0]));

  return cards.map((card) => ({
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    rewardType: cardRewardType(card),
    rules: card.rewardCategories,
    categorySpendSoFar: spendByCard.get(card.id) ?? 0,
  }));
}

export async function recommendCard(
  userId: string,
  category: string,
  amount: number
): Promise<{ recommendation: Recommendation | null; alternatives: Recommendation[] }> {
  const candidates = await getCandidateCards(userId, category);
  const ranked = rankCards(candidates, category, amount);
  return { recommendation: ranked[0] ?? null, alternatives: ranked.slice(1, 4) };
}

/**
 * Creates a transaction, computes its reward from the card's rules, and adjusts
 * the card balance — atomically. Refunds decrease the balance and earn negative rewards.
 */
export async function createTransactionWithEffects(
  userId: string,
  data: {
    cardId: string;
    merchant: string;
    amount: number;
    category: string;
    transactionDate: Date;
    status: string;
    isRefund: boolean;
  },
  card: Card & { rewardCategories: { category: string; multiplier: number; startDate: Date | null; endDate: Date | null; spendingCap: number | null }[]; signupBonuses: SignupBonus[] }
): Promise<Transaction> {
  const categorySpend = await prisma.transaction.aggregate({
    where: { cardId: card.id, category: data.category, status: "posted", isRefund: false },
    _sum: { amount: true },
  });
  const selection = selectRewardRule(
    card.rewardCategories,
    data.category,
    data.transactionDate,
    categorySpend._sum.amount ?? 0
  );
  const rewardAmount = calculateReward(data.amount, selection.multiplier, data.isRefund);
  const balanceDelta = data.isRefund ? -data.amount : data.amount;

  const [transaction] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        ...data,
        userId,
        rewards: {
          create: {
            cardId: card.id,
            multiplier: selection.multiplier,
            rewardAmount,
            rewardType: cardRewardType(card),
          },
        },
      },
    }),
    prisma.card.update({
      where: { id: card.id },
      data: { currentBalance: Math.max(0, card.currentBalance + balanceDelta) },
    }),
  ]);
  return transaction;
}

/** Reverses a transaction's balance effect and deletes it (rewards cascade). */
export async function deleteTransactionWithEffects(transaction: Transaction, card: Card) {
  const balanceDelta = transaction.isRefund ? transaction.amount : -transaction.amount;
  await prisma.$transaction([
    prisma.transaction.delete({ where: { id: transaction.id } }),
    prisma.card.update({
      where: { id: card.id },
      data: { currentBalance: Math.max(0, card.currentBalance + balanceDelta) },
    }),
  ]);
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
        take: 8,
        include: { card: { select: { name: true, cardTheme: true } } },
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
