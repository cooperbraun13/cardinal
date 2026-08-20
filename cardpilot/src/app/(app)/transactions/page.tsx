import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionFilters } from "@/components/TransactionFilters";
import { AddTransactionButton } from "@/components/AddButtons";
import { Button } from "@/components/ui/button";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Transactions — CardPilot" };

const PAGE_SIZE = 25;

export default async function TransactionsPage({ searchParams }: PageProps<"/transactions">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const q = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const where: Prisma.TransactionWhereInput = { userId: user.id };
  const cardId = first(q.cardId);
  const category = first(q.category);
  const status = first(q.status);
  const search = first(q.search);
  const from = first(q.from);
  const to = first(q.to);
  if (cardId) where.cardId = cardId;
  if (category) where.category = category;
  if (status) where.status = status;
  if (search) where.merchant = { contains: search };
  if (from || to) {
    where.transactionDate = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to + "T23:59:59.999") } : {}),
    };
  }

  const page = Math.max(1, parseInt(first(q.page) ?? "1", 10) || 1);
  const [cards, total, transactions] = await Promise.all([
    prisma.card.findMany({
      where: { userId: user.id, active: true },
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    }),
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
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageLink = (p: number) => {
    const next = new URLSearchParams();
    for (const key of ["cardId", "category", "status", "search", "from", "to"]) {
      const v = first(q[key]);
      if (v) next.set(key, v);
    }
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return `/transactions${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Transactions</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {total} {total === 1 ? "transaction" : "transactions"}
          </p>
        </div>
        <AddTransactionButton cards={cards} />
      </div>

      <TransactionFilters cards={cards} />

      <div className="glass rounded-2xl border border-border px-4 py-1 sm:px-5">
        <TransactionTable transactions={transactions} allowDelete />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            render={page > 1 ? <Link href={pageLink(page - 1)} /> : undefined}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            render={page < totalPages ? <Link href={pageLink(page + 1)} /> : undefined}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
