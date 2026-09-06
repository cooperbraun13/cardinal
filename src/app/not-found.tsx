import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 text-center">
      <Brand />
      <p className="eyebrow mt-12">Page not found</p>
      <h1 className="page-title mt-4">Let’s get you back on track.</h1>
      <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
        This page may have moved, or the item is no longer available.
      </p>
      <Button className="mt-7" nativeButton={false} render={<Link href="/" />}>
        <ArrowLeftIcon className="size-4" />
        Back to Cardinal
      </Button>
    </main>
  );
}
