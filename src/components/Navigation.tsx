"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDownIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { Brand } from "@/components/Brand";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/home", label: "Home", activePaths: ["/home"] },
  {
    href: "/money",
    label: "Money",
    activePaths: [
      "/money",
      "/dashboard",
      "/cards",
      "/transactions",
      "/benefits",
      "/optimizer",
    ],
  },
  { href: "/invest", label: "Invest", activePaths: ["/invest"] },
  { href: "/learn", label: "Learn", activePaths: ["/learn"] },
  { href: "/plan", label: "Plan", activePaths: ["/plan"] },
  { href: "/profile", label: "Profile", activePaths: ["/profile"] },
];

export function Navigation({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    setError("");
    setLoggingOut(true);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not log out.");
    } finally {
      setLoggingOut(false);
    }
  }

  function links(mobile = false) {
    return LINKS.map(({ href, label, activePaths }) => {
      const active = activePaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      );
      return (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          aria-current={active ? "page" : undefined}
          className={cn(
            "relative flex items-center font-semibold uppercase transition-colors hover:text-foreground",
            mobile
              ? "min-h-16 border-b border-border text-xl tracking-wide"
              : "h-16 text-[11px] tracking-[.05em] lg:text-[13px]",
            active
              ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
              : "text-muted-foreground",
          )}
        >
          {label}
        </Link>
      );
    });
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-design-xs px-design-xs sm:px-design-md lg:px-design-lg">
          <Link
            href="/home"
            aria-label="Cardinal home"
            className="shrink-0"
          >
            <Brand />
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-design-xs md:flex lg:gap-design-md"
          >
            {links()}
          </nav>
          <div className="flex items-center gap-design-xxs">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`${userName}, account menu`}
                className="flex h-12 items-center gap-design-xxs px-design-xxs text-xs text-foreground hover:bg-accent"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {userName
                    .trim()
                    .split(/\s+/)
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
                <ChevronDownIcon className="hidden size-4 sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <p className="truncate border-b border-border px-3 py-4 text-sm">
                  {userName}
                </p>
                <DropdownMenuItem onClick={logout} disabled={loggingOut}>
                  <LogOutIcon className="size-4" />
                  {loggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open navigation"
                  />
                }
              >
                <MenuIcon className="size-5" />
              </DialogTrigger>
              <DialogContent
                className="top-0 left-0 h-dvh max-h-dvh max-w-full translate-x-0 translate-y-0 rounded-none border-0 bg-background px-design-sm py-design-lg sm:max-w-full"
                aria-describedby={undefined}
              >
                <div>
                  <DialogTitle className="mb-design-lg">
                    <Brand />
                  </DialogTitle>
                  <nav aria-label="Mobile primary" className="grid">
                    {links(true)}
                  </nav>
                  <p className="mt-design-xl text-xs text-muted-foreground">
                    Credit. Considered.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      {error && (
        <div className="mx-auto w-full max-w-[1376px] px-design-xs pt-design-xs sm:px-design-md lg:px-design-lg">
          <ErrorBanner message={error} />
        </div>
      )}
    </>
  );
}
