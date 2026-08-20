import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { getOwnedCard } from "@/lib/ownership";
import { benefitSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export const POST = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  await getOwnedCard(user.id, id);
  const body = benefitSchema.parse(await req.json());
  const benefit = await prisma.benefit.create({
    data: {
      ...body,
      cardId: id,
      startDate: new Date(body.startDate),
      expirationDate: body.expirationDate ? new Date(body.expirationDate) : null,
    },
  });
  return NextResponse.json(benefit, { status: 201 });
});
