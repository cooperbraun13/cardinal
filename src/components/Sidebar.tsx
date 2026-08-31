"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChartColumnIcon,
  ChevronDownIcon,
  GemIcon,
  HomeIcon,
  ListIcon,
  LogOutIcon,
  MenuIcon,
  WalletCardsIcon,
  XIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/client";
import { Brand } from "@/components/Brand";
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
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
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

  const navigation = (
    <nav aria-label="Primary" className="grid gap-1 px-3">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring/30 focus-visible:outline-none",
              active
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/65 hover:text-sidebar-foreground"
            )}
          >
            <Icon
              className={cn(
                "size-[18px] shrink-0 transition-colors",
                active ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
              )}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const account = (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-12 w-full items-center gap-3 rounded-lg px-3 text-left transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring/30">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {initials(userName)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{userName}</span>
          <span className="block text-[11px] text-muted-foreground">Personal account</span>
        </span>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar py-6 lg:flex">
        <Link
          href="/dashboard"
          aria-label="Cardinal overview"
          className="mx-4 inline-flex rounded-lg px-2 py-1 focus-visible:ring-2 focus-visible:ring-sidebar-ring/30 focus-visible:outline-none"
        >
          <Brand />
        </Link>
        <div className="mt-9">{navigation}</div>
        <div className="mt-auto border-t border-sidebar-border px-3 pt-4">{account}</div>
      </aside>

      <div className="sticky top-0 z-40 border-b border-sidebar-border bg-sidebar lg:hidden">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            aria-label="Cardinal overview"
            className="rounded-lg focus-visible:ring-2 focus-visible:ring-sidebar-ring/30 focus-visible:outline-none"
          >
            <Brand />
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </Button>
        </div>
        {mobileOpen && (
          <div id="mobile-navigation" className="border-t border-sidebar-border py-3">
            {navigation}
            <div className="mt-3 border-t border-sidebar-border px-3 pt-3">{account}</div>
          </div>
        )}
      </div>
    </>
  );
}
