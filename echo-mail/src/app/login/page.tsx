"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          throw error;
        }

        setMessage(
          "Account created. Check your inbox to verify your email address.",
        );

        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f8f8f7] lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Mail className="size-5" />
            </div>

            <span className="text-xl font-semibold tracking-tight">
              Mail Plus
            </span>
          </Link>

          <div className="mt-12">
            <p className="text-sm font-medium text-indigo-600">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {mode === "login"
                ? "Sign in to Mail Plus"
                : "Start clearing your inbox"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              {mode === "login"
                ? "Access the conversations that need your attention."
                : "Create an account before connecting your Gmail inbox."}
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-700"
              >
                Email address
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-700"
                >
                  Password
                </label>

                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>

              <div className="relative mt-2">
                <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-12 text-sm outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`rounded-xl border p-3 text-sm ${
                  isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  {mode === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            {mode === "login"
              ? "Don’t have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setMessage("");
              }}
              className="ml-1 font-medium text-neutral-950"
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-neutral-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.45),_transparent_38%)]" />

        <div className="relative z-10">
          <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-300">
            <Sparkles className="size-3.5" />
            AI-powered attention inbox
          </div>

          <h2 className="mt-8 max-w-lg text-5xl font-semibold leading-tight tracking-tight">
            Spend less time checking email.
          </h2>

          <p className="mt-5 max-w-md leading-7 text-neutral-400">
            Mail Plus finds missed replies, silent conversations, pending
            payments and important follow-ups.
          </p>
        </div>

        <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-sm text-neutral-400">Today’s attention inbox</p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["3", "Need reply"],
              ["2", "Follow-ups"],
              ["1", "Payment"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-neutral-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
