import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { getOwnedCard } from "@/lib/ownership";
import { cardUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export const GET = handleApi(async (_req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  const card = await getOwnedCard(user.id, id);
  return NextResponse.json(card);
});

export const PATCH = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  await getOwnedCard(user.id, id);
  const body = cardUpdateSchema.parse(await req.json());
  const card = await prisma.card.update({
    where: { id },
    data: { ...body, openedAt: body.openedAt ? new Date(body.openedAt) : undefined },
  });
  return NextResponse.json(card);
});

export const DELETE = handleApi(async (_req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  await getOwnedCard(user.id, id);
  // Benefits, reward rules, bonuses, transactions, and rewards cascade via FK constraints.
  await prisma.card.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
});
