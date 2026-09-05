import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { getOwnedBenefit } from "@/lib/ownership";
import { benefitUpdateSchema } from "@/lib/validation";
import { updateBenefit } from "@/services/benefit-updates";

type Params = { params: Promise<{ id: string }> };

export const PATCH = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  const body = benefitUpdateSchema.parse(await req.json());
  const benefit = await updateBenefit(user.id, id, body);
  return NextResponse.json(benefit);
});

export const DELETE = handleApi(async (_req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  await getOwnedBenefit(user.id, id);
  await prisma.benefit.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
});
