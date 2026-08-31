"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { CATEGORIES, EVERYTHING, categoryLabel } from "@/lib/categories";
import { rewardCategorySchema } from "@/lib/validation";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { FormActions } from "@/components/forms/FormActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

export function RewardRuleForm({
  open,
  onOpenChange,
  cardId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState({
    category: "dining",
    multiplier: "",
    startDate: "",
    endDate: "",
    spendingCap: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = rewardCategorySchema.safeParse({
      category: values.category,
      multiplier: values.multiplier,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      spendingCap: values.spendingCap || null,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setPending(true);
    try {
      await apiFetch(`/api/cards/${cardId}/reward-categories`, {
        method: "POST",
        body: parsed.data,
      });
      onOpenChange(false);
      setValues((current) => ({ ...current, multiplier: "", spendingCap: "" }));
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
          <DialogTitle>Add reward rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          {error && <ErrorBanner message={error} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <NativeSelect
                value={values.category}
                onChange={(event) => set("category", event.target.value)}
              >
                {[...CATEGORIES, EVERYTHING].map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel(category)}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Multiplier (x)">
              <Input
                type="number"
                min="0.5"
                step="0.5"
                value={values.multiplier}
                onChange={(event) => set("multiplier", event.target.value)}
                placeholder="3"
                required
              />
            </Field>
            <Field label="Starts (optional)">
              <Input
                type="date"
                value={values.startDate}
                onChange={(event) => set("startDate", event.target.value)}
              />
            </Field>
            <Field label="Ends (optional)">
              <Input
                type="date"
                value={values.endDate}
                onChange={(event) => set("endDate", event.target.value)}
              />
            </Field>
            <Field label="Spending cap ($, optional)" className="sm:col-span-2">
              <Input
                type="number"
                min="1"
                step="1"
                value={values.spendingCap}
                onChange={(event) => set("spendingCap", event.target.value)}
                placeholder="1500 per promotion window"
              />
            </Field>
          </div>
          <FormActions
            onCancel={() => onOpenChange(false)}
            pending={pending}
            submitLabel="Add rule"
            pendingLabel="Adding..."
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
