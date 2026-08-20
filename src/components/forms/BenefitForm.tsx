"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { benefitSchema } from "@/lib/validation";
import { BENEFIT_TYPES, BENEFIT_TYPE_LABELS, RESET_FREQUENCIES } from "@/lib/categories";
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

const FREQ_LABELS: Record<string, string> = {
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
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
      await apiFetch(`/api/cards/${cardId}/benefits`, { method: "POST", body: parsed.data });
      onOpenChange(false);
      setValues((v) => ({ ...v, name: "", totalValue: "" }));
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
          <DialogTitle>Add benefit</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          {error && <ErrorBanner message={error} />}
          <Field label="Benefit name">
            <Input
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="$120 Dining Credit"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <NativeSelect
                value={values.benefitType}
                onChange={(e) => set("benefitType", e.target.value)}
              >
                {BENEFIT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {BENEFIT_TYPE_LABELS[t]}
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
                onChange={(e) => set("totalValue", e.target.value)}
                required
              />
            </Field>
            <Field label="Resets">
              <NativeSelect
                value={values.resetFrequency}
                onChange={(e) => set("resetFrequency", e.target.value)}
              >
                {RESET_FREQUENCIES.map((f) => (
                  <option key={f} value={f}>
                    {FREQ_LABELS[f]}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Starts">
              <Input
                type="date"
                value={values.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                required
              />
            </Field>
            <Field label="Expires (optional)" className="col-span-2">
              <Input
                type="date"
                value={values.expirationDate}
                onChange={(e) => set("expirationDate", e.target.value)}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add benefit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
