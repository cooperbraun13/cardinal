"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { REWARD_TYPES } from "@/lib/categories";
import { signupBonusSchema } from "@/lib/validation";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { FormActions } from "@/components/forms/FormActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

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
    deadline: string;
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
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = signupBonusSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setPending(true);
    try {
      await apiFetch(`/api/cards/${cardId}/signup-bonus`, {
        method: "POST",
        body: parsed.data,
      });
      onOpenChange(false);
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
          <DialogTitle>{initial ? "Edit signup bonus" : "Set signup bonus"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          {error && <ErrorBanner message={error} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Spend requirement ($)">
              <Input
                type="number"
                min="1"
                step="1"
                value={values.spendRequirement}
                onChange={(event) => set("spendRequirement", event.target.value)}
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
                onChange={(event) => set("rewardAmount", event.target.value)}
                placeholder="60000"
                required
              />
            </Field>
            <Field label="Reward type">
              <NativeSelect
                value={values.rewardType}
                onChange={(event) => set("rewardType", event.target.value)}
              >
                {REWARD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === "cashback" ? "Cash back" : type[0].toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Deadline">
              <Input
                type="date"
                value={values.deadline}
                onChange={(event) => set("deadline", event.target.value)}
                required
              />
            </Field>
          </div>
          <FormActions
            onCancel={() => onOpenChange(false)}
            pending={pending}
            submitLabel="Save bonus"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
