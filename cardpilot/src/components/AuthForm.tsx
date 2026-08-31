"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { loginSchema, registerSchema } from "@/lib/validation";
import { Brand } from "@/components/Brand";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FEATURES = [
  "Balances and utilization at a glance",
  "Reward rules, benefits, and bonuses together",
  "A clear card recommendation before every purchase",
];

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isLogin = mode === "login";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const schema = isLogin ? loginSchema : registerSchema;
    const parsed = schema.safeParse(
      isLogin ? { email: values.email, password: values.password } : values
    );
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setPending(true);
    try {
      await apiFetch(`/api/auth/${isLogin ? "login" : "register"}`, {
        method: "POST",
        body: parsed.data,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(20rem,0.8fr)_minmax(30rem,1.2fr)]">
      <aside className="hidden border-r border-sidebar-border bg-sidebar p-10 lg:flex lg:flex-col xl:p-14">
        <Link
          href="/"
          aria-label="Cardinal home"
          className="w-fit rounded-lg focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          <Brand />
        </Link>
        <div className="my-auto max-w-md py-12">
          <p className="eyebrow text-primary">Credit, clarified</p>
          <h1 className="mt-4 text-4xl leading-[1.05] font-semibold tracking-[-0.05em] text-balance">
            Every card. One calm financial view.
          </h1>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Cardinal turns balances, payment dates, rewards, and benefits into the few decisions
            that matter today.
          </p>
          <div className="mt-9 divide-y divide-sidebar-border border-y border-sidebar-border">
            {FEATURES.map((feature) => (
              <p key={feature} className="py-3.5 text-sm text-foreground/80">
                {feature}
              </p>
            ))}
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Your account data stays scoped to your session and is never shared between users.
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            aria-label="Cardinal home"
            className="mb-10 inline-flex rounded-lg focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none lg:hidden"
          >
            <Brand />
          </Link>

          <p className="eyebrow">{isLogin ? "Welcome back" : "Get started"}</p>
          <h1 className="page-title mt-3">
            {isLogin ? "Log in to Cardinal" : "Create your account"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {isLogin
              ? "Review your cards, rewards, benefits, and recent activity."
              : "Build a clear, private view of every credit card you manage."}
          </p>

          <form onSubmit={submit} className="panel mt-7 grid gap-4 p-5 sm:p-6">
            {error && <ErrorBanner message={error} />}
            {!isLogin && (
              <Field label="Name">
                <Input
                  value={values.name}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Alex Rivera"
                  autoComplete="name"
                  required
                />
              </Field>
            )}
            <Field label="Email">
              <Input
                type="email"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                value={values.password}
                onChange={(event) =>
                  setValues((current) => ({ ...current, password: event.target.value }))
                }
                placeholder={isLogin ? "Enter your password" : "At least 8 characters"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </Field>
            <Button type="submit" disabled={pending} className="mt-1 w-full">
              {pending ? "Please wait..." : isLogin ? "Log in" : "Create account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            {isLogin ? (
              <>
                New to Cardinal?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                >
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
