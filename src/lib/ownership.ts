import "server-only";
import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/api";
import type { Prisma } from "@prisma/client";

// Ownership enforcement — every resource lookup is scoped to the logged-in
// user. Non-owned resources return 404 (we don't reveal that the ID exists).

export async function getOwnedCard(userId: string, cardId: string, db: Prisma.TransactionClient = prisma) {
  const card = await db.card.findFirst({
    where: { id: cardId, userId },
    include: { rewardCategories: true, signupBonuses: true },
  });
  if (!card) throw new ApiError(404, "CARD_NOT_FOUND", "Card could not be found.");
  return card;
}

export async function getOwnedTransaction(userId: string, transactionId: string, db: Prisma.TransactionClient = prisma) {
  const transaction = await db.transaction.findFirst({
    where: { id: transactionId, userId },
  });
  if (!transaction)
    throw new ApiError(404, "TRANSACTION_NOT_FOUND", "Transaction could not be found.");
  return transaction;
}

export async function getOwnedBenefit(userId: string, benefitId: string, db: Prisma.TransactionClient = prisma) {
  const benefit = await db.benefit.findFirst({
    where: { id: benefitId, card: { userId } },
  });
  if (!benefit) throw new ApiError(404, "BENEFIT_NOT_FOUND", "Benefit could not be found.");
  return benefit;
}
