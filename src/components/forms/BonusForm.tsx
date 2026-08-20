"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { signupBonusSchema } from "@/lib/validation";
import { REWARD_TYPES } from "@/lib/categories";
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

export function BonusForm({
  open,
  onOpenChange,
  cardId,
  initial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string;
  initial?: {
    spendRequirement: number;
    rewardAmount: number;
    rewardType: string;
    deadline: string; // yyyy-mm-dd
  };
}) {
  const router = useRouter();
  const [values, setValues] = useState({
    spendRequirement: initial ? String(initial.spendRequirement) : "",
    rewardAmount: initial ? String(initial.rewardAmount) : "",
    rewardType: initial?.rewardType ?? "points",
    deadline: initial?.deadline ?? "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = signupBonusSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setPending(true);
    try {
      await apiFetch(`/api/cards/${cardId}/signup-bonus`, { method: "POST", body: parsed.data });
      onOpenChange(false);
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
          <DialogTitle>{initial ? "Edit signup bonus" : "Set signup bonus"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          {error && <ErrorBanner message={error} />}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Spend requirement ($)">
              <Input
                type="number"
                min="1"
                step="1"
                value={values.spendRequirement}
                onChange={(e) => set("spendRequirement", e.target.value)}
                placeholder="4000"
                required
              />
            </Field>
            <Field label="Reward amount">
              <Input
                type="number"
                min="1"
                step="1"
                value={values.rewardAmount}
                onChange={(e) => set("rewardAmount", e.target.value)}
                placeholder="60000"
                required
              />
            </Field>
            <Field label="Reward type">
              <NativeSelect
                value={values.rewardType}
                onChange={(e) => set("rewardType", e.target.value)}
              >
                {REWARD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === "cashback" ? "Cash back" : t[0].toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Deadline">
              <Input
                type="date"
                value={values.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                required
              />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save bonus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
