import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { daysUntil, formatCurrency, formatNumber, formatShortDate } from "@/lib/format";
import { getDashboardData } from "@/services/data";
import { AddCardButton, AddTransactionButton } from "@/components/AddButtons";
import { BestCardWidget } from "@/components/BestCardWidget";
import { CardGrid } from "@/components/CardGrid";
import { Metric } from "@/components/Metric";
import { SectionHeader } from "@/components/SectionHeader";
import { SignupBonusProgress } from "@/components/SignupBonusProgress";
import { SpendingCategoryChart } from "@/components/SpendingCategoryChart";
import { TransactionTable } from "@/components/TransactionTable";
import { UtilizationBar } from "@/components/UtilizationBar";

export const metadata = { title: "Overview - Cardinal" };

const textLink =
  "inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-[#f07984] focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const data = await getDashboardData(user.id);
  const { totals } = data;
  const firstName = user.name.trim().split(/\s+/)[0] || "there";

  if (data.cards.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
        <p className="eyebrow">Welcome to Cardinal</p>
        <h1 className="page-title mt-3">Your cards, in one clear view.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Add your first credit card to start tracking balances, rewards, benefits, and the best
          card for every purchase.
        </p>
        <div className="mt-7">
          <AddCardButton label="Add your first card" size="default" />
        </div>
      </div>
    );
  }

  const delta = totals.spendDeltaPct;

  return (
    <div className="page-stack">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="page-title mt-2">Welcome back, {firstName}.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here is what is happening across your cards right now.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AddTransactionButton cards={data.cards} />
          <AddCardButton variant="outline" />
        </div>
      </header>

      <section aria-label="Financial summary" className="border-y border-border py-6 sm:py-7">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.35fr_repeat(3,1fr)] lg:gap-0">
          <Metric
            label="Total balance"
            value={formatCurrency(totals.totalBalance)}
            emphasis
            className="lg:pr-8"
            detail={
              delta !== null ? (
                <span
                  className={
                    delta > 0
                      ? "inline-flex items-center gap-1 text-primary"
                      : "inline-flex items-center gap-1 text-positive"
                  }
                >
                  {delta > 0 ? (
                    <ArrowUpIcon className="size-3.5" />
                  ) : (
                    <ArrowDownIcon className="size-3.5" />
                  )}
                  {Math.abs(delta).toFixed(1)}% spending vs last month
                </span>
              ) : (
                "Across all active cards"
              )
            }
          />
          <Metric
            label="Available credit"
            value={formatCurrency(totals.availableCredit)}
            detail={`of ${formatCurrency(totals.totalLimit)} total limit`}
            className="border-border lg:border-l lg:px-8"
          />
          <Metric
            label="Utilization"
            value={`${totals.overallUtilization.toFixed(1)}%`}
            detail={totals.overallUtilization < 30 ? "Within the recommended range" : "Above 30%"}
            className="border-border lg:border-l lg:px-8"
          >
            <UtilizationBar
              value={totals.overallUtilization}
              className="mt-3 max-w-40"
              trackClassName="bg-muted"
            />
          </Metric>
          <Metric
            label="Rewards this month"
            value={formatCurrency(totals.rewardsValueThisMonth)}
            detail={
              totals.pointsThisMonth > 0
                ? `${formatNumber(totals.pointsThisMonth)} points and miles earned`
                : "Calculated from posted purchases"
            }
            className="border-border lg:border-l lg:pl-8"
          />
        </div>
      </section>

      <section aria-labelledby="cards-heading" className="min-w-0">
        <SectionHeader
          className="mb-4"
          title={<span id="cards-heading">Your cards</span>}
          description={
            data.cards.length > 3
              ? `Showing 3 of ${data.cards.length} active cards`
              : `${data.cards.length} active ${data.cards.length === 1 ? "card" : "cards"}`
          }
          action={
            <Link href="/cards" className={textLink}>
              View all cards
              <ArrowRightIcon className="size-3.5" />
            </Link>
          }
        />
        <CardGrid cards={data.cards} />
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="grid min-w-0 gap-5">
          <section className="panel p-5 sm:p-6" aria-labelledby="spending-heading">
            <SectionHeader
              title={<span id="spending-heading">Spending</span>}
              description="Posted purchases by category"
              action={<span className="text-xs text-muted-foreground">This month</span>}
            />
            <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] tabular-nums">
              {formatCurrency(totals.spendThisMonth)}
            </p>
            <div className="mt-6">
              <SpendingCategoryChart data={data.spendingByCategory} />
            </div>
          </section>

          <section className="panel p-5 sm:p-6" aria-labelledby="activity-heading">
            <SectionHeader
              title={<span id="activity-heading">Recent activity</span>}
              description="Latest activity across every card"
              action={
                <Link href="/transactions" className={textLink}>
                  View all
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              }
            />
            <div className="mt-3">
              <TransactionTable transactions={data.recentTransactions} linkRows />
            </div>
          </section>
        </div>

        <aside className="grid gap-5" aria-label="Card recommendations and payments">
          <BestCardWidget />

          <section className="panel p-5 sm:p-6" aria-labelledby="payments-heading">
            <SectionHeader
              title={<span id="payments-heading">Upcoming payments</span>}
              description="Next statement due dates"
              action={
                <Link href="/cards" className={textLink}>
                  View all
                </Link>
              }
            />
            <div className="mt-4 divide-y divide-border">
              {data.upcomingDueDates.slice(0, 4).map((payment) => {
                const days = daysUntil(payment.dueDate);
                return (
                  <Link
                    key={payment.cardId}
                    href={`/cards/${payment.cardId}`}
                    className="group flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium transition-colors group-hover:text-primary">
                        {payment.cardName}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {formatShortDate(payment.dueDate)} - {days === 0 ? "due today" : `in ${days}d`}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-medium tabular-nums">
                      {formatCurrency(payment.balance)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="panel p-5 sm:p-6" aria-labelledby="benefits-heading">
            <SectionHeader
              title={<span id="benefits-heading">Benefits</span>}
              description="Credits and perks that need attention"
              action={
                <Link href="/benefits" className={textLink}>
                  View all
                </Link>
              }
            />
            {data.expiringBenefits.length > 0 ? (
              <div className="mt-4 divide-y divide-border">
                {data.expiringBenefits.slice(0, 3).map((benefit) => (
                  <Link
                    key={benefit.id}
                    href="/benefits"
                    className="group flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium transition-colors group-hover:text-primary">
                        {benefit.name}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {benefit.cardName}
                        {benefit.expiry ? ` / expires ${formatShortDate(benefit.expiry)}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-medium tabular-nums">
                      {formatCurrency(benefit.remaining)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                No active benefits are expiring soon.
              </p>
            )}
          </section>
        </aside>
      </div>

      {data.bonuses.length > 0 && (
        <section aria-labelledby="bonuses-heading">
          <SectionHeader
            className="mb-4"
            title={<span id="bonuses-heading">Signup bonus progress</span>}
            description="Eligible posted purchases within each offer window"
            action={
              <Link href="/cards" className={textLink}>
                View cards
                <ArrowRightIcon className="size-3.5" />
              </Link>
            }
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {data.bonuses.map((bonus) => (
              <SignupBonusProgress key={bonus.id} bonus={bonus} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
