import {
  WalletIcon,
  PiggyBankIcon,
  GaugeIcon,
  SparklesIcon,
  CalendarClockIcon,
  TimerIcon,
  WalletCardsIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/services/data";
import { formatCurrency, formatShortDate, formatNumber, daysUntil } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { CardCarousel } from "@/components/CardCarousel";
import { UtilizationBar } from "@/components/UtilizationBar";
import { SpendingCategoryChart } from "@/components/SpendingCategoryChart";
import { TransactionTable } from "@/components/TransactionTable";
import { BestCardWidget } from "@/components/BestCardWidget";
import { SignupBonusProgress } from "@/components/SignupBonusProgress";
import { AddCardButton, AddTransactionButton } from "@/components/AddButtons";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Dashboard — CardPilot" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = await getDashboardData(user.id);
  const { totals } = data;

  const cardTiles = data.cards.map((c) => ({
    ...c,
    topCategories: c.rewardCategories.map((r) => ({
      category: r.category,
      multiplier: r.multiplier,
    })),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Here's how your cards are doing today.
          </p>
        </div>
        <div className="flex gap-2">
          <AddTransactionButton cards={data.cards} />
          <AddCardButton variant="outline" />
        </div>
      </div>

      {data.cards.length === 0 ? (
        <EmptyState
          icon={WalletCardsIcon}
          title="No cards yet"
          description="Add your first credit card to start tracking balances, rewards, and benefits."
          action={<AddCardButton label="Add your first card" size="default" />}
          className="py-16"
        />
      ) : (
        <>
          <CardCarousel cards={cardTiles} />

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Total Balance"
              value={formatCurrency(totals.totalBalance)}
              icon={WalletIcon}
            />
            <StatCard
              label="Available Credit"
              value={formatCurrency(totals.availableCredit)}
              sub={`of ${formatCurrency(totals.totalLimit, { compact: true })} total limit`}
              icon={PiggyBankIcon}
            />
            <StatCard
              label="Overall Utilization"
              value={`${totals.overallUtilization.toFixed(1)}%`}
              sub={<UtilizationBar value={totals.overallUtilization} className="mt-1" />}
              icon={GaugeIcon}
            />
            <StatCard
              label="Rewards This Month"
              value={`≈ ${formatCurrency(totals.rewardsValueThisMonth)}`}
              sub={
                totals.pointsThisMonth > 0
                  ? `${formatNumber(totals.pointsThisMonth)} points & miles earned`
                  : undefined
              }
              icon={SparklesIcon}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="glass rounded-2xl border border-border p-4 sm:p-5">
                <h2 className="text-sm font-semibold">Spending by category</h2>
                <p className="text-xs text-muted-foreground">This month, posted purchases</p>
                <div className="mt-3">
                  <SpendingCategoryChart data={data.spendingByCategory} />
                </div>
              </section>

              <section className="glass rounded-2xl border border-border p-4 sm:p-5">
                <h2 className="text-sm font-semibold">Recent transactions</h2>
                <div className="mt-2">
                  <TransactionTable transactions={data.recentTransactions} />
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <BestCardWidget />

              <section className="glass rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <CalendarClockIcon className="size-4 text-chart-3" />
                  <h2 className="text-sm font-semibold">Upcoming due dates</h2>
                </div>
                <div className="mt-3 space-y-2.5">
                  {data.upcomingDueDates.map((d) => (
                    <div key={d.cardId} className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`card-theme-${d.cardTheme} size-2.5 shrink-0 rounded-full`}
                        />
                        <span className="truncate">{d.cardName}</span>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatCurrency(d.balance)} · {formatShortDate(d.dueDate)} (
                        {daysUntil(d.dueDate)}d)
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <TimerIcon className="size-4 text-chart-4" />
                  <h2 className="text-sm font-semibold">Expiring benefits</h2>
                </div>
                <div className="mt-3 space-y-2.5">
                  {data.expiringBenefits.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Nothing expiring in the next two weeks.
                    </p>
                  ) : (
                    data.expiringBenefits.map((b) => (
                      <div key={b.id} className="flex items-center justify-between gap-2 text-sm">
                        <div className="min-w-0">
                          <p className="truncate">{b.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{b.cardName}</p>
                        </div>
                        <span className="shrink-0 text-xs text-amber-400">
                          {formatCurrency(b.remaining)} left
                          {b.expiry ? ` · ${formatShortDate(b.expiry)}` : ""}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>

          {data.bonuses.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold">Signup bonus progress</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.bonuses.map((b) => (
                  <SignupBonusProgress key={b.id} bonus={b} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
