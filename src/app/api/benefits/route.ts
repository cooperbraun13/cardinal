import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { benefitStatus, benefitRemaining, effectiveExpiry } from "@/services/benefits";

export const GET = handleApi(async () => {
  const user = await requireUser();
  const benefits = await prisma.benefit.findMany({
    where: { card: { userId: user.id } },
    include: { card: { select: { id: true, name: true, cardTheme: true } } },
    orderBy: { name: "asc" },
  });
  const now = new Date();
  return NextResponse.json(
    benefits.map((b) => ({
      ...b,
      remaining: benefitRemaining(b),
      status: benefitStatus(b, now),
      effectiveExpiry: effectiveExpiry(b, now),
    }))
  );
});
