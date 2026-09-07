"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/ui/input";
import { calculateCompoundGrowth } from "@/features/calculators/compoundGrowth";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function CompoundGrowthCalculator() {
  const [values, setValues] = useState({ initialAmount: "1000", monthlyContribution: "250", annualRatePercent: "7", years: "20" });
  const [result, setResult] = useState<ReturnType<typeof calculateCompoundGrowth> | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function calculate() {
    try {
      const nextResult = calculateCompoundGrowth({
        initialAmount: Number(values.initialAmount),
        monthlyContribution: Number(values.monthlyContribution),
        annualRatePercent: Number(values.annualRatePercent),
        years: Number(values.years),
      });
      setResult(nextResult);
      setError(null);
    } catch (calculationError) {
      setResult(null);
      setError(calculationError instanceof Error ? calculationError.message : "Check your inputs and try again.");
    }
  }

  return (
    <div className="grid gap-design-md lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.8fr)]">
      <section className="panel panel-body" aria-labelledby="compound-inputs-heading">
        <h2 id="compound-inputs-heading" className="section-title">Try an example</h2>
        <p className="mt-design-xs text-sm leading-6 text-muted-foreground">Change the assumptions to see how regular contributions could grow over time.</p>
        <form onSubmit={(event) => { event.preventDefault(); calculate(); }}>
          <div className="mt-design-md grid gap-design-sm sm:grid-cols-2">
            <Field label="Starting amount" hint="Dollars already invested"><Input required type="number" min="0" max="1000000000" step="100" value={values.initialAmount} onChange={(event) => update("initialAmount", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "compound-error" : undefined} /></Field>
            <Field label="Monthly contribution" hint="Added at the end of each month"><Input required type="number" min="0" max="10000000" step="25" value={values.monthlyContribution} onChange={(event) => update("monthlyContribution", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "compound-error" : undefined} /></Field>
            <Field label="Annual growth rate" hint="An illustration, not a guarantee"><Input required type="number" min="-99.99" max="1000" step="0.1" value={values.annualRatePercent} onChange={(event) => update("annualRatePercent", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "compound-error" : undefined} /></Field>
            <Field label="Years" hint="Rounded to whole months"><Input required type="number" min="0" max="100" step="1" value={values.years} onChange={(event) => update("years", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "compound-error" : undefined} /></Field>
          </div>
          <Button type="submit" className="mt-design-md">Calculate</Button>
          {error && <p id="compound-error" role="alert" className="mt-design-sm text-sm text-destructive">{error}</p>}
        </form>
      </section>
      <section className="panel panel-body" aria-live="polite" aria-labelledby="compound-result-heading">
        <p className="eyebrow">Illustration</p>
        <h2 id="compound-result-heading" className="mt-design-xs section-title">{result ? currency.format(result.endingBalance) : "Your result"}</h2>
        {result ? (
          <dl className="mt-design-md grid gap-design-sm text-sm">
            <div className="flex justify-between gap-4 border-b border-border pb-design-xs"><dt className="text-muted-foreground">Total contributions</dt><dd className="font-medium">{currency.format(result.totalContributions)}</dd></div>
            <div className="flex justify-between gap-4 border-b border-border pb-design-xs"><dt className="text-muted-foreground">Estimated growth</dt><dd className="font-medium">{currency.format(result.estimatedGrowth)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Months illustrated</dt><dd className="font-medium">{result.months}</dd></div>
          </dl>
        ) : <p className="mt-design-xs text-sm leading-6 text-muted-foreground">Enter a few assumptions, then calculate to see the illustration.</p>}
        <div className="mt-design-md border-t border-border pt-design-sm">
          <p className="text-xs leading-5 text-muted-foreground">This uses monthly compounding and end-of-month contributions. Actual returns vary.</p>
          <Link href="/learn/investing-basics" className="text-link mt-design-sm">Learn about investing basics <ArrowRightIcon className="size-4" /></Link>
        </div>
      </section>
    </div>
  );
}
