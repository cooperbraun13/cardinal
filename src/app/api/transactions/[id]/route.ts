import { NextResponse } from "next/server";
import { handleApi, requireUser } from "@/lib/api";
import { transactionUpdateSchema } from "@/lib/validation";
import { deleteTransactionWithEffects, updateTransactionWithEffects } from "@/services/transactions";

type Params = { params: Promise<{ id: string }> };

export const PATCH = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  const body = transactionUpdateSchema.parse(await req.json());
  const updated = await updateTransactionWithEffects(user.id, id, {
    ...body,
    transactionDate: body.transactionDate ? new Date(body.transactionDate) : undefined,
  });
  return NextResponse.json(updated);
});

export const DELETE = handleApi(async (_req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  await deleteTransactionWithEffects(user.id, id);
  return new NextResponse(null, { status: 204 });
});
