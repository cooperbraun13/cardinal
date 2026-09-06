import { redirect } from "next/navigation";
import { UserRoundIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { ProfileForm } from "@/features/profile/ProfileForm";
import { getFinancialProfile } from "@/features/profile/service";

export const metadata = { title: "Profile - Cardinal" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="page-shell page-stack">
      <PageHeader eyebrow="Profile" title="Your context, on your terms." description="Cardinal will only ask for information that makes a future plan more useful." />
      <section className="panel panel-body max-w-2xl" aria-labelledby="account-heading">
        <UserRoundIcon className="size-5 text-muted-foreground" aria-hidden="true" />
        <p className="eyebrow mt-design-md">Account</p>
        <h2 id="account-heading" className="mt-design-xxs text-xl font-medium tracking-tight">{user.name}</h2>
        <p className="mt-design-xxs text-sm text-muted-foreground">{user.email}</p>
      </section>
      <section className="border-t border-border pt-design-md max-w-2xl">
        <p className="eyebrow">Financial profile</p>
        <h2 className="mt-design-xxs section-title">Only the details that help.</h2>
        <p className="mt-design-xs text-sm leading-6 text-muted-foreground">Every question is optional. Cardinal stores ranges and simple context, never account credentials or exact balances. You can return to change or clear your answers anytime.</p>
      </section>
      <ProfileForm initialValues={await getFinancialProfile(user.id)} />
    </div>
  );
}
