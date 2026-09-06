import Link from "next/link";
import { ArrowRightIcon, type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export function FeaturePlaceholder({
  eyebrow,
  title,
  description,
  icon,
  availableNow,
  links = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  availableNow: string;
  links?: { href: string; label: string }[];
}) {
  return (
    <div className="page-shell page-stack">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState
        icon={icon}
        title="Built one clear step at a time."
        description={availableNow}
        className="panel min-h-72"
      />
      {links.length > 0 && (
        <section aria-label="Continue in Cardinal" className="border-t border-border pt-design-md">
          <p className="eyebrow">Continue in Cardinal</p>
          <div className="mt-design-sm flex flex-wrap gap-x-design-md gap-y-design-xxs">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-link">
                {link.label} <ArrowRightIcon className="size-4" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
