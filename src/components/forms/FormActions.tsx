import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

export function FormActions({
  onCancel,
  pending,
  disabled = false,
  submitLabel,
  pendingLabel = "Saving...",
}: {
  onCancel: () => void;
  pending: boolean;
  disabled?: boolean;
  submitLabel: string;
  pendingLabel?: string;
}) {
  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={pending}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={pending || disabled}>
        {pending && (
          <LoaderCircleIcon
            className="size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {pending ? pendingLabel : submitLabel}
      </Button>
    </DialogFooter>
  );
}
