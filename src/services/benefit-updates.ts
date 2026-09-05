import "server-only";
import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/api";
import { getOwnedBenefit } from "@/lib/ownership";
import { benefitSchema, benefitUpdateSchema } from "@/lib/validation";
import { benefitStatus } from "@/services/benefits";
import type { z } from "zod";

/** Read, validate the merged state, and apply usage in the same transaction. */
export async function updateBenefit(userId: string, id: string, input: z.infer<typeof benefitUpdateSchema>) {
  return prisma.$transaction(async (db) => {
    const existing = await getOwnedBenefit(userId, id, db);
    const { usageDelta, ...patch } = input;
    if (usageDelta !== undefined && !["available", "partial", "expiring"].includes(benefitStatus(existing))) {
      throw new ApiError(409, "BENEFIT_UNAVAILABLE", "This benefit is not available for use.");
    }
    const body = benefitSchema.parse({
      ...existing,
      startDate: existing.startDate.toISOString(),
      expirationDate: existing.expirationDate?.toISOString() ?? null,
      ...patch,
      ...(usageDelta === undefined ? {} : {
        usedValue: Math.min(existing.totalValue, Math.round((existing.usedValue + usageDelta) * 100) / 100),
      }),
    });
    return db.benefit.update({ where: { id }, data: {
      ...body, startDate: new Date(body.startDate),
      expirationDate: body.expirationDate ? new Date(body.expirationDate) : null,
    } });
  });
}
