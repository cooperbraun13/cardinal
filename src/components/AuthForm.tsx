"use client";

import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client";
import { loginSchema, registerSchema } from "@/lib/validation";
import { Brand } from "@/components/Brand";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      isLogin ? { email: values.email, password: values.password } : values,
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
      router.push("/home");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong.",
      );
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="flex h-16 items-center border-b border-border px-design-xs sm:px-design-md lg:px-design-lg">
        <Link href="/" aria-label="Cardinal home">
          <Brand />
        </Link>
      </header>
      <div className="grid min-h-[calc(100svh-64px)] lg:grid-cols-[1.1fr_1fr]">
        <aside className="relative isolate flex min-h-64 items-end overflow-hidden bg-background sm:min-h-80 lg:min-h-full">
          <Image
            src="/cardinal-cinema-hd.png"
            alt=""
            fill
            priority
            quality={100}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="-z-20 object-cover object-[65%_center]"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-background/95 via-background/20 to-transparent" />
          <div className="px-design-xs py-design-md sm:px-design-md lg:px-design-xl lg:py-design-xxl">
            <p className="eyebrow text-white">Credit. Considered.</p>
            <h2 className="mt-design-sm text-[32px] leading-[1.05] font-medium tracking-[-.02em] sm:text-[56px] xl:text-[80px]">
              Every card.
              <br />
              Every possibility.
            </h2>
            <p className="mt-design-sm max-w-sm text-sm leading-6 text-white">
              Discover the full potential of your wallet. Balances, rewards, and
              benefits, brought into focus.
            </p>
          </div>
        </aside>
        <main className="flex items-center justify-center px-design-xs py-design-xl sm:px-design-md lg:px-design-xl">
          <div className="w-full max-w-md">
            <p className="eyebrow">
              {isLogin ? "Welcome back" : "Get started"}
            </p>
            <h1 className="page-title mt-3">
              {isLogin ? "Welcome back." : "Your next chapter."}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {isLogin
                ? "Review your cards, rewards, benefits, and recent activity."
                : "Build a clear, private view of every credit card you manage."}
            </p>

            <form
              onSubmit={submit}
              className="mt-design-lg grid gap-design-sm"
              aria-busy={pending}
            >
              {error && <ErrorBanner message={error} />}
              {!isLogin && (
                <Field label="Name">
                  <Input
                    value={values.name}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
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
                    setValues((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
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
                    setValues((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder={
                    isLogin ? "Enter your password" : "At least 8 characters"
                  }
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                />
              </Field>
              <Button type="submit" disabled={pending} className="mt-2 w-full">
                {pending ? (
                  <LoaderCircleIcon
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                {pending
                  ? "Please wait..."
                  : isLogin
                    ? "Log in"
                    : "Create account"}
                {!pending && (
                  <ArrowRightIcon className="size-4" aria-hidden="true" />
                )}
              </Button>
            </form>

            <p className="mt-design-sm text-center text-sm text-muted-foreground">
              {isLogin ? (
                <>
                  New to Cardinal?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Log in
                  </Link>
                </>
              )}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
