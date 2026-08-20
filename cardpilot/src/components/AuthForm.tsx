"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCardIcon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { loginSchema, registerSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/Field";
import { ErrorBanner } from "@/components/ErrorBanner";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isLogin = mode === "login";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const schema = isLogin ? loginSchema : registerSchema;
    const parsed = schema.safeParse(isLogin ? { email: values.email, password: values.password } : values);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
          <CreditCardIcon className="size-5 text-white" />
        </div>
        <span className="text-2xl font-semibold tracking-tight">CardPilot</span>
      </div>
      <div className="glass w-full max-w-sm rounded-2xl border border-border p-6">
        <h1 className="text-lg font-semibold">{isLogin ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLogin
            ? "Log in to see your cards, rewards, and benefits."
            : "Track your cards, rewards, and always know which card to swipe."}
        </p>
        <form onSubmit={submit} className="mt-5 grid gap-3.5">
          {error && <ErrorBanner message={error} />}
          {!isLogin && (
            <Field label="Name">
              <Input
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
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
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
              placeholder={isLogin ? "••••••••" : "At least 8 characters"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </Field>
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {isLogin ? (
            <>
              New to CardPilot?{" "}
              <Link href="/register" className="text-foreground underline underline-offset-2">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-foreground underline underline-offset-2">
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
