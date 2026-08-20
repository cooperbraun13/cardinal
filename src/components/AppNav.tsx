"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CreditCardIcon,
  LayoutDashboardIcon,
  WalletCardsIcon,
  GiftIcon,
  SparklesIcon,
  ReceiptIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/cards", label: "Cards", icon: WalletCardsIcon },
  { href: "/transactions", label: "Transactions", icon: ReceiptIcon },
  { href: "/benefits", label: "Benefits", icon: GiftIcon },
  { href: "/optimizer", label: "Optimizer", icon: SparklesIcon },
];

export function AppNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const nav = (vertical = false) => (
    <nav className={cn("flex gap-1", vertical && "flex-col")}>
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="glass sticky top-0 z-40 border-b border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
            <CreditCardIcon className="size-4 text-white" />
          </div>
          <span className="text-base font-semibold tracking-tight">CardPilot</span>
        </Link>

        <div className="hidden md:block">{nav()}</div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">{userName}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={logout}
            aria-label="Log out"
            className="text-muted-foreground"
          >
            <LogOutIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
          </Button>
        </div>
      </div>
      {mobileOpen && <div className="border-t border-border px-4 py-2 md:hidden">{nav(true)}</div>}
    </header>
  );
}
