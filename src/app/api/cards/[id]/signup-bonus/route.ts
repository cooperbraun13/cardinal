import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { getOwnedCard } from "@/lib/ownership";
import { signupBonusSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

/** Creates or replaces the card's signup bonus (one active bonus per card in the MVP). */
export const POST = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  const card = await getOwnedCard(user.id, id);
  const body = signupBonusSchema.parse(await req.json());
  const data = { ...body, deadline: new Date(body.deadline) };
  const existing = card.signupBonuses[0];
  const bonus = existing
    ? await prisma.signupBonus.update({ where: { id: existing.id }, data })
    : await prisma.signupBonus.create({ data: { ...data, cardId: id } });
  return NextResponse.json(bonus, { status: existing ? 200 : 201 });
});
