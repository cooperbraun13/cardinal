"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { categoryLabel } from "@/lib/categories";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ErrorBanner";
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
export function CardActions({
  card,
}: {
  card: CardFormValues & { id: string };
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteCard() {
    setError("");
    setDeleting(true);
    try {
      await apiFetch(`/api/cards/${card.id}`, { method: "DELETE" });
      router.push("/cards");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not delete card.",
      );
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
      {editOpen && (
        <CardForm open={editOpen} onOpenChange={setEditOpen} initial={card} />
      )}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this card?</DialogTitle>
            <DialogDescription>
              This permanently removes the card along with its transactions,
              reward rules, benefits, and bonus history.
            </DialogDescription>
          </DialogHeader>
          {error && <ErrorBanner message={error} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteCard}
              disabled={deleting}
            >
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
export function RewardRules({
  cardId,
  rules,
}: {
  cardId: string;
  rules: RuleView[];
}) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function remove(id: string) {
    setError("");
    setRemovingId(id);
    try {
      await apiFetch(`/api/reward-categories/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not remove rule.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      {error && <ErrorBanner message={error} className="mb-2" />}
      <div className="divide-y divide-border">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between gap-3 py-4 first:pt-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">
                <span className="mr-3 inline-block min-w-9 text-lg tabular-nums">
                  {rule.multiplier}x
                </span>
                {categoryLabel(rule.category)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {rule.startDate && (
                  <span>From {formatShortDate(rule.startDate)}</span>
                )}
                {rule.endDate && (
                  <Badge variant="outline">
                    Until {formatShortDate(rule.endDate)}
                  </Badge>
                )}
                {rule.spendingCap !== null && (
                  <Badge variant="outline">
                    {formatCurrency(rule.spendingCap)} cap
                  </Badge>
                )}
                {!rule.startDate &&
                  !rule.endDate &&
                  rule.spendingCap === null && (
                    <span>Standard earning rate</span>
                  )}
              </div>
            </div>
            <Button
              aria-label={`Remove ${categoryLabel(rule.category)} rule`}
              onClick={() => remove(rule.id)}
              disabled={removingId !== null}
              variant="ghost"
              size="icon-sm"
              className="hover:text-destructive"
            >
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      {rules.length === 0 && (
        <p className="mb-design-sm text-sm leading-6 text-muted-foreground">
          No reward rules yet. Add the categories this card earns on.
        </p>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAddOpen(true)}
        className="mt-3"
      >
        <PlusIcon className="size-4" /> Add reward rule
      </Button>
      <RewardRuleForm
        open={addOpen}
        onOpenChange={setAddOpen}
        cardId={cardId}
      />
    </div>
  );
}

export function AddBenefitButton({ cardId }: { cardId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="size-3.5" /> Add benefit
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
  initial?: {
    spendRequirement: number;
    rewardAmount: number;
    rewardType: string;
    deadline: string;
  };
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {initial ? (
          <PencilIcon className="size-3.5" />
        ) : (
          <PlusIcon className="size-3.5" />
        )}
        {initial ? "Edit bonus" : "Add bonus"}
      </Button>
      {open && (
        <BonusForm
          open={open}
          onOpenChange={setOpen}
          cardId={cardId}
          initial={initial}
        />
      )}
    </>
  );
}
