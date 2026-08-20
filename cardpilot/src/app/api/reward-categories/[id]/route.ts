import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser, ApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export const DELETE = handleApi(async (_req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  const rule = await prisma.rewardCategory.findFirst({
    where: { id, card: { userId: user.id } },
  });
  if (!rule) throw new ApiError(404, "RULE_NOT_FOUND", "Reward rule could not be found.");
  await prisma.rewardCategory.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
});
