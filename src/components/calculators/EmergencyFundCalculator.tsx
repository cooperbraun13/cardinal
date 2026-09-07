"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/ui/input";
import { calculateEmergencyFund } from "@/features/calculators/emergencyFund";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function EmergencyFundCalculator() {
  const [values, setValues] = useState({ monthlyEssentialExpenses: "2500", targetMonths: "3", currentSavings: "1000" });
  const [result, setResult] = useState<ReturnType<typeof calculateEmergencyFund> | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function calculate() {
    try {
      setResult(calculateEmergencyFund({
        monthlyEssentialExpenses: Number(values.monthlyEssentialExpenses),
        targetMonths: Number(values.targetMonths),
        currentSavings: Number(values.currentSavings),
      }));
      setError(null);
    } catch (calculationError) {
      setResult(null);
      setError(calculationError instanceof Error ? calculationError.message : "Check your inputs and try again.");
    }
  }

  return (
    <div className="grid gap-design-md lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.8fr)]">
      <section className="panel panel-body" aria-labelledby="emergency-inputs-heading">
        <h2 id="emergency-inputs-heading" className="section-title">Choose your target</h2>
        <p className="mt-design-xs text-sm leading-6 text-muted-foreground">Set a target that fits your situation. Cardinal does not decide how many months you need.</p>
        <form onSubmit={(event) => { event.preventDefault(); calculate(); }}>
          <div className="mt-design-md grid gap-design-sm sm:grid-cols-2">
            <Field label="Monthly essential expenses" hint="Housing, food, utilities, and other essentials"><Input required type="number" min="0" max="1000000000" step="50" value={values.monthlyEssentialExpenses} onChange={(event) => update("monthlyEssentialExpenses", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "emergency-error" : undefined} /></Field>
            <Field label="Target months" hint="Your chosen cushion"><Input required type="number" min="0" max="24" step="1" value={values.targetMonths} onChange={(event) => update("targetMonths", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "emergency-error" : undefined} /></Field>
            <Field label="Current emergency savings" hint="Savings already set aside"><Input required type="number" min="0" max="1000000000" step="50" value={values.currentSavings} onChange={(event) => update("currentSavings", event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "emergency-error" : undefined} /></Field>
          </div>
          <Button type="submit" className="mt-design-md">Calculate</Button>
          {error && <p id="emergency-error" role="alert" className="mt-design-sm text-sm text-destructive">{error}</p>}
        </form>
      </section>
      <section className="panel panel-body" aria-live="polite" aria-labelledby="emergency-result-heading">
        <p className="eyebrow">Illustration</p>
        <h2 id="emergency-result-heading" className="mt-design-xs section-title">{result ? currency.format(result.remainingGap) : "Your remaining gap"}</h2>
        {result ? <dl className="mt-design-md grid gap-design-sm text-sm"><div className="flex justify-between gap-4 border-b border-border pb-design-xs"><dt className="text-muted-foreground">Target amount</dt><dd className="font-medium">{currency.format(result.targetAmount)}</dd></div><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Current savings</dt><dd className="font-medium">{currency.format(result.currentSavings)}</dd></div></dl> : <p className="mt-design-xs text-sm leading-6 text-muted-foreground">Enter your essential expenses, target months, and current savings to see the gap.</p>}
        <div className="mt-design-md border-t border-border pt-design-sm">
          <p className="text-xs leading-5 text-muted-foreground">This is a planning illustration. Your target may change as your expenses and circumstances change.</p>
          <Link href="/learn/emergency-fund" className="text-link mt-design-sm">Learn about emergency funds <ArrowRightIcon className="size-4" /></Link>
        </div>
      </section>
    </div>
  );
}
