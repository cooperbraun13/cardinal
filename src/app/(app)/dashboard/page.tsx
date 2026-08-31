import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/services/data";
import { formatCurrency, formatShortDate, formatNumber, daysUntil } from "@/lib/format";
import { CardGrid } from "@/components/CardGrid";
import { SpendingCategoryChart } from "@/components/SpendingCategoryChart";
import { TransactionTable } from "@/components/TransactionTable";
import { BestCardWidget } from "@/components/BestCardWidget";
import { SignupBonusProgress } from "@/components/SignupBonusProgress";
import { AddCardButton, AddTransactionButton } from "@/components/AddButtons";

export const metadata = { title: "Overview — Cardinal" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = await getDashboardData(user.id);
  const { totals } = data;

  if (data.cards.length === 0) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Cardinal</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Add your first credit card to start tracking balances, rewards, and benefits.
        </p>
        <div className="mt-6 flex justify-center">
          <AddCardButton label="Add your first card" size="default" />
        </div>
      </div>
    );
  }

  const delta = totals.spendDeltaPct;

  return (
    <div className="space-y-8">
      {/* Header: greeting + hero balance, actions right */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-lg text-muted-foreground">Welcome back,</p>
          <h1 className="text-5xl font-bold tracking-tight">{user.name.split(" ")[0]}</h1>
          <p className="mt-6 text-sm text-muted-foreground">Total balance</p>
          <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">
            {formatCurrency(totals.totalBalance)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            {delta !== null && (
              <span className="flex items-center gap-1 font-medium text-primary">
                {delta >= 0 ? (
                  <ArrowUpIcon className="size-3.5" />
                ) : (
                  <ArrowDownIcon className="size-3.5" />
                )}
                {Math.abs(delta).toFixed(1)}% spend vs last month
              </span>
            )}
            <span className="flex items-center gap-1 text-muted-foreground">
              <ArrowUpIcon className="size-3.5" />
              {formatCurrency(totals.rewardsValueThisMonth)} rewards this month
            </span>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <AddTransactionButton cards={data.cards} />
          <AddCardButton variant="outline" />
        </div>
      </div>

      <CardGrid cards={data.cards} />

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="min-w-0 space-y-5">
          <section className="panel p-5 sm:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-bold tracking-tight">Spending</h2>
              <span className="text-[13px] text-muted-foreground">This month</span>
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
              {formatCurrency(totals.spendThisMonth)}
            </p>
            <div className="mt-5">
              <SpendingCategoryChart data={data.spendingByCategory} />
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-bold tracking-tight">Recent activity</h2>
              <Link
                href="/transactions"
                className="text-[13px] font-semibold text-primary hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="mt-1">
              <TransactionTable transactions={data.recentTransactions} />
            </div>
          </section>

          {data.bonuses.length > 0 && (
            <section className="panel p-5 sm:p-6">
              <h2 className="text-base font-bold tracking-tight">Signup bonuses</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {data.bonuses.map((b) => (
                  <SignupBonusProgress key={b.id} bonus={b} flat />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right rail */}
        <div className="space-y-5">
          <BestCardWidget />

          <section className="panel p-5">
            <h2 className="text-base font-bold tracking-tight">Upcoming payments</h2>
            <div className="mt-4 space-y-4">
              {data.upcomingDueDates.map((d) => (
                <div key={d.cardId} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.cardName}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
                      {formatShortDate(d.dueDate)} · in {daysUntil(d.dueDate)}d
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium tabular-nums">
                    {formatCurrency(d.balance)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <h2 className="text-base font-bold tracking-tight">Benefits</h2>
            <p className="mt-3 text-sm font-semibold">
              You have {formatCurrency(totals.rewardsValueThisMonth)} in rewards
            </p>
            {totals.pointsThisMonth > 0 && (
              <p className="mt-1 text-[13px] text-muted-foreground">
                {formatNumber(totals.pointsThisMonth)} points earned this month
              </p>
            )}
            {data.expiringBenefits.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                {data.expiringBenefits.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="min-w-0 truncate text-muted-foreground">
                      {b.name} expires {b.expiry ? formatShortDate(b.expiry) : "soon"}
                    </span>
                    <span className="shrink-0 tabular-nums">{formatCurrency(b.remaining)}</span>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/benefits"
              className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
            >
              View all benefits <ArrowRightIcon className="size-3.5" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
