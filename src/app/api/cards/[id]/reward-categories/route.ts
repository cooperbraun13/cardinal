import { NextResponse } from "next/server";
import { handleApi, requireUser } from "@/lib/api";
import { rewardCategorySchema } from "@/lib/validation";
import { createRewardRule } from "@/services/reward-rules";

type Params = { params: Promise<{ id: string }> };

export const POST = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  const body = rewardCategorySchema.parse(await req.json());
  const rule = await createRewardRule(user.id, id, body);
  return NextResponse.json(rule, { status: 201 });
});
