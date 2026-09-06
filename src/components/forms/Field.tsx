"use client";

import { cloneElement, isValidElement, useId } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
  htmlFor,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  const generatedId = useId();
  const childId = isValidElement<{ id?: string }>(children)
    ? children.props.id
    : undefined;
  const controlId = htmlFor ?? childId ?? generatedId;
  const control = isValidElement<{ id?: string }>(children)
    ? cloneElement(children, { id: controlId })
    : children;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label
        htmlFor={controlId}
        className="text-xs font-medium text-foreground/85"
      >
        {label}
      </Label>
      {control}
    </div>
  );
}
