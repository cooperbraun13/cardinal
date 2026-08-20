"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorBanner } from "@/components/ErrorBanner";

/** Inline "log usage" control shown under a benefit card. */
export function BenefitUsage({
  benefitId,
  usedValue,
  totalValue,
}: {
  benefitId: string;
  usedValue: number;
  totalValue: number;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function log(reset = false) {
    setError("");
    const delta = reset ? 0 : Number(amount);
    if (!reset && (!delta || delta <= 0)) {
      setError("Enter a positive amount.");
      return;
    }
    setPending(true);
    try {
      await apiFetch(`/api/benefits/${benefitId}`, {
        method: "PATCH",
        body: { usedValue: reset ? 0 : Math.min(totalValue, usedValue + delta) },
      });
      setAmount("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-3 border-t border-border/60 pt-3">
      {error && <ErrorBanner message={error} className="mb-2" />}
      <div className="flex gap-2">
        <Input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount used ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-8 flex-1 text-xs"
        />
        <Button size="sm" className="h-8" onClick={() => log()} disabled={pending}>
          Log use
        </Button>
        {usedValue > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-muted-foreground"
            onClick={() => log(true)}
            disabled={pending}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
