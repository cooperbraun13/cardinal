"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorBanner } from "@/components/ErrorBanner";

/** Inline "log usage" control shown under a benefit card. */
export function BenefitUsage({
  benefitId,
  usedValue,
}: {
  benefitId: string;
  usedValue: number;
  totalValue: number;
}) {
  const router = useRouter();
  const amountId = useId();
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
        body: reset ? { usedValue: 0 } : { usageDelta: delta },
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
    <div className="mt-design-sm border-t border-border pt-4">
      {error && <ErrorBanner message={error} className="mb-2" />}
      <label htmlFor={amountId} className="mb-2 block text-xs font-medium">
        Record benefit usage
      </label>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          log();
        }}
        className="flex flex-wrap gap-2"
      >
        <Input
          id={amountId}
          required
          disabled={pending}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount used ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="min-w-32 flex-1 text-xs"
        />
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending ? "Saving..." : "Log use"}
        </Button>
        {usedValue > 0 && (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => log(true)}
            disabled={pending}
          >
            Reset
          </Button>
        )}
      </form>
    </div>
  );
}
