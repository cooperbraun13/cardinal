import Link from "next/link";
import { ArrowRightIcon, CalculatorIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { calculatorDefinitions } from "@/features/calculators/registry";

export const metadata = { title: "Calculators - Cardinal" };

export default function CalculatorsPage() {
  return (
    <div className="page-shell page-stack">
      <PageHeader eyebrow="Tools" title="Small questions, clearer numbers." description="Use a calculator to explore one assumption at a time. These illustrations support learning and are not personalized financial advice." />
      <section aria-labelledby="calculators-heading">
        <div className="flex items-center gap-design-xs"><CalculatorIcon className="size-5 text-muted-foreground" aria-hidden="true" /><h2 id="calculators-heading" className="section-title">Calculators</h2></div>
        <div className="mt-design-sm grid gap-design-sm md:grid-cols-2">
          {calculatorDefinitions.map((calculator) => (
            <article key={calculator.slug} className="panel panel-body min-h-48">
              <p className="eyebrow">Calculator</p>
              <h3 className="mt-design-md text-xl font-medium tracking-tight">{calculator.title}</h3>
              <p className="mt-design-xs text-sm leading-6 text-muted-foreground">{calculator.description}</p>
              {(["compound-growth", "emergency-fund", "credit-card-interest"] as string[]).includes(calculator.slug) ? <Link href={`/calculators/${calculator.slug}`} className="text-link mt-design-sm">Open calculator <ArrowRightIcon className="size-4" /></Link> : <p className="mt-design-sm text-xs text-muted-foreground">Guided version coming next.</p>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
