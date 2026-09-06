"use client";
import { RefreshCwIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="A brief interruption"
        title="We couldn’t load this page."
        description="Try again in a moment."
      />
      <div role="alert">
        <EmptyState
          icon={RefreshCwIcon}
          title="Let’s give that another try"
          description="Your page couldn’t be loaded. You can retry or use the navigation to visit another section."
          action={
            <Button onClick={() => window.location.reload()}>Try again</Button>
          }
          className="panel min-h-80"
        />
      </div>
    </div>
  );
}
