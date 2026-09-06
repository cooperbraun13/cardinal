import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { Metric } from "@/components/Metric";
import { redirect } from "next/navigation";
import { GiftIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import {
  benefitRemaining,
  benefitStatus,
  effectiveExpiry,
} from "@/services/benefits";
import { BenefitProgress } from "@/components/BenefitProgress";
import { BenefitUsage } from "@/components/BenefitUsage";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Benefits - Cardinal" };

const STATUS_ORDER = [
  "expiring",
  "available",
  "partial",
  "used",
  "expired",
  "inactive",
];

export default async function BenefitsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const benefits = await prisma.benefit.findMany({
    where: { card: { userId: user.id } },
    include: { card: { select: { name: true } } },
  });

  const now = new Date();
  const views = benefits
    .map((benefit) => ({
      ...benefit,
      remaining: benefitRemaining(benefit),
      status: benefitStatus(benefit, now),
      effectiveExpiry: effectiveExpiry(benefit, now),
    }))
    .sort(
      (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
    );

  const totalRemaining = views
    .filter((view) =>
      ["available", "partial", "expiring"].includes(view.status),
    )
    .reduce((sum, view) => sum + view.remaining, 0);

  const available = views.filter((view) =>
    ["available", "partial", "expiring"].includes(view.status),
  );
  const history = views.filter(
    (view) => !["available", "partial", "expiring"].includes(view.status),
  );
  const renderBenefit = (benefit: (typeof views)[number]) => (
    <BenefitProgress key={benefit.id} benefit={benefit}>
      {benefit.status !== "expired" && benefit.status !== "inactive" && (
        <BenefitUsage
          benefitId={benefit.id}
          usedValue={benefit.usedValue}
          totalValue={benefit.totalValue}
        />
      )}
    </BenefitProgress>
  );

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="The extras, accounted for"
        title="More from your cards."
        description="A place for every credit and perk. Use what matters before it expires."
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/cards" />}
          >
            Manage card benefits <ArrowRightIcon className="size-4" />
          </Button>
        }
      />
      {views.length === 0 ? (
        <EmptyState
          icon={GiftIcon}
          title="Your benefits belong here"
          description="Open a card to add dining credits, travel perks, lounge access, and more."
          action={
            <Link href="/cards" className="text-link">
              Explore your cards <ArrowRightIcon className="size-4" />
            </Link>
          }
          className="panel min-h-80"
        />
      ) : (
        <>
          <section className="summary-band" aria-label="Benefits summary">
            <Metric
              label="Value still available"
              value={formatCurrency(totalRemaining)}
              detail="Across your usable credits and perks"
            />
            <Metric
              label="Ready to use"
              value={available.length}
              detail="Available and partially used benefits"
            />
            <Metric
              label="Expiring soon"
              value={views.filter((view) => view.status === "expiring").length}
              detail="Worth a look before they end"
            />
          </section>
          <section>
            <SectionHeader
              className="mb-design-sm"
              title="Ready when you are"
              description="Benefits with value remaining, ordered by status"
            />
            {available.length ? (
              <div className="grid gap-design-sm md:grid-cols-2 lg:grid-cols-3">
                {available.map(renderBenefit)}
              </div>
            ) : (
              <EmptyState
                title="You’re all caught up"
                description="No usable benefits have value remaining right now."
              />
            )}
          </section>
          {history.length > 0 && (
            <section className="section-divider">
              <SectionHeader
                className="mb-design-sm"
                title="Used & past benefits"
                description="Your completed, expired, and inactive perks"
              />
              <div className="grid gap-design-sm md:grid-cols-2 lg:grid-cols-3">
                {history.map(renderBenefit)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
