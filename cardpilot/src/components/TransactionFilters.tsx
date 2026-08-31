"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

export function TransactionFilters({ cards }: { cards: { id: string; name: string }[] }) {
  const router = useRouter();
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
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const hasFilters = ["search", "cardId", "category", "status", "from", "to"].some((key) =>
    params.has(key)
  );

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(12rem,1.4fr)_repeat(3,minmax(8rem,1fr))_9rem_9rem_auto]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          apply({ search: String(form.get("search") ?? "") });
        }}
        className="relative sm:col-span-2 xl:col-span-1"
      >
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          key={params.get("search") ?? ""}
          name="search"
          defaultValue={params.get("search") ?? ""}
          placeholder="Search merchant..."
          className="pl-9"
          aria-label="Search merchant"
        />
      </form>

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

      <Input
        type="date"
        value={params.get("from") ?? ""}
        onChange={(event) => apply({ from: event.target.value })}
        aria-label="From date"
      />
      <Input
        type="date"
        value={params.get("to") ?? ""}
        onChange={(event) => apply({ to: event.target.value })}
        aria-label="To date"
      />

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            router.push(pathname);
          }}
          className="justify-self-start xl:justify-self-end"
        >
          <XIcon className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
