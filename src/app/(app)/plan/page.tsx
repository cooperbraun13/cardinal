import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { getFinancialProfile } from "@/features/profile/service";
import { buildCardinalPlan } from "@/features/plan/rules";
import { cn } from "@/lib/utils";

export const metadata = { title: "Plan - Cardinal" };

export default async function PlanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const recommendations = buildCardinalPlan(await getFinancialProfile(user.id));

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Plan / Your next steps"
        title="One step at a time."
        description="An ordered set of educational next steps, based only on the context you choose to share."
      />
      <div className="grid items-start gap-design-lg lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside
          className="border-t border-border pt-design-sm lg:sticky lg:top-24"
          aria-labelledby="plan-context-heading"
        >
          <p className="eyebrow">Your focus</p>
          <h2
            id="plan-context-heading"
            className="mt-design-xs text-2xl font-medium"
          >
            {recommendations.length}{" "}
            {recommendations.length === 1 ? "step" : "steps"} to consider
          </h2>
          <p className="mt-design-xs text-sm leading-6 text-muted-foreground">
            Start with the first suggestion, or choose the topic that feels most
            useful today. These are suggestions, not a completion checklist.
          </p>
          <Link href="/profile" className="text-link mt-design-sm">
            Review your context{" "}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </aside>
        <ol className="min-w-0" aria-label="Your financial next steps">
          {recommendations.map((recommendation, index) => (
            <li
              key={recommendation.id}
              className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-design-xs pb-design-lg last:pb-0 sm:gap-design-sm"
            >
              {index < recommendations.length - 1 && (
                <span
                  className="absolute top-10 bottom-0 left-5 border-l border-border"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-full border text-sm tabular-nums",
                  index === 0
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground",
                )}
                aria-label={`Step ${index + 1}`}
              >
                {index + 1}
              </span>
              <div
                className={cn(
                  "min-w-0",
                  index === 0
                    ? "border-t-2 border-foreground bg-muted/35 p-design-xs sm:p-design-sm"
                    : "border-t border-border pt-design-sm",
                )}
              >
                {index === 0 && (
                  <p className="eyebrow mb-design-xs">Start here</p>
                )}
                <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
                  {recommendation.title}
                </h2>
                <p className="mt-design-xs text-sm leading-6">
                  {recommendation.action}
                </p>
                <Link
                  href={recommendation.href}
                  className="text-link mt-design-xs break-words"
                >
                  {recommendation.linkLabel}{" "}
                  <ArrowRightIcon className="size-4" aria-hidden="true" />
                </Link>
                <details className="mt-design-xs border-t border-border">
                  <summary className="min-h-12 cursor-pointer py-design-xs text-sm font-medium">
                    Why this step?
                  </summary>
                  <div className="grid gap-design-xs pb-design-xs text-sm leading-6 text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        Why it matters:{" "}
                      </span>
                      {recommendation.rationale}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Why Cardinal is suggesting it:{" "}
                      </span>
                      {recommendation.whySuggested}
                    </p>
                    <div>
                      <p className="font-medium text-foreground">Assumptions</p>
                      <ul className="mt-design-xxs list-disc space-y-2 pl-5">
                        {recommendation.assumptions.map((assumption) => (
                          <li key={assumption}>{assumption}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
