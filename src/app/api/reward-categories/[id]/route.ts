import { NextResponse } from "next/server";
import { handleApi, requireUser } from "@/lib/api";
import { deleteRewardRule } from "@/services/reward-rules";

type Params = { params: Promise<{ id: string }> };

export const DELETE = handleApi(async (_req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  await deleteRewardRule(user.id, id);
  return new NextResponse(null, { status: 204 });
});
