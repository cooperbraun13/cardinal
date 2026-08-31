import { redirect } from "next/navigation";
import { GiftIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { benefitStatus, benefitRemaining, effectiveExpiry } from "@/services/benefits";
import { BenefitProgress } from "@/components/BenefitProgress";
import { BenefitUsage } from "@/components/BenefitUsage";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Benefits — Cardinal" };

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
    .map((b) => ({
      ...b,
      remaining: benefitRemaining(b),
      status: benefitStatus(b, now),
      effectiveExpiry: effectiveExpiry(b, now),
    }))
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));

  const totalRemaining = views
    .filter((v) => v.status === "available" || v.status === "partial" || v.status === "expiring")
    .reduce((s, v) => s + v.remaining, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Benefits</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {views.length === 0
            ? "Track card credits and perks so they never expire unused."
            : `$${totalRemaining.toFixed(0)} in unused credits across ${views.length} tracked ${
                views.length === 1 ? "benefit" : "benefits"
              }.`}
        </p>
      </div>

      {views.length === 0 ? (
        <EmptyState
          icon={GiftIcon}
          title="No benefits tracked yet"
          description="Open one of your cards and add its credits and perks — dining credits, travel credits, free nights, lounge passes."
          className="py-16"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {views.map((b) => (
            <BenefitProgress key={b.id} benefit={b}>
              {b.status !== "expired" && b.status !== "inactive" && (
                <BenefitUsage
                  benefitId={b.id}
                  usedValue={b.usedValue}
                  totalValue={b.totalValue}
                />
              )}
            </BenefitProgress>
          ))}
        </div>
      )}
    </div>
  );
}
