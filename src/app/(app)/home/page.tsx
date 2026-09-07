import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon, WalletCardsIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Home - Cardinal" };

export default async function HomePage() {
  const user = await getCurrentUser();
  const firstName = user?.name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Your financial home"
        title={`Welcome, ${firstName}.`}
        description="Build confidence with one clear money decision at a time."
      />
      <section className="grid gap-design-sm lg:grid-cols-2" aria-label="Start here">
        <Link href="/money" className="panel panel-body group min-h-56 transition-colors hover:bg-muted">
          <WalletCardsIcon className="size-5 text-muted-foreground" aria-hidden="true" />
          <p className="eyebrow mt-design-md">Money</p>
          <h2 className="mt-design-xxs section-title">Your credit cards, in one place.</h2>
          <p className="mt-design-xs max-w-md text-sm leading-6 text-muted-foreground">
            Review balances, rewards, benefits, transactions, and the best card for a purchase.
          </p>
          <span className="text-link mt-design-sm">Open Money <ArrowRightIcon className="size-4" /></span>
        </Link>
        <Link href="/learn" className="panel panel-body group min-h-56 transition-colors hover:bg-muted">
          <BookOpenIcon className="size-5 text-muted-foreground" aria-hidden="true" />
          <p className="eyebrow mt-design-md">Learn</p>
          <h2 className="mt-design-xxs section-title">Start with the basics.</h2>
          <p className="mt-design-xs max-w-md text-sm leading-6 text-muted-foreground">
            Short, plain-language lessons explain financial ideas before you need to act on them.
          </p>
          <span className="text-link mt-design-sm">Explore lessons <ArrowRightIcon className="size-4" /></span>
        </Link>
      </section>
      <section className="border-t border-border pt-design-md" aria-labelledby="next-heading">
        <p className="eyebrow">What comes next</p>
        <h2 id="next-heading" className="mt-design-xxs section-title">A plan built around your context.</h2>
        <p className="mt-design-xs max-w-xl text-sm leading-6 text-muted-foreground">
          Cardinal Plan turns the information you choose to share into clear, explainable next steps. Start with your existing credit picture, a focused lesson, or your Plan.
        </p>
      </section>
    </div>
  );
}
