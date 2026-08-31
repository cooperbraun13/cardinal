import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar userName={user.name} />
      <main className="min-w-0 flex-1">
        <div className="page-shell">{children}</div>
      </main>
    </div>
  );
}
