import "server-only";
import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/api";
import { getOwnedCard } from "@/lib/ownership";
import { syncCardRewards } from "@/services/transactions";
import { dayStart } from "@/lib/dates";
import type { rewardCategorySchema } from "@/lib/validation";
import type { z } from "zod";

type RewardRuleInput = z.infer<typeof rewardCategorySchema>;

/** Create a rule and reconcile affected historical reward snapshots atomically. */
export async function createRewardRule(userId: string, cardId: string, input: RewardRuleInput) {
  return prisma.$transaction(async (db) => {
    await getOwnedCard(userId, cardId, db);
    const rule = await db.rewardCategory.create({ data: {
      ...input,
      cardId,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
    } });
    const card = await getOwnedCard(userId, cardId, db);
    await syncCardRewards(db, card, rule.startDate ? dayStart(rule.startDate) : new Date(0));
    return rule;
  });
}

/** Delete an owned rule and reconcile reward snapshots that previously used it. */
export async function deleteRewardRule(userId: string, id: string) {
  await prisma.$transaction(async (db) => {
    const rule = await db.rewardCategory.findFirst({ where: { id, card: { userId } } });
    if (!rule) throw new ApiError(404, "RULE_NOT_FOUND", "Reward rule could not be found.");
    await db.rewardCategory.delete({ where: { id } });
    const card = await getOwnedCard(userId, rule.cardId, db);
    await syncCardRewards(db, card, rule.startDate ? dayStart(rule.startDate) : new Date(0));
  });
}
