"use client";

// Small client-side launchers for the form dialogs, usable from server pages.

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardForm } from "@/components/forms/CardForm";
import { TransactionForm } from "@/components/forms/TransactionForm";

export function AddCardButton({
  variant = "default",
  size = "sm",
  label = "Add card",
}: {
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        <PlusIcon className="size-4" /> {label}
      </Button>
      <CardForm open={open} onOpenChange={setOpen} />
    </>
  );
}

export function AddTransactionButton({
  cards,
  defaultCardId,
  label = "Add transaction",
}: {
  cards: { id: string; name: string }[];
  defaultCardId?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} disabled={cards.length === 0}>
        <PlusIcon className="size-4" /> {label}
      </Button>
      <TransactionForm
        open={open}
        onOpenChange={setOpen}
        cards={cards}
        defaultCardId={defaultCardId}
      />
    </>
  );
}
