"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Field } from "@/components/forms/Field";
import { SearchIcon, XIcon } from "lucide-react";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

export function TransactionFilters({
  cards,
}: {
  cards: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useSearchParams();
  function apply(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    const query = next.toString();
    startTransition(() =>
      router.push(query ? `${pathname}?${query}` : pathname),
    );
  }

  const hasFilters = [
    "search",
    "cardId",
    "category",
    "status",
    "from",
    "to",
  ].some((key) => params.has(key));

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy={pending}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          apply({ search: String(form.get("search") ?? "") });
        }}
        className="sm:col-span-2 xl:col-span-3"
      >
        <label
          htmlFor="activity-search"
          className="mb-2 block text-xs font-medium text-foreground/85"
        >
          Search activity
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="activity-search"
            key={params.get("search") ?? ""}
            name="search"
            defaultValue={params.get("search") ?? ""}
            placeholder="Search merchant..."
            className="pr-24 pl-9"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0"
            disabled={pending}
          >
            {pending ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      <Field label="Card">
        <NativeSelect
          value={params.get("cardId") ?? ""}
          onChange={(event) => apply({ cardId: event.target.value })}
          aria-label="Filter by card"
          wrapperClassName="w-full"
        >
          <option value="">All cards</option>
          {cards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.name}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field label="Category">
        <NativeSelect
          value={params.get("category") ?? ""}
          onChange={(event) => apply({ category: event.target.value })}
          aria-label="Filter by category"
          wrapperClassName="w-full"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {categoryLabel(category)}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field label="Status">
        <NativeSelect
          value={params.get("status") ?? ""}
          onChange={(event) => apply({ status: event.target.value })}
          aria-label="Filter by status"
          wrapperClassName="w-full"
        >
          <option value="">Any status</option>
          <option value="posted">Posted</option>
          <option value="pending">Pending</option>
        </NativeSelect>
      </Field>

      <Field label="From date">
        <Input
          type="date"
          value={params.get("from") ?? ""}
          onChange={(event) => apply({ from: event.target.value })}
          aria-label="From date"
        />
      </Field>
      <Field label="To date">
        <Input
          type="date"
          value={params.get("to") ?? ""}
          onChange={(event) => apply({ to: event.target.value })}
          aria-label="To date"
        />
      </Field>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            router.push(pathname);
          }}
          className="self-end justify-self-start"
        >
          <XIcon className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
