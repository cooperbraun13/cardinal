import Link from "next/link";
import { ArrowRightIcon, BarChart3Icon, CreditCardIcon, GiftIcon, ReceiptTextIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const CREDIT_TOOLS = [
  { href: "/dashboard", label: "Credit overview", description: "See balances, utilization, due dates, rewards, and recent activity.", icon: BarChart3Icon },
  { href: "/cards", label: "Cards", description: "Manage your wallet, card details, and reward rules.", icon: CreditCardIcon },
  { href: "/transactions", label: "Activity", description: "Follow purchases, refunds, and rewards across your cards.", icon: ReceiptTextIcon },
  { href: "/benefits", label: "Benefits", description: "Keep card credits and perks from going unused.", icon: GiftIcon },
];

export const metadata = { title: "Money - Cardinal" };

export default function MoneyPage() {
  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Money"
        title="Make your credit cards work harder."
        description="Your current Cardinal tools live here. More money topics will join them as they are ready."
      />
      <section aria-labelledby="credit-heading">
        <p className="eyebrow">Credit</p>
        <h2 id="credit-heading" className="mt-design-xxs section-title">Your current credit tools</h2>
        <div className="mt-design-sm grid gap-design-sm md:grid-cols-2">
          {CREDIT_TOOLS.map(({ href, label, description, icon: Icon }) => (
            <Link key={href} href={href} className="panel panel-body group min-h-48 transition-colors hover:bg-muted">
              <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-design-md text-xl font-medium tracking-tight">{label}</h3>
              <p className="mt-design-xxs text-sm leading-6 text-muted-foreground">{description}</p>
              <span className="text-link mt-design-sm">Open {label} <ArrowRightIcon className="size-4" /></span>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-t border-border pt-design-md">
        <Link href="/optimizer" className="text-link">
          Find the best card for a purchase <ArrowRightIcon className="size-4" />
        </Link>
      </section>
    </div>
  );
}
