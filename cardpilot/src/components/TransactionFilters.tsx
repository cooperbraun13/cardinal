"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";

/** URL-driven filter bar — filters live in searchParams so results are shareable. */
export function TransactionFilters({ cards }: { cards: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");

  function apply(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page"); // filters reset pagination
    router.push(`${pathname}?${next.toString()}`);
  }

  const hasFilters = ["search", "cardId", "category", "status", "from", "to"].some((k) =>
    params.get(k)
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ search });
        }}
        className="relative"
      >
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search merchant…"
          className="w-48 pl-8"
          aria-label="Search merchant"
        />
      </form>
      <NativeSelect
        value={params.get("cardId") ?? ""}
        onChange={(e) => apply({ cardId: e.target.value })}
        aria-label="Filter by card"
        className="w-40"
      >
        <option value="">All cards</option>
        {cards.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        value={params.get("category") ?? ""}
        onChange={(e) => apply({ category: e.target.value })}
        aria-label="Filter by category"
        className="w-40"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {categoryLabel(c)}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        value={params.get("status") ?? ""}
        onChange={(e) => apply({ status: e.target.value })}
        aria-label="Filter by status"
        className="w-32"
      >
        <option value="">Any status</option>
        <option value="posted">Posted</option>
        <option value="pending">Pending</option>
      </NativeSelect>
      <Input
        type="date"
        value={params.get("from") ?? ""}
        onChange={(e) => apply({ from: e.target.value })}
        aria-label="From date"
        className="w-36"
      />
      <Input
        type="date"
        value={params.get("to") ?? ""}
        onChange={(e) => apply({ to: e.target.value })}
        aria-label="To date"
        className="w-36"
      />
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            router.push(pathname);
          }}
          className="text-muted-foreground"
        >
          <XIcon className="size-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}
