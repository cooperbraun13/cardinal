import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { Brand } from "@/components/Brand";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation userName={user.name} />
      <a
        href="#main-content"
        className="sr-only fixed top-4 left-4 z-50 bg-foreground px-4 py-3 text-background focus:not-sr-only"
      >
        Skip to content
      </a>
      <main
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1 outline-none"
      >
        {children}
      </main>
      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="flex items-center gap-design-sm">
            <Brand />
            <span>Credit. Considered.</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-design-sm">
            <Link className="text-link" href="/cards">
              Your wallet
            </Link>
            <Link className="text-link" href="/benefits">
              Benefits
            </Link>
            <Link className="text-link" href="/optimizer">
              Optimizer
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
