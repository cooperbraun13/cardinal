"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  WalletCardsIcon,
  ListIcon,
  GemIcon,
  ChartColumnIcon,
  ChevronDownIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: HomeIcon },
  { href: "/cards", label: "Cards", icon: WalletCardsIcon },
  { href: "/transactions", label: "Transactions", icon: ListIcon },
  { href: "/benefits", label: "Benefits", icon: GemIcon },
  { href: "/optimizer", label: "Optimizer", icon: ChartColumnIcon },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-white/5 font-semibold text-primary"
                : "font-medium text-muted-foreground hover:bg-white/3 hover:text-foreground"
            )}
          >
            <Icon className="size-4.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const userMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {initials(userName)}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{userName}</span>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon className="size-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const brand = (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-6" onClick={() => setMobileOpen(false)}>
      <img src="/cardinal-logo.png" alt="" className="h-8 w-8 object-contain" />
      <span className="text-lg font-bold tracking-tight">Cardinal</span>
    </Link>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-55 shrink-0 flex-col border-r border-border bg-sidebar py-6 md:flex">
        {brand}
        <div className="mt-8">{nav}</div>
        <div className="mt-auto px-3">{userMenu}</div>
      </aside>

      {/* Mobile top bar — menu expands in flow, nothing floats */}
      <div className="sticky top-0 z-40 border-b border-border bg-sidebar md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/cardinal-logo.png" alt="" className="h-7 w-7 object-contain" />
            <span className="text-base font-bold tracking-tight">Cardinal</span>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
          </Button>
        </div>
        {mobileOpen && (
          <div className="border-t border-border pb-3">
            <div className="pt-2">{nav}</div>
            <div className="mt-2 border-t border-border px-3 pt-2">{userMenu}</div>
          </div>
        )}
      </div>
    </>
  );
}
