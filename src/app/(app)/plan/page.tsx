import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { getFinancialProfile } from "@/features/profile/service";
import { buildCardinalPlan } from "@/features/plan/rules";

export const metadata = { title: "Plan - Cardinal" };

export default async function PlanPage() {
  const user = await getCurrentUser();
  const recommendations = buildCardinalPlan(
    user ? await getFinancialProfile(user.id) : null,
  );

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Cardinal Plan"
        title="Know what to focus on next."
        description="These educational next steps use transparent rules and only the context you choose to share."
      />
      <ol className="grid gap-design-sm" aria-label="Your financial next steps">
        {recommendations.map((recommendation, index) => (
          <li key={recommendation.id} className="panel panel-body">
            <div className="grid gap-design-sm lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
              <span className="flex size-10 items-center justify-center border border-border text-sm tabular-nums" aria-label={`Step ${index + 1}`}>
                {index + 1}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-medium tracking-tight">{recommendation.title}</h2>
                <p className="mt-design-xs text-sm leading-6 text-foreground">{recommendation.action}</p>
                <div className="mt-design-sm grid gap-design-xs border-t border-border pt-design-sm text-sm leading-6 text-muted-foreground">
                  <p><span className="font-medium text-foreground">Why it matters: </span>{recommendation.rationale}</p>
                  <p><span className="font-medium text-foreground">Why Cardinal is suggesting it: </span>{recommendation.whySuggested}</p>
                  <p><span className="font-medium text-foreground">Assumption: </span>{recommendation.assumptions[0]}</p>
                </div>
              </div>
              <Link href={recommendation.href} className="text-link">
                {recommendation.linkLabel} <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
