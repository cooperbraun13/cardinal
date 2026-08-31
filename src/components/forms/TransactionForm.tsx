"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { transactionSchema } from "@/lib/validation";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { FormActions } from "@/components/forms/FormActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

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
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = transactionSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setPending(true);
    try {
      await apiFetch("/api/transactions", { method: "POST", body: parsed.data });
      onOpenChange(false);
      setValues((current) => ({ ...current, merchant: "", amount: "", isRefund: false }));
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
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
        <form onSubmit={submit} className="grid gap-4">
          {error && <ErrorBanner message={error} />}
          <Field label="Card">
            <NativeSelect
              value={values.cardId}
              onChange={(event) => set("cardId", event.target.value)}
              required
            >
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Merchant">
              <Input
                value={values.merchant}
                onChange={(event) => set("merchant", event.target.value)}
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
                onChange={(event) => set("amount", event.target.value)}
                required
              />
            </Field>
            <Field label="Category">
              <NativeSelect
                value={values.category}
                onChange={(event) => set("category", event.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel(category)}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={values.transactionDate}
                onChange={(event) => set("transactionDate", event.target.value)}
                required
              />
            </Field>
            <Field label="Status">
              <NativeSelect
                value={values.status}
                onChange={(event) => set("status", event.target.value)}
              >
                <option value="posted">Posted</option>
                <option value="pending">Pending</option>
              </NativeSelect>
            </Field>
            <Field label="Type">
              <NativeSelect
                value={values.isRefund ? "refund" : "purchase"}
                onChange={(event) => set("isRefund", event.target.value === "refund")}
              >
                <option value="purchase">Purchase</option>
                <option value="refund">Refund</option>
              </NativeSelect>
            </Field>
          </div>
          <FormActions
            onCancel={() => onOpenChange(false)}
            pending={pending}
            disabled={cards.length === 0}
            submitLabel="Add transaction"
            pendingLabel="Adding..."
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
