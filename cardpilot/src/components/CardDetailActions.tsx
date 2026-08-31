"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, Trash2Icon, PlusIcon, XIcon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { categoryLabel } from "@/lib/categories";
import { formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardForm, type CardFormValues } from "@/components/forms/CardForm";
import { RewardRuleForm } from "@/components/forms/RewardRuleForm";
import { BenefitForm } from "@/components/forms/BenefitForm";
import { BonusForm } from "@/components/forms/BonusForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

/** Edit + delete controls for a card. */
export function CardActions({ card }: { card: CardFormValues & { id: string } }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteCard() {
    setDeleting(true);
    try {
      await apiFetch(`/api/cards/${card.id}`, { method: "DELETE" });
      router.push("/cards");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <PencilIcon className="size-4" /> Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setConfirmOpen(true)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2Icon className="size-4" /> Delete
      </Button>
      {editOpen && <CardForm open={editOpen} onOpenChange={setEditOpen} initial={card} />}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this card?</DialogTitle>
            <DialogDescription>
              This permanently removes the card along with its transactions, reward rules,
              benefits, and bonus history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCard} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete card"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export interface RuleView {
  id: string;
  category: string;
  multiplier: number;
  startDate: Date | string | null;
  endDate: Date | string | null;
  spendingCap: number | null;
}

/** Reward rule chips with add/remove. */
export function RewardRules({ cardId, rules }: { cardId: string; rules: RuleView[] }) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function remove(id: string) {
    setRemovingId(id);
    try {
      await apiFetch(`/api/reward-categories/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {rules.map((r) => (
          <Badge key={r.id} variant="secondary" className="gap-1.5 py-1 pr-1 pl-2.5">
            <span>
              {r.multiplier}x {categoryLabel(r.category)}
              {r.endDate ? ` (until ${formatShortDate(r.endDate)})` : ""}
              {r.spendingCap ? ` · $${r.spendingCap} cap` : ""}
            </span>
            <button
              aria-label={`Remove ${categoryLabel(r.category)} rule`}
              onClick={() => remove(r.id)}
              disabled={removingId === r.id}
              className="rounded-full p-0.5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        ))}
        <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
          <PlusIcon className="size-3.5" /> Rule
        </Button>
      </div>
      <RewardRuleForm open={addOpen} onOpenChange={setAddOpen} cardId={cardId} />
    </div>
  );
}

export function AddBenefitButton({ cardId }: { cardId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="size-3.5" /> Benefit
      </Button>
      <BenefitForm open={open} onOpenChange={setOpen} cardId={cardId} />
    </>
  );
}

export function SetBonusButton({
  cardId,
  initial,
}: {
  cardId: string;
  initial?: { spendRequirement: number; rewardAmount: number; rewardType: string; deadline: string };
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {initial ? <PencilIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
        {initial ? "Edit bonus" : "Bonus"}
      </Button>
      {open && <BonusForm open={open} onOpenChange={setOpen} cardId={cardId} initial={initial} />}
    </>
  );
}
