import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRightIcon, WalletCardsIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/services/data";
import { formatCurrency } from "@/lib/format";
import { MONEY_LINKS } from "@/lib/navigation";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { Metric } from "@/components/Metric";
import { UtilizationBar } from "@/components/UtilizationBar";
import { TransactionTable } from "@/components/TransactionTable";
import { EmptyState } from "@/components/EmptyState";
import { AddCardButton, AddTransactionButton } from "@/components/AddButtons";

export const metadata = { title: "Money - Cardinal" };

export default async function MoneyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = await getDashboardData(user.id);
  const hasActiveCards = data.cards.length > 0;

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Money / Summary"
        title="Your money at a glance."
        description="Your manually tracked credit cards, with the details that matter up front."
        actions={
          hasActiveCards ? (
            <AddTransactionButton cards={data.cards} />
          ) : undefined
        }
      />
      {hasActiveCards ? (
        <section
          className="grid gap-design-md border-y border-border py-design-md lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
          aria-label="Credit card summary"
        >
          <Metric
            label="Total card balance"
            value={formatCurrency(data.totals.totalBalance)}
            emphasis
            detail={`Across ${data.cards.length} active ${data.cards.length === 1 ? "card" : "cards"}`}
          />
          <div className="min-w-0 lg:border-l lg:border-border lg:pl-design-md">
            <div className="flex flex-wrap items-baseline justify-between gap-design-xs">
              <p className="eyebrow">Credit in use</p>
              <p className="text-3xl font-medium tabular-nums">
                {data.totals.overallUtilization.toFixed(1)}%
              </p>
            </div>
            <UtilizationBar
              value={data.totals.overallUtilization}
              className="mt-design-sm"
            />
            <p className="mt-design-xs text-sm text-muted-foreground">
              {formatCurrency(data.totals.availableCredit)} available of{" "}
              {formatCurrency(data.totals.totalLimit)}
            </p>
            <Link href="/cards" className="text-link mt-design-xs">
              Review your cards{" "}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : (
        <EmptyState
          icon={WalletCardsIcon}
          title="No active cards yet."
          description="Add a card to bring active balances and credit limits into view."
          action={<AddCardButton label="Add a card" size="default" />}
          className="border-y border-border"
        />
      )}
      <div className="grid items-start gap-design-lg xl:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="min-w-0" aria-labelledby="money-activity-heading">
          <SectionHeader
            title={<span id="money-activity-heading">Recent activity</span>}
            description="Your latest recorded purchases and refunds"
            action={
              <Link href="/transactions" className="text-link">
                All activity{" "}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-design-sm">
            <TransactionTable transactions={data.recentTransactions} linkRows />
          </div>
        </section>
        <aside
          className="min-w-0 border-t border-border pt-design-sm xl:border-t-0 xl:border-l xl:pt-0 xl:pl-design-sm"
          aria-labelledby="money-tools-heading"
        >
          <h2 id="money-tools-heading" className="text-xl font-medium">
            Your money tools
          </h2>
          <nav
            aria-label="Money tools"
            className="mt-design-xs divide-y divide-border"
          >
            {MONEY_LINKS.filter(({ href }) => href !== "/money").map(
              ({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex min-h-12 items-center justify-between gap-design-xs py-design-xs text-sm transition-colors hover:bg-muted"
                >
                  {label}
                  <ArrowRightIcon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              ),
            )}
          </nav>
        </aside>
      </div>
    </div>
  );
}
