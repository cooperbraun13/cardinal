import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { handleApi, ApiError } from "@/lib/api";

export const POST = handleApi(async (req: Request) => {
  const body = registerSchema.parse(await req.json());
  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) throw new ApiError(409, "EMAIL_TAKEN", "An account with this email already exists.");
  const user = await prisma.user.create({
    data: { name: body.name, email: body.email, passwordHash: await hashPassword(body.password) },
  });
  await createSession(user.id);
  return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
});
