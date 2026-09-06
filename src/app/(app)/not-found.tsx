import Link from "next/link";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Page not found"
        title="Let’s get you back on track."
        description="This item may have been removed or is no longer available."
      />
      <EmptyState
        icon={SearchIcon}
        title="A fresh look at your wallet"
        description="Head back to your cards to find what you need."
        className="panel min-h-80"
        action={
          <Button nativeButton={false} render={<Link href="/cards" />}>
            <ArrowLeftIcon className="size-4" />
            Back to cards
          </Button>
        }
      />
    </div>
  );
}
