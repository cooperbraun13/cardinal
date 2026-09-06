import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate, nextOccurrence } from "@/lib/format";
import {
  benefitRemaining,
  benefitStatus,
  effectiveExpiry,
} from "@/services/benefits";
import { bonusProgress, eligibleSpend } from "@/services/bonuses";
import { utilization } from "@/services/rewards";
import { AddTransactionButton } from "@/components/AddButtons";
import { BenefitProgress } from "@/components/BenefitProgress";
import {
  AddBenefitButton,
  CardActions,
  RewardRules,
  SetBonusButton,
} from "@/components/CardDetailActions";
import { CreditCardTile } from "@/components/CreditCardTile";
import { Metric } from "@/components/Metric";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { SignupBonusProgress } from "@/components/SignupBonusProgress";
import { TransactionTable } from "@/components/TransactionTable";
import { EmptyState } from "@/components/EmptyState";
import { UtilizationBar } from "@/components/UtilizationBar";

export const metadata = { title: "Card details - Cardinal" };

export default async function CardDetailPage({
  params,
}: PageProps<"/cards/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;

  const card = await prisma.card.findFirst({
    where: { id, userId: user.id },
    include: {
      rewardCategories: true,
      benefits: true,
      signupBonuses: true,
      transactions: {
        orderBy: { transactionDate: "desc" },
        take: 10,
        include: { rewards: true },
      },
    },
  });
  if (!card) notFound();

  const utilizationRate = utilization(card.currentBalance, card.creditLimit);
  const now = new Date();
  const bonus = card.signupBonuses[0];
  let bonusView = null;

  if (bonus) {
    const transactions = await prisma.transaction.findMany({
      where: { cardId: card.id },
      select: {
        amount: true,
        status: true,
        isRefund: true,
        transactionDate: true,
      },
    });
    const spend = eligibleSpend(transactions, {
      openedAt: card.openedAt,
      deadline: bonus.deadline,
    });
    bonusView = {
      ...bonus,
      eligibleSpend: spend,
      progress: bonusProgress(spend, bonus.spendRequirement),
      met: bonus.completed || spend >= bonus.spendRequirement,
      card: { name: card.name },
    };
  }

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow={
          <Link
            href="/cards"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
          >
            <ArrowLeftIcon className="size-3.5" />
            All cards
          </Link>
        }
        title={card.name}
        description={
          <>
            {card.issuer}
            {card.openedAt ? ` / opened ${formatDate(card.openedAt)}` : ""}
          </>
        }
        actions={
          <>
            <AddTransactionButton
              cards={[{ id: card.id, name: card.name }]}
              defaultCardId={card.id}
            />
            <CardActions
              card={{
                id: card.id,
                name: card.name,
                issuer: card.issuer,
                network: card.network ?? "",
                lastFour: card.lastFour ?? "",
                creditLimit: String(card.creditLimit),
                currentBalance: String(card.currentBalance),
                annualFee: String(card.annualFee),
                statementDay: String(card.statementDay),
                dueDay: String(card.dueDay),
                openedAt: card.openedAt
                  ? card.openedAt.toISOString().slice(0, 10)
                  : "",
                cardTheme: card.cardTheme,
              }}
            />
          </>
        }
      />

      <section className="grid items-start gap-design-md xl:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <CreditCardTile card={card} />
        <div className="panel panel-body">
          <div className="grid gap-design-sm sm:grid-cols-2">
            <Metric
              label="Balance"
              value={formatCurrency(card.currentBalance)}
            />
            <Metric
              label="Available credit"
              value={formatCurrency(
                Math.max(0, card.creditLimit - card.currentBalance),
              )}
              detail={`${formatCurrency(card.creditLimit)} limit`}
            />
            <Metric
              label="Payment due"
              value={formatDate(nextOccurrence(card.dueDay))}
              detail={`Statement closes ${formatDate(nextOccurrence(card.statementDay))}`}
            />
            <Metric
              label="Annual fee"
              value={
                card.annualFee > 0 ? formatCurrency(card.annualFee) : "None"
              }
            />
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <div className="mb-3 flex items-center justify-between gap-4 text-xs">
              <span className="font-medium">Credit utilization</span>
              <span className="font-semibold tabular-nums">
                {utilizationRate.toFixed(1)}%
              </span>
            </div>
            <UtilizationBar
              value={utilizationRate}
              className="max-w-xl"
              trackClassName="bg-muted"
            />
          </div>
        </div>
      </section>
      <section className="panel panel-body" aria-label="Reward categories">
        <SectionHeader
          className="mb-design-sm"
          title="How this card earns"
          description="Your earning rules, promotional windows, and spending caps"
        />
        <RewardRules cardId={card.id} rules={card.rewardCategories} />
      </section>

      <div className="grid min-w-0 items-start gap-design-md xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section aria-labelledby="card-transactions-heading">
          <SectionHeader
            className="mb-4"
            title={
              <span id="card-transactions-heading">Recent transactions</span>
            }
            description="The 10 latest purchases and refunds on this card"
          />
          <div className="panel px-5">
            <TransactionTable
              transactions={card.transactions}
              showCard={false}
              allowDelete
            />
          </div>
        </section>

        <div className="grid gap-design-sm">
          <section aria-labelledby="card-benefits-heading">
            <SectionHeader
              className="mb-4"
              title={<span id="card-benefits-heading">Benefits</span>}
              description="Credits and perks attached to this card"
              action={<AddBenefitButton cardId={card.id} />}
            />
            {card.benefits.length === 0 ? (
              <EmptyState
                title="Make room for the extras"
                description="Add a credit or perk to keep its value and expiration in view."
                className="panel"
              />
            ) : (
              <div className="grid gap-3">
                {card.benefits.map((benefit) => (
                  <BenefitProgress
                    key={benefit.id}
                    benefit={{
                      ...benefit,
                      remaining: benefitRemaining(benefit),
                      status: benefitStatus(benefit, now),
                      effectiveExpiry: effectiveExpiry(benefit, now),
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="card-bonus-heading">
            <SectionHeader
              className="mb-4"
              title={<span id="card-bonus-heading">Signup bonus</span>}
              description="Eligible posted spend toward the welcome offer"
              action={
                <SetBonusButton
                  cardId={card.id}
                  initial={
                    bonus
                      ? {
                          spendRequirement: bonus.spendRequirement,
                          rewardAmount: bonus.rewardAmount,
                          rewardType: bonus.rewardType,
                          deadline: bonus.deadline.toISOString().slice(0, 10),
                        }
                      : undefined
                  }
                />
              }
            />
            {bonusView ? (
              <SignupBonusProgress bonus={bonusView} />
            ) : (
              <EmptyState
                title="Something to work toward"
                description="Add your welcome offer to follow your eligible spending progress."
                className="panel"
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
