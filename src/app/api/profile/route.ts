import { NextResponse } from "next/server";
import { handleApi, requireUser } from "@/lib/api";
import { profileUpdateSchema } from "@/lib/validation";
import {
  getFinancialProfile,
  saveFinancialProfile,
} from "@/features/profile/service";

export const GET = handleApi(async () => {
  const user = await requireUser();
  return NextResponse.json(await getFinancialProfile(user.id));
});

export const PUT = handleApi(async (req: Request) => {
  const user = await requireUser();
  const values = profileUpdateSchema.parse(await req.json());
  return NextResponse.json(await saveFinancialProfile(user.id, values));
});
