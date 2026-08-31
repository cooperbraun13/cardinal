"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { CARD_THEMES, NETWORKS } from "@/lib/categories";
import { cardSchema } from "@/lib/validation";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { FormActions } from "@/components/forms/FormActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

export interface CardFormValues {
  id?: string;
  name: string;
  issuer: string;
  network: string;
  lastFour: string;
  creditLimit: string;
  currentBalance: string;
  annualFee: string;
  statementDay: string;
  dueDay: string;
  openedAt: string;
  cardTheme: string;
}

const EMPTY: CardFormValues = {
  name: "",
  issuer: "",
  network: "",
  lastFour: "",
  creditLimit: "",
  currentBalance: "0",
  annualFee: "0",
  statementDay: "1",
  dueDay: "25",
  openedAt: "",
  cardTheme: "midnight",
};

export function CardForm({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: CardFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CardFormValues>(initial ?? EMPTY);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isEdit = Boolean(initial?.id);

  function set<K extends keyof CardFormValues>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = cardSchema.safeParse({
      name: values.name,
      issuer: values.issuer,
      network: values.network || null,
      lastFour: values.lastFour || null,
      creditLimit: values.creditLimit,
      currentBalance: values.currentBalance || "0",
      annualFee: values.annualFee || "0",
      statementDay: values.statementDay,
      dueDay: values.dueDay,
      openedAt: values.openedAt || null,
      cardTheme: values.cardTheme,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setPending(true);
    try {
      await apiFetch(isEdit ? `/api/cards/${initial!.id}` : "/api/cards", {
        method: isEdit ? "PATCH" : "POST",
        body: parsed.data,
      });
      onOpenChange(false);
      if (!isEdit) setValues(EMPTY);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit card" : "Add a card"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          {error && <ErrorBanner message={error} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Card name">
              <Input
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                placeholder="Sapphire Preferred"
                required
              />
            </Field>
            <Field label="Issuer">
              <Input
                value={values.issuer}
                onChange={(event) => set("issuer", event.target.value)}
                placeholder="Chase"
                required
              />
            </Field>
            <Field label="Network">
              <NativeSelect
                value={values.network}
                onChange={(event) => set("network", event.target.value)}
              >
                <option value="">None</option>
                {NETWORKS.map((network) => (
                  <option key={network} value={network}>
                    {network === "amex" ? "Amex" : network[0].toUpperCase() + network.slice(1)}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Last 4 digits">
              <Input
                value={values.lastFour}
                onChange={(event) =>
                  set("lastFour", event.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="1234"
                inputMode="numeric"
              />
            </Field>
            <Field label="Credit limit ($)">
              <Input
                type="number"
                min="1"
                step="0.01"
                value={values.creditLimit}
                onChange={(event) => set("creditLimit", event.target.value)}
                required
              />
            </Field>
            <Field label="Current balance ($)">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={values.currentBalance}
                onChange={(event) => set("currentBalance", event.target.value)}
              />
            </Field>
            <Field label="Annual fee ($)">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={values.annualFee}
                onChange={(event) => set("annualFee", event.target.value)}
              />
            </Field>
            <Field label="Opened on">
              <Input
                type="date"
                value={values.openedAt}
                onChange={(event) => set("openedAt", event.target.value)}
              />
            </Field>
            <Field label="Statement day (1-28)">
              <Input
                type="number"
                min="1"
                max="28"
                value={values.statementDay}
                onChange={(event) => set("statementDay", event.target.value)}
                required
              />
            </Field>
            <Field label="Due day (1-28)">
              <Input
                type="number"
                min="1"
                max="28"
                value={values.dueDay}
                onChange={(event) => set("dueDay", event.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Card theme">
            <div className="flex flex-wrap gap-2">
              {CARD_THEMES.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => set("cardTheme", theme)}
                  aria-label={`${theme} card theme`}
                  aria-pressed={values.cardTheme === theme}
                  className={cn(
                    `card-theme-${theme}`,
                    "h-9 w-13 rounded-lg border border-white/10 transition-[transform,border-color] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
                    values.cardTheme === theme && "border-white/70 ring-2 ring-white/30"
                  )}
                />
              ))}
            </div>
          </Field>

          <FormActions
            onCancel={() => onOpenChange(false)}
            pending={pending}
            submitLabel={isEdit ? "Save changes" : "Add card"}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
