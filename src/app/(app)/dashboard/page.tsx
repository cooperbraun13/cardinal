import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRightIcon, WalletCardsIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  daysUntil,
  formatCurrency,
  formatNumber,
  formatShortDate,
} from "@/lib/format";
import { getDashboardData } from "@/services/data";
import { AddCardButton, AddTransactionButton } from "@/components/AddButtons";
import { BestCardWidget } from "@/components/BestCardWidget";
import { CardGrid } from "@/components/CardGrid";
import { Metric } from "@/components/Metric";
import { CinematicHero } from "@/components/CinematicHero";
import { EmptyState } from "@/components/EmptyState";
import { SectionHeader } from "@/components/SectionHeader";
import { SignupBonusProgress } from "@/components/SignupBonusProgress";
import { SpendingCategoryChart } from "@/components/SpendingCategoryChart";
import { TransactionTable } from "@/components/TransactionTable";
import { UtilizationBar } from "@/components/UtilizationBar";

export const metadata = { title: "Overview - Cardinal" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = await getDashboardData(user.id);
  const { totals } = data;
  const firstName = user.name.trim().split(/\s+/)[0] || "there";
  const delta = totals.spendDeltaPct;

  if (data.cards.length === 0)
    return (
      <>
        <CinematicHero
          eyebrow="A fresh start"
          title={`Welcome, ${firstName}.`}
          description="A little clarity starts with your first card."
        />
        <div className="page-shell">
          <EmptyState
            icon={WalletCardsIcon}
            title="Your cards, all together."
            description="Add a credit card to see your balances, follow your rewards, and make the most of your benefits."
            action={
              <AddCardButton label="Add your first card" size="default" />
            }
            className="panel min-h-80"
          />
        </div>
      </>
    );

  return (
    <>
      <CinematicHero
        eyebrow="Your daily overview"
        title={
          <>
            Clarity.
            <br />
            Without compromise.
          </>
        }
        description={`Welcome back, ${firstName}. Your cards, rewards, and possibilities. All in perspective.`}
        actions={
          <>
            <AddTransactionButton cards={data.cards} />
            <AddCardButton variant="outline" />
          </>
        }
      />

      <div className="page-shell page-stack">
        <section
          aria-label="Financial summary"
          className="border-b border-border pb-design-lg"
        >
          <div className="grid gap-design-md lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <Metric
              label="Total card balance"
              value={formatCurrency(totals.totalBalance)}
              emphasis
              detail={`Across ${data.cards.length} active ${data.cards.length === 1 ? "card" : "cards"}`}
            />
            <div className="lg:border-l lg:border-border lg:pl-8">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <p className="text-sm text-muted-foreground">Credit in use</p>
                <p className="text-2xl font-medium tabular-nums">
                  {totals.overallUtilization.toFixed(1)}
                  <span className="text-base text-muted-foreground">%</span>
                </p>
              </div>
              <UtilizationBar
                value={totals.overallUtilization}
                trackClassName="bg-muted"
              />
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {formatCurrency(totals.availableCredit)} available of{" "}
                {formatCurrency(totals.totalLimit)}
                <br />
                {totals.overallUtilization >= 30
                  ? "Utilization is at or above 30%."
                  : "Utilization is below 30%."}
              </p>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-design-md xl:grid-cols-[minmax(0,1fr)_19rem]">
          <section className="min-w-0" aria-labelledby="cards-heading">
            <SectionHeader
              className="mb-design-sm"
              title={<span id="cards-heading">In your wallet</span>}
              description={
                data.cards.length > 2
                  ? `A look at 2 of your ${data.cards.length} cards`
                  : "Balances, limits, and what comes next"
              }
              action={
                <Link href="/cards" className="text-link">
                  All cards <ArrowRightIcon className="size-4" />
                </Link>
              }
            />
            <CardGrid cards={data.cards} maxCards={2} />
          </section>
          <section
            className="min-w-0 xl:border-l xl:border-border xl:pl-7"
            aria-labelledby="payments-heading"
          >
            <SectionHeader
              title={<span id="payments-heading">Coming up</span>}
              description="Your next payment dates"
            />
            <div className="mt-design-sm divide-y divide-border">
              {data.upcomingDueDates.slice(0, 4).map((payment) => {
                const days = daysUntil(payment.dueDate);
                return (
                  <Link
                    key={payment.cardId}
                    href={`/cards/${payment.cardId}`}
                    className="group flex gap-4 py-4"
                  >
                    <span className="flex w-11 shrink-0 flex-col items-center justify-center border border-border py-2 text-xs">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {new Date(payment.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          timeZone: "UTC",
                        })}
                      </span>
                      <span className="mt-1 text-lg tabular-nums">
                        {new Date(payment.dueDate).getUTCDate()}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-sm font-medium group-hover:text-foreground hover:underline">
                        {payment.cardName}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {formatCurrency(payment.balance)} balance
                      </span>
                      <span
                        className={`mt-1 block text-xs ${days <= 3 ? "text-destructive" : "text-muted-foreground"}`}
                      >
                        {days === 0 ? "Due today" : `Due in ${days} days`}
                      </span>
                    </span>
                  </Link>
                );
              })}
              {data.upcomingDueDates.length === 0 && (
                <p className="py-5 text-sm text-muted-foreground">
                  No upcoming payment dates.
                </p>
              )}
            </div>
            <Link href="/cards" className="text-link mt-2">
              Review your cards <ArrowRightIcon className="size-4" />
            </Link>
          </section>
        </div>

        <div className="grid items-start gap-design-sm xl:grid-cols-[minmax(0,1fr)_minmax(18rem,.75fr)]">
          <section
            className="panel panel-body"
            aria-labelledby="spending-heading"
          >
            <SectionHeader
              title={<span id="spending-heading">This month, so far</span>}
              description="Posted spending and earned reward value"
            />
            <div className="my-6 grid gap-design-sm sm:grid-cols-2">
              <Metric
                label="Spending"
                value={formatCurrency(totals.spendThisMonth)}
                detail={
                  delta !== null
                    ? `${Math.abs(delta).toFixed(1)}% ${delta > 0 ? "more" : "less"} than last month`
                    : "Your monthly spending starts here"
                }
              />
              <Metric
                label="Reward value"
                value={formatCurrency(totals.rewardsValueThisMonth)}
                detail={
                  totals.pointsThisMonth > 0
                    ? `${formatNumber(totals.pointsThisMonth)} points and miles earned`
                    : "From your posted purchases"
                }
              />
            </div>
            <SpendingCategoryChart data={data.spendingByCategory} />
          </section>
          <BestCardWidget />
        </div>

        <div className="grid items-start gap-design-md xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.75fr)]">
          <section className="min-w-0" aria-labelledby="activity-heading">
            <SectionHeader
              title={<span id="activity-heading">Recent activity</span>}
              description="The latest across your cards"
              action={
                <Link href="/transactions" className="text-link">
                  All activity <ArrowRightIcon className="size-4" />
                </Link>
              }
            />
            <div className="mt-4">
              <TransactionTable
                transactions={data.recentTransactions}
                linkRows
              />
            </div>
          </section>
          <section
            className="panel panel-body"
            aria-labelledby="benefits-heading"
          >
            <SectionHeader
              title={<span id="benefits-heading">Value worth using</span>}
              description="Keep these benefits on your radar"
            />
            {data.expiringBenefits.length > 0 ? (
              <div className="mt-4 divide-y divide-border">
                {data.expiringBenefits.slice(0, 3).map((benefit) => (
                  <Link
                    key={benefit.id}
                    href="/benefits"
                    className="group flex flex-wrap justify-between gap-2 py-4"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium group-hover:text-foreground hover:underline">
                        {benefit.name}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {benefit.cardName}
                      </span>
                      {benefit.expiry && (
                        <span className="mt-1 block text-xs text-foreground">
                          Ends {formatShortDate(benefit.expiry)}
                        </span>
                      )}
                    </span>
                    <span className="text-sm tabular-nums">
                      {formatCurrency(benefit.remaining)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="my-6 text-sm leading-6 text-muted-foreground">
                Nothing is expiring soon. You can review all your credits and
                perks anytime.
              </p>
            )}
            <Link href="/benefits" className="text-link mt-2">
              Explore benefits <ArrowRightIcon className="size-4" />
            </Link>
          </section>
        </div>

        {data.bonuses.length > 0 && (
          <section
            aria-labelledby="bonuses-heading"
            className="section-divider"
          >
            <SectionHeader
              className="mb-design-sm"
              title={<span id="bonuses-heading">Working toward something</span>}
              description="Your welcome offers and eligible spending progress"
            />
            <div className="grid gap-design-sm md:grid-cols-2">
              {data.bonuses.map((bonus) => (
                <SignupBonusProgress key={bonus.id} bonus={bonus} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
