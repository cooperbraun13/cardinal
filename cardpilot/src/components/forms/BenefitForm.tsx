"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import {
  BENEFIT_TYPES,
  BENEFIT_TYPE_LABELS,
  RESET_FREQUENCIES,
} from "@/lib/categories";
import { benefitSchema } from "@/lib/validation";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { FormActions } from "@/components/forms/FormActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  semiannual: "Semiannual",
  annual: "Annual",
  one_time: "One time",
};

export function BenefitForm({
  open,
  onOpenChange,
  cardId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string;
}) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [values, setValues] = useState({
    name: "",
    benefitType: "dining_credit",
    totalValue: "",
    resetFrequency: "annual",
    startDate: today,
    expirationDate: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = benefitSchema.safeParse({
      ...values,
      expirationDate: values.expirationDate || null,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setPending(true);
    try {
      await apiFetch(`/api/cards/${cardId}/benefits`, {
        method: "POST",
        body: parsed.data,
      });
      onOpenChange(false);
      setValues((current) => ({ ...current, name: "", totalValue: "" }));
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
          <DialogTitle>Add benefit</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          {error && <ErrorBanner message={error} />}
          <Field label="Benefit name">
            <Input
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="$120 dining credit"
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type">
              <NativeSelect
                value={values.benefitType}
                onChange={(event) => set("benefitType", event.target.value)}
              >
                {BENEFIT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {BENEFIT_TYPE_LABELS[type]}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Total value ($)">
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={values.totalValue}
                onChange={(event) => set("totalValue", event.target.value)}
                required
              />
            </Field>
            <Field label="Resets">
              <NativeSelect
                value={values.resetFrequency}
                onChange={(event) => set("resetFrequency", event.target.value)}
              >
                {RESET_FREQUENCIES.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {FREQUENCY_LABELS[frequency]}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Starts">
              <Input
                type="date"
                value={values.startDate}
                onChange={(event) => set("startDate", event.target.value)}
                required
              />
            </Field>
            <Field label="Expires (optional)" className="sm:col-span-2">
              <Input
                type="date"
                value={values.expirationDate}
                onChange={(event) => set("expirationDate", event.target.value)}
              />
            </Field>
          </div>
          <FormActions
            onCancel={() => onOpenChange(false)}
            pending={pending}
            submitLabel="Add benefit"
            pendingLabel="Adding..."
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
