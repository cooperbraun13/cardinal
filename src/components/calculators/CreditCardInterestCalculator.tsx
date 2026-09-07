"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/ui/input";
import { estimateCreditCardInterest } from "@/features/calculators/creditCardInterest";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function CreditCardInterestCalculator() {
  const [values, setValues] = useState({ balance: "2000", aprPercent: "24", days: "30" });
  const [result, setResult] = useState<ReturnType<typeof estimateCreditCardInterest> | null>(null);
  const [error, setError] = useState<string | null>(null);
  function update(name: keyof typeof values, value: string) { setValues((current) => ({ ...current, [name]: value })); }
  function calculate() {
    try { setResult(estimateCreditCardInterest({ balance: Number(values.balance), aprPercent: Number(values.aprPercent), days: Number(values.days) })); setError(null); }
    catch (calculationError) { setResult(null); setError(calculationError instanceof Error ? calculationError.message : "Check your inputs and try again."); }
  }
  return (
    <div className="grid gap-design-md lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.8fr)]">
      <section className="panel panel-body" aria-labelledby="interest-inputs-heading">
        <h2 id="interest-inputs-heading" className="section-title">Estimate a balance</h2>
        <p className="mt-design-xs text-sm leading-6 text-muted-foreground">See a simple estimate for a constant balance over a short period.</p>
        <form onSubmit={(event) => { event.preventDefault(); calculate(); }}>
          <div className="mt-design-md grid gap-design-sm sm:grid-cols-2">
            <Field label="Balance" hint="The balance held constant"><Input required type="number" min="0" max="1000000000" step="50" value={values.balance} onChange={(event) => update("balance", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "interest-error" : undefined} /></Field>
            <Field label="APR" hint="Annual percentage rate"><Input required type="number" min="0" max="100" step="0.1" value={values.aprPercent} onChange={(event) => update("aprPercent", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "interest-error" : undefined} /></Field>
            <Field label="Days" hint="A 365-day year is assumed"><Input required type="number" min="0" max="365" step="1" value={values.days} onChange={(event) => update("days", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "interest-error" : undefined} /></Field>
          </div>
          <Button type="submit" className="mt-design-md">Calculate</Button>
          {error && <p id="interest-error" role="alert" className="mt-design-sm text-sm text-destructive">{error}</p>}
        </form>
      </section>
      <section className="panel panel-body" aria-live="polite" aria-labelledby="interest-result-heading">
        <p className="eyebrow">Estimate</p>
        <h2 id="interest-result-heading" className="mt-design-xs section-title">{result ? currency.format(result.estimatedInterest) : "Estimated interest"}</h2>
        {result ? <p className="mt-design-xs text-sm leading-6 text-muted-foreground">Estimated balance after this period: <strong className="text-foreground">{currency.format(result.endingBalance)}</strong></p> : <p className="mt-design-xs text-sm leading-6 text-muted-foreground">Enter a balance, APR, and number of days to see the estimate.</p>}
        <div className="mt-design-md border-t border-border pt-design-sm"><p className="text-xs leading-5 text-muted-foreground">This uses simple daily interest on a constant balance. Issuers may calculate interest differently.</p><Link href="/learn/apr" className="text-link mt-design-sm">Learn about APR <ArrowRightIcon className="size-4" /></Link></div>
      </section>
    </div>
  );
}
