import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { utilization } from "@/services/rewards";
import { eligibleSpend, bonusProgress } from "@/services/bonuses";
import { benefitStatus, benefitRemaining, effectiveExpiry } from "@/services/benefits";
import { formatCurrency, formatDate, nextOccurrence } from "@/lib/format";
import { CreditCardTile } from "@/components/CreditCardTile";
import { StatCard } from "@/components/StatCard";
import { TransactionTable } from "@/components/TransactionTable";
import { BenefitProgress } from "@/components/BenefitProgress";
import { SignupBonusProgress } from "@/components/SignupBonusProgress";
import {
  CardActions,
  RewardRules,
  AddBenefitButton,
  SetBonusButton,
} from "@/components/CardDetailActions";
import { AddTransactionButton } from "@/components/AddButtons";

export const metadata = { title: "Card details — Cardinal" };

export default async function CardDetailPage({ params }: PageProps<"/cards/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;

  // Ownership enforced in the query itself — someone else's card ID → 404.
  const card = await prisma.card.findFirst({
    where: { id, userId: user.id },
    include: {
      rewardCategories: true,
      benefits: true,
      signupBonuses: true,
      transactions: { orderBy: { transactionDate: "desc" }, take: 10, include: { rewards: true } },
    },
  });
  if (!card) notFound();

  const util = utilization(card.currentBalance, card.creditLimit);
  const now = new Date();

  const bonus = card.signupBonuses[0];
  let bonusView = null;
  if (bonus) {
    const allTxns = await prisma.transaction.findMany({
      where: { cardId: card.id },
      select: { amount: true, status: true, isRefund: true, transactionDate: true },
    });
    const spend = eligibleSpend(allTxns, { openedAt: card.openedAt, deadline: bonus.deadline });
    bonusView = {
      ...bonus,
      eligibleSpend: spend,
      progress: bonusProgress(spend, bonus.spendRequirement),
      met: bonus.completed || spend >= bonus.spendRequirement,
      card: { name: card.name },
    };
  }

  return (
    <div className="space-y-8">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,380px)_1fr]">
        <CreditCardTile card={card} />
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{card.name}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {card.issuer}
                {card.openedAt ? ` · Opened ${formatDate(card.openedAt)}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
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
                  openedAt: card.openedAt ? card.openedAt.toISOString().slice(0, 10) : "",
                  cardTheme: card.cardTheme,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-4 sm:grid-cols-4">
            <StatCard label="Balance" value={formatCurrency(card.currentBalance)} />
            <StatCard
              label="Utilization"
              value={`${util.toFixed(1)}%`}
              sub={`of ${formatCurrency(card.creditLimit, { compact: true })} limit`}
            />
            <StatCard
              label="Payment due"
              value={formatDate(nextOccurrence(card.dueDay))}
              sub={`Statement closes ${formatDate(nextOccurrence(card.statementDay))}`}
            />
            <StatCard
              label="Annual fee"
              value={card.annualFee > 0 ? formatCurrency(card.annualFee) : "None"}
            />
          </div>
          <section>
            <h2 className="mb-2 text-sm font-semibold">Reward categories</h2>
            <RewardRules cardId={card.id} rules={card.rewardCategories} />
          </section>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="section">
          <h2 className="text-lg font-semibold tracking-tight">Recent transactions</h2>
          <div className="mt-2">
            <TransactionTable transactions={card.transactions} showCard={false} allowDelete />
          </div>
        </section>

        <div className="space-y-6">
          <section className="section">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Benefits</h2>
              <AddBenefitButton cardId={card.id} />
            </div>
            <div className="grid gap-3">
              {card.benefits.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No benefits tracked yet for this card.
                </p>
              ) : (
                card.benefits.map((b) => (
                  <BenefitProgress
                    key={b.id}
                    benefit={{
                      ...b,
                      remaining: benefitRemaining(b),
                      status: benefitStatus(b, now),
                      effectiveExpiry: effectiveExpiry(b, now),
                    }}
                  />
                ))
              )}
            </div>
          </section>

          <section className="section">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Signup bonus</h2>
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
            </div>
            {bonusView ? (
              <SignupBonusProgress bonus={bonusView} />
            ) : (
              <p className="text-xs text-muted-foreground">No signup bonus tracked.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
