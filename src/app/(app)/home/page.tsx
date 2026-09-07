import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRightIcon,
  BookOpenIcon,
  WalletCardsIcon,
  RouteIcon,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getFinancialProfile } from "@/features/profile/service";
import { buildCardinalPlan } from "@/features/plan/rules";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Home - Cardinal" };

const SHORTCUTS = [
  {
    href: "/money",
    label: "Your money",
    description: "Balances, activity, and the details in your wallet.",
    icon: WalletCardsIcon,
  },
  {
    href: "/learn",
    label: "Something to learn",
    description: "A library of short lessons, organized by topic.",
    icon: BookOpenIcon,
  },
  {
    href: "/plan",
    label: "Your next steps",
    description: "A clear order for the topics worth your attention.",
    icon: RouteIcon,
  },
];

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const firstName = user.name.trim().split(/\s+/)[0] || "there";
  const [nextStep] = buildCardinalPlan(await getFinancialProfile(user.id));

  return (
    <div className="page-shell page-stack">
      <div className="grid items-start gap-design-lg lg:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
        <PageHeader
          eyebrow="Home / Your starting point"
          title={`Welcome, ${firstName}.`}
          description="A little perspective. One useful next step. This is your place to bring it together."
        />
        {nextStep && (
          <section
            className="border-l-2 border-foreground bg-muted/35 p-design-sm sm:p-design-md"
            aria-labelledby="home-focus-heading"
          >
            <p className="eyebrow">From your Plan</p>
            <h2
              id="home-focus-heading"
              className="mt-design-sm text-2xl font-medium tracking-tight sm:text-3xl"
            >
              {nextStep.title}
            </h2>
            <p className="mt-design-xs text-sm leading-6 text-foreground">
              {nextStep.action}
            </p>
            <p className="mt-design-xs text-sm leading-6 text-muted-foreground">
              {nextStep.whySuggested}
            </p>
            <Link href={nextStep.href} className="text-link mt-design-sm">
              {nextStep.linkLabel}{" "}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </section>
        )}
      </div>
      <section aria-labelledby="home-explore-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-design-xs border-b border-border pb-design-sm">
          <h2 id="home-explore-heading" className="section-title">
            Find your bearings.
          </h2>
          <p className="text-sm text-muted-foreground">
            Three ways to move forward
          </p>
        </div>
        <div className="grid md:grid-cols-3">
          {SHORTCUTS.map(({ href, label, description, icon: Icon }, index) => (
            <Link
              key={href}
              href={href}
              className="group min-w-0 border-b border-border py-design-md transition-colors hover:bg-muted/35 md:border-b-0 md:px-design-sm md:first:pl-0 md:not-first:border-l"
            >
              <div className="flex items-center justify-between gap-design-xs">
                <Icon
                  className="size-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <span
                  className="text-xs text-muted-foreground tabular-nums"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-design-md text-xl font-medium">{label}</h3>
              <p className="mt-design-xs max-w-xs text-sm leading-6 text-muted-foreground">
                {description}
              </p>
              <span className="text-link mt-design-xs">
                Explore <ArrowRightIcon className="size-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
