import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AddTransactionButton } from "@/components/AddButtons";
import { PageHeader } from "@/components/PageHeader";
import { TransactionFilters } from "@/components/TransactionFilters";
import { TransactionTable } from "@/components/TransactionTable";
import { Button } from "@/components/ui/button";
import { dayAfter, dayStart } from "@/lib/dates";
import { dateString } from "@/lib/validation";

export const metadata = { title: "Transactions - Cardinal" };

const PAGE_SIZE = 25;

export default async function TransactionsPage({
  searchParams,
}: PageProps<"/transactions">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const query = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const where: Prisma.TransactionWhereInput = { userId: user.id };
  const cardId = first(query.cardId);
  const category = first(query.category);
  const status = first(query.status);
  const search = first(query.search);
  const from = first(query.from);
  const to = first(query.to);
  const validFrom = from ? dateString.safeParse(from) : null;
  const validTo = to ? dateString.safeParse(to) : null;

  if (cardId) where.cardId = cardId;
  if (category) where.category = category;
  if (status) where.status = status;
  if (search) where.merchant = { contains: search };
  if (validFrom?.success || validTo?.success) {
    where.transactionDate = {
      ...(validFrom?.success ? { gte: dayStart(validFrom.data) } : {}),
      ...(validTo?.success ? { lt: dayAfter(validTo.data) } : {}),
    };
  }

  const page = Math.max(1, parseInt(first(query.page) ?? "1", 10) || 1);
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
        rewards: {
          select: { rewardAmount: true, rewardType: true, multiplier: true },
        },
      },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageLink = (targetPage: number) => {
    const next = new URLSearchParams();
    for (const key of [
      "cardId",
      "category",
      "status",
      "search",
      "from",
      "to",
    ]) {
      const value = first(query[key]);
      if (value) next.set(key, value);
    }
    if (targetPage > 1) next.set("page", String(targetPage));
    const queryString = next.toString();
    return `/transactions${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Activity"
        title="Follow the everyday."
        description="Every purchase, refund, and reward. A little more context for your spending."
        actions={<AddTransactionButton cards={cards} />}
      />

      <section
        className="panel overflow-hidden"
        aria-label="Transaction history"
      >
        <div className="border-b border-border p-4 sm:p-6">
          <TransactionFilters cards={cards} />
        </div>
        <div className="px-4 sm:px-6">
          <p
            className="border-b border-border py-4 text-xs text-muted-foreground"
            aria-live="polite"
          >
            {total} {total === 1 ? "transaction" : "transactions"}
            {total > 0 ? ` · Page ${page} of ${totalPages}` : ""}
          </p>
          <TransactionTable
            transactions={transactions}
            filtered={Boolean(
              cardId || category || status || search || from || to,
            )}
            allowDelete
          />
        </div>
      </section>

      {totalPages > 1 && (
        <nav
          aria-label="Transaction pages"
          className="flex items-center justify-center gap-3"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            nativeButton={page <= 1}
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
            nativeButton={page >= totalPages}
            render={
              page < totalPages ? <Link href={pageLink(page + 1)} /> : undefined
            }
          >
            Next
          </Button>
        </nav>
      )}
    </div>
  );
}
