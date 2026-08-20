import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { getOwnedTransaction, getOwnedCard } from "@/lib/ownership";
import { transactionUpdateSchema } from "@/lib/validation";
import { deleteTransactionWithEffects } from "@/services/data";
import { selectRewardRule, calculateReward } from "@/services/rewards";

type Params = { params: Promise<{ id: string }> };

export const PATCH = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  const existing = await getOwnedTransaction(user.id, id);
  const body = transactionUpdateSchema.parse(await req.json());
  const card = await getOwnedCard(user.id, existing.cardId);

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      ...body,
      transactionDate: body.transactionDate ? new Date(body.transactionDate) : undefined,
    },
  });

  // Category/amount/date/refund changes can change the earned reward — recompute
  // so dashboards stay consistent (see practice ticket 5).
  const selection = selectRewardRule(
    card.rewardCategories,
    updated.category,
    updated.transactionDate
  );
  await prisma.reward.updateMany({
    where: { transactionId: id },
    data: {
      multiplier: selection.multiplier,
      rewardAmount: calculateReward(updated.amount, selection.multiplier, updated.isRefund),
    },
  });

  // Keep the card balance in sync if the amount or refund flag changed.
  const oldDelta = existing.isRefund ? -existing.amount : existing.amount;
  const newDelta = updated.isRefund ? -updated.amount : updated.amount;
  if (oldDelta !== newDelta) {
    await prisma.card.update({
      where: { id: card.id },
      data: { currentBalance: Math.max(0, card.currentBalance - oldDelta + newDelta) },
    });
  }

  return NextResponse.json(updated);
});

export const DELETE = handleApi(async (_req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  const transaction = await getOwnedTransaction(user.id, id);
  const card = await getOwnedCard(user.id, transaction.cardId);
  await deleteTransactionWithEffects(transaction, card);
  return new NextResponse(null, { status: 204 });
});
