import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { getOwnedCard } from "@/lib/ownership";
import { rewardCategorySchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export const POST = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  await getOwnedCard(user.id, id);
  const body = rewardCategorySchema.parse(await req.json());
  const rule = await prisma.rewardCategory.create({
    data: {
      ...body,
      cardId: id,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });
  return NextResponse.json(rule, { status: 201 });
});
