"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { rewardCategorySchema } from "@/lib/validation";
import { CATEGORIES, EVERYTHING, categoryLabel } from "@/lib/categories";
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
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
      setValues((v) => ({ ...v, multiplier: "", spendingCap: "" }));
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
          <DialogTitle>Add reward rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          {error && <ErrorBanner message={error} />}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <NativeSelect
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {[...CATEGORIES, EVERYTHING].map((c) => (
                  <option key={c} value={c}>
                    {categoryLabel(c)}
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
                onChange={(e) => set("multiplier", e.target.value)}
                placeholder="3"
                required
              />
            </Field>
            <Field label="Starts (optional — for promos)">
              <Input
                type="date"
                value={values.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label="Ends (optional)">
              <Input
                type="date"
                value={values.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
            <Field label="Spending cap ($, optional)" className="col-span-2">
              <Input
                type="number"
                min="1"
                step="1"
                value={values.spendingCap}
                onChange={(e) => set("spendingCap", e.target.value)}
                placeholder="e.g. 1500 per window"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
