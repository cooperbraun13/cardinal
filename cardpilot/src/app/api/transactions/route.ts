import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApi, requireUser } from "@/lib/api";
import { getOwnedCard } from "@/lib/ownership";
import { transactionSchema } from "@/lib/validation";
import { createTransactionWithEffects } from "@/services/data";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 25;

export const GET = handleApi(async (req: Request) => {
  const user = await requireUser();
  const url = new URL(req.url);
  const q = url.searchParams;

  const where: Prisma.TransactionWhereInput = { userId: user.id };
  if (q.get("cardId")) where.cardId = q.get("cardId")!;
  if (q.get("category")) where.category = q.get("category")!;
  if (q.get("status")) where.status = q.get("status")!;
  if (q.get("search")) where.merchant = { contains: q.get("search")! };
  const from = q.get("from");
  const to = q.get("to");
  if (from || to) {
    where.transactionDate = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to + "T23:59:59.999") } : {}),
    };
  }

  const page = Math.max(1, parseInt(q.get("page") ?? "1", 10) || 1);
  const [total, transactions] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: [{ transactionDate: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        card: { select: { name: true, cardTheme: true } },
        rewards: { select: { rewardAmount: true, rewardType: true, multiplier: true } },
      },
    }),
  ]);

  return NextResponse.json({
    transactions,
    page,
    pageSize: PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  });
});

export const POST = handleApi(async (req: Request) => {
  const user = await requireUser();
  const body = transactionSchema.parse(await req.json());
  const card = await getOwnedCard(user.id, body.cardId); // 404 if not owned
  const transaction = await createTransactionWithEffects(
    user.id,
    { ...body, transactionDate: new Date(body.transactionDate) },
    card
  );
  return NextResponse.json(transaction, { status: 201 });
});
