import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { getOwnedBenefit } from "@/lib/ownership";
import { benefitUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export const PATCH = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  await getOwnedBenefit(user.id, id);
  const body = benefitUpdateSchema.parse(await req.json());
  const benefit = await prisma.benefit.update({
    where: { id },
    data: {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      expirationDate:
        body.expirationDate === undefined
          ? undefined
          : body.expirationDate
            ? new Date(body.expirationDate)
            : null,
    },
  });
  return NextResponse.json(benefit);
});

export const DELETE = handleApi(async (_req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  await getOwnedBenefit(user.id, id);
  await prisma.benefit.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
});
