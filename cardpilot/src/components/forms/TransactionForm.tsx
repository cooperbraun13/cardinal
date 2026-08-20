"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { transactionSchema } from "@/lib/validation";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field } from "@/components/forms/Field";
import { ErrorBanner } from "@/components/ErrorBanner";

export function TransactionForm({
  open,
  onOpenChange,
  cards,
  defaultCardId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: { id: string; name: string }[];
  defaultCardId?: string;
}) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [values, setValues] = useState({
    cardId: defaultCardId ?? cards[0]?.id ?? "",
    merchant: "",
    amount: "",
    category: "dining",
    transactionDate: today,
    status: "posted",
    isRefund: false,
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = transactionSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    // Disabled-while-pending prevents rapid double-submits (practice ticket 10).
    setPending(true);
    try {
      await apiFetch("/api/transactions", { method: "POST", body: parsed.data });
      onOpenChange(false);
      setValues((v) => ({ ...v, merchant: "", amount: "", isRefund: false }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          {error && <ErrorBanner message={error} />}
          <Field label="Card">
            <NativeSelect
              value={values.cardId}
              onChange={(e) => set("cardId", e.target.value)}
              required
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Merchant">
              <Input
                value={values.merchant}
                onChange={(e) => set("merchant", e.target.value)}
                placeholder="Blue Bottle Coffee"
                required
              />
            </Field>
            <Field label="Amount ($)">
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={values.amount}
                onChange={(e) => set("amount", e.target.value)}
                required
              />
            </Field>
            <Field label="Category">
              <NativeSelect
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabel(c)}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={values.transactionDate}
                onChange={(e) => set("transactionDate", e.target.value)}
                required
              />
            </Field>
            <Field label="Status">
              <NativeSelect value={values.status} onChange={(e) => set("status", e.target.value)}>
                <option value="posted">Posted</option>
                <option value="pending">Pending</option>
              </NativeSelect>
            </Field>
            <Field label="Type">
              <NativeSelect
                value={values.isRefund ? "refund" : "purchase"}
                onChange={(e) => set("isRefund", e.target.value === "refund")}
              >
                <option value="purchase">Purchase</option>
                <option value="refund">Refund</option>
              </NativeSelect>
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || cards.length === 0}>
              {pending ? "Adding…" : "Add transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
