import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { handleApi } from "@/lib/api";

export const POST = handleApi(async () => {
  await destroySession();
  return new NextResponse(null, { status: 204 });
});
