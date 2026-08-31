import { redirect } from "next/navigation";
import { GiftIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import { benefitRemaining, benefitStatus, effectiveExpiry } from "@/services/benefits";
import { BenefitProgress } from "@/components/BenefitProgress";
import { BenefitUsage } from "@/components/BenefitUsage";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Benefits - Cardinal" };

const STATUS_ORDER = ["expiring", "available", "partial", "used", "expired", "inactive"];

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
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));

  const totalRemaining = views
    .filter((view) => ["available", "partial", "expiring"].includes(view.status))
    .reduce((sum, view) => sum + view.remaining, 0);

  const description =
    views.length === 0
      ? "Track card credits and perks so they never expire unused."
      : `${formatCurrency(totalRemaining, { compact: true })} remains across ${views.length} tracked ${views.length === 1 ? "benefit" : "benefits"}.`;

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Value tracker" title="Benefits" description={description} />

      {views.length === 0 ? (
        <EmptyState
          icon={GiftIcon}
          title="No benefits tracked yet"
          description="Open a card to add dining credits, travel credits, free nights, lounge access, and other perks."
          className="py-16"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {views.map((benefit) => (
            <BenefitProgress key={benefit.id} benefit={benefit}>
              {benefit.status !== "expired" && benefit.status !== "inactive" && (
                <BenefitUsage
                  benefitId={benefit.id}
                  usedValue={benefit.usedValue}
                  totalValue={benefit.totalValue}
                />
              )}
            </BenefitProgress>
          ))}
        </div>
      )}
    </div>
  );
}
