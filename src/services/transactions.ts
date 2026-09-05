import "server-only";
import { prisma } from "@/lib/db";
import { getOwnedCard, getOwnedTransaction } from "@/lib/ownership";
import { countsTowardCap, evaluatePurchase, type RewardRule } from "@/services/rewards";
import type { Prisma, Transaction } from "@prisma/client";

type TransactionInput = Pick<Transaction, "cardId" | "merchant" | "amount" | "category" | "transactionDate" | "status" | "isRefund">;
type TransactionPatch = Partial<Omit<TransactionInput, "cardId">>;
type OwnedCard = Awaited<ReturnType<typeof getOwnedCard>>;
const cents = (value: number) => Math.round(value * 100) / 100;
const balanceEffect = (transaction: Pick<Transaction, "amount" | "isRefund">) =>
  transaction.isRefund ? -transaction.amount : transaction.amount;

/** Replay cap allocation in purchase order after a financial edit (including backdated entries).
 * Caps count gross posted purchases in each rule's window. Unlinked refunds are estimates
 * at their own date's rate and do not restore cap allowance.
 */
async function syncRewards(db: Prisma.TransactionClient, card: OwnedCard, from: Date) {
  const history = await db.transaction.findMany({
    where: { cardId: card.id },
    orderBy: [{ transactionDate: "asc" }, { createdAt: "asc" }, { id: "asc" }],
    include: { rewards: true },
  });
  const spend = new Map<RewardRule, number>(card.rewardCategories.map((rule) => [rule, 0]));
  for (const transaction of history) {
    if (transaction.transactionDate >= from) {
      const reward = evaluatePurchase(card.rewardCategories, transaction.category,
        transaction.amount, transaction.transactionDate, (rule) => spend.get(rule) ?? 0);
      const rewardAmount = transaction.status === "pending" ? 0 :
        reward.rewardAmount * (transaction.isRefund ? -1 : 1);
      if (transaction.rewards.length === 0) {
        await db.reward.create({ data: {
          cardId: card.id, transactionId: transaction.id, multiplier: reward.multiplier,
          rewardAmount, rewardType: card.signupBonuses[0]?.rewardType ?? "points",
        } });
      } else if (transaction.rewards.some((existing) => existing.rewardAmount !== rewardAmount || existing.multiplier !== reward.multiplier)) {
        await db.reward.updateMany({ where: { transactionId: transaction.id },
          data: { multiplier: reward.multiplier, rewardAmount } });
      }
    }
    for (const rule of card.rewardCategories) {
      if (countsTowardCap(rule, transaction)) spend.set(rule, cents((spend.get(rule) ?? 0) + transaction.amount));
    }
  }
}

export async function createTransactionWithEffects(userId: string, data: TransactionInput) {
  return prisma.$transaction(async (db) => {
    const card = await getOwnedCard(userId, data.cardId, db);
    const transaction = await db.transaction.create({ data: { ...data, userId } });
    await db.card.update({ where: { id: card.id },
      data: { currentBalance: cents(card.currentBalance + balanceEffect(transaction)) } });
    await syncRewards(db, card, transaction.transactionDate);
    return transaction;
  });
}

export async function updateTransactionWithEffects(userId: string, id: string, data: TransactionPatch) {
  return prisma.$transaction(async (db) => {
    const existing = await getOwnedTransaction(userId, id, db);
    const card = await getOwnedCard(userId, existing.cardId, db);
    const updated = await db.transaction.update({ where: { id }, data });
    const delta = balanceEffect(updated) - balanceEffect(existing);
    if (delta !== 0) await db.card.update({ where: { id: card.id },
      data: { currentBalance: cents(card.currentBalance + delta) } });
    const financialChange = updated.amount !== existing.amount || updated.category !== existing.category ||
      updated.isRefund !== existing.isRefund || updated.status !== existing.status ||
      updated.transactionDate.getTime() !== existing.transactionDate.getTime();
    if (financialChange) await syncRewards(db, card,
      new Date(Math.min(existing.transactionDate.getTime(), updated.transactionDate.getTime())));
    return updated;
  });
}

export async function deleteTransactionWithEffects(userId: string, id: string) {
  await prisma.$transaction(async (db) => {
    const transaction = await getOwnedTransaction(userId, id, db);
    const card = await getOwnedCard(userId, transaction.cardId, db);
    await db.transaction.delete({ where: { id } });
    await db.card.update({ where: { id: card.id },
      data: { currentBalance: cents(card.currentBalance - balanceEffect(transaction)) } });
    await syncRewards(db, card, transaction.transactionDate);
  });
}
