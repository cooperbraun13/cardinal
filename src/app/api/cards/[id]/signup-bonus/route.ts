import { NextResponse } from "next/server";
import { handleApi, requireUser } from "@/lib/api";
import { signupBonusSchema } from "@/lib/validation";
import { upsertSignupBonus } from "@/services/signup-bonuses";

type Params = { params: Promise<{ id: string }> };

/** Creates or replaces the card's signup bonus (one active bonus per card in the MVP). */
export const POST = handleApi(async (req: Request, { params }: Params) => {
  const user = await requireUser();
  const { id } = await params;
  const body = signupBonusSchema.parse(await req.json());
  const { bonus, created } = await upsertSignupBonus(user.id, id, body);
  return NextResponse.json(bonus, { status: created ? 201 : 200 });
});
