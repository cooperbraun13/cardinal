import "server-only";
import { prisma } from "@/lib/db";
import type { FinancialProfileValues } from "@/features/profile/types";

const profileSelect = {
  profileVersion: true,
  employmentStatus: true,
  annualIncomeRange: true,
  savingsRange: true,
  emergencyFundStatus: true,
  creditCardDebtStatus: true,
  otherDebtStatus: true,
  employer401kStatus: true,
  employerMatchStatus: true,
  investingExperience: true,
  riskComfort: true,
  primaryGoal: true,
} as const;

function hasAnswers(values: FinancialProfileValues) {
  return Object.values(values).some((value) => value !== null);
}

export async function getFinancialProfile(userId: string) {
  return prisma.financialProfile.findUnique({
    where: { userId },
    select: profileSelect,
  });
}

/**
 * Replaces the optional profile answers for one authenticated user. An all-empty
 * submission removes the profile record so unanswered values are never treated as data.
 */
export async function saveFinancialProfile(
  userId: string,
  values: FinancialProfileValues,
) {
  if (!hasAnswers(values)) {
    await prisma.financialProfile.deleteMany({ where: { userId } });
    return null;
  }

  return prisma.financialProfile.upsert({
    where: { userId },
    create: { userId, ...values },
    update: { ...values, profileVersion: { increment: 1 } },
    select: profileSelect,
  });
}
