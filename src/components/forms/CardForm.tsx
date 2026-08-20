"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { cardSchema } from "@/lib/validation";
import { NETWORKS, CARD_THEMES } from "@/lib/categories";
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
  initial?: CardFormValues; // present → edit mode
}) {
  const router = useRouter();
  const [values, setValues] = useState<CardFormValues>(initial ?? EMPTY);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isEdit = !!initial?.id;

  function set<K extends keyof CardFormValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
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
    };
    const parsed = cardSchema.safeParse(payload);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setError(issue.message);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit card" : "Add a card"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          {error && <ErrorBanner message={error} />}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Card name">
              <Input
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Sapphire Preferred"
                required
              />
            </Field>
            <Field label="Issuer">
              <Input
                value={values.issuer}
                onChange={(e) => set("issuer", e.target.value)}
                placeholder="Chase"
                required
              />
            </Field>
            <Field label="Network">
              <NativeSelect value={values.network} onChange={(e) => set("network", e.target.value)}>
                <option value="">None</option>
                {NETWORKS.map((n) => (
                  <option key={n} value={n}>
                    {n === "amex" ? "Amex" : n[0].toUpperCase() + n.slice(1)}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Last 4 digits">
              <Input
                value={values.lastFour}
                onChange={(e) => set("lastFour", e.target.value.replace(/\D/g, "").slice(0, 4))}
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
                onChange={(e) => set("creditLimit", e.target.value)}
                required
              />
            </Field>
            <Field label="Current balance ($)">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={values.currentBalance}
                onChange={(e) => set("currentBalance", e.target.value)}
              />
            </Field>
            <Field label="Annual fee ($)">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={values.annualFee}
                onChange={(e) => set("annualFee", e.target.value)}
              />
            </Field>
            <Field label="Opened on">
              <Input
                type="date"
                value={values.openedAt}
                onChange={(e) => set("openedAt", e.target.value)}
              />
            </Field>
            <Field label="Statement day (1–28)">
              <Input
                type="number"
                min="1"
                max="28"
                value={values.statementDay}
                onChange={(e) => set("statementDay", e.target.value)}
                required
              />
            </Field>
            <Field label="Due day (1–28)">
              <Input
                type="number"
                min="1"
                max="28"
                value={values.dueDay}
                onChange={(e) => set("dueDay", e.target.value)}
                required
              />
            </Field>
          </div>
          <Field label="Card theme">
            <div className="flex flex-wrap gap-2">
              {CARD_THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("cardTheme", t)}
                  aria-label={`${t} theme`}
                  className={cn(
                    `card-theme-${t}`,
                    "h-8 w-12 rounded-md transition-transform hover:scale-105",
                    values.cardTheme === t && "ring-2 ring-white/80 ring-offset-2 ring-offset-popover"
                  )}
                />
              ))}
            </div>
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save changes" : "Add card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
