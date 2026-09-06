import "server-only";
import { prisma } from "@/lib/db";
import { getOwnedCard } from "@/lib/ownership";
import type { signupBonusSchema } from "@/lib/validation";
import type { z } from "zod";

type SignupBonusInput = z.infer<typeof signupBonusSchema>;

/** Serialize the MVP's one-bonus-per-card upsert with its ownership check. */
export async function upsertSignupBonus(userId: string, cardId: string, input: SignupBonusInput) {
  return prisma.$transaction(async (db) => {
    const card = await getOwnedCard(userId, cardId, db);
    const data = { ...input, deadline: new Date(input.deadline) };
    const existing = card.signupBonuses[0];
    const bonus = existing
      ? await db.signupBonus.update({ where: { id: existing.id }, data })
      : await db.signupBonus.create({ data: { ...data, cardId } });
    return { bonus, created: !existing };
  });
}
