import { NextResponse } from "next/server";
import { handleApi, requireUser } from "@/lib/api";
import { getDashboardData } from "@/services/data";

export const GET = handleApi(async () => {
  const user = await requireUser();
  return NextResponse.json(await getDashboardData(user.id));
});
