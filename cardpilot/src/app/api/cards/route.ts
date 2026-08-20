import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { cardSchema } from "@/lib/validation";

export const GET = handleApi(async () => {
  const user = await requireUser();
  const cards = await prisma.card.findMany({
    where: { userId: user.id },
    include: { rewardCategories: true, signupBonuses: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(cards);
});

export const POST = handleApi(async (req: Request) => {
  const user = await requireUser();
  const body = cardSchema.parse(await req.json());
  const card = await prisma.card.create({
    data: {
      ...body,
      openedAt: body.openedAt ? new Date(body.openedAt) : null,
      userId: user.id,
    },
  });
  return NextResponse.json(card, { status: 201 });
});
