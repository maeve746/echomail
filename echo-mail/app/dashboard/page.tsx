import { redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Inbox,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "../auth/logout-button";

type DashboardPageProps = {
  searchParams?: Promise<{
    l?: string;
    message?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const params = await searchParams;
  const status = params?.l;
  const message = params?.message;
  const connection = await getGmailConnection(userId);
  const isConnected = Boolean(connection);

  return (
    <main className="min-h-screen bg-[#f8f8f7] text-neutral-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
            <Mail className="size-5" />
          </div>

          <span className="text-xl font-semibold tracking-tight">
            Mail Plus
          </span>
        </div>

        <LogoutButton />
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 shadow-sm">
            <Sparkles className="size-3.5 text-indigo-600" />
            Account created
          </div>

          <h1 className="mt-7 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {isConnected
              ? "Gmail is connected and ready for your attention inbox."
              : "Connect your email to start finding important conversations."}
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-neutral-600">
            {isConnected
              ? "Mail Plus can now read your Gmail inbox and find conversations that need your attention."
              : "Mail Plus needs Gmail access after login so it can read your inbox, find missed replies, and prepare follow-up suggestions."}
          </p>

          {status && (
            <StatusMessage
              isConnected={isConnected}
              message={message}
              status={status}
            />
          )}

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["1", "Sign in"],
              ["2", isConnected ? "Gmail connected" : "Connect Gmail"],
              ["3", "Review inbox"],
            ].map(([step, label]) => (
              <div
                key={step}
                className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-medium text-neutral-400">
                  Step {step}
                </p>
                <p className="mt-2 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_24px_80px_-45px_rgba(0,0,0,0.4)]">
          <div
            className={`flex size-12 items-center justify-center rounded-2xl ${
              isConnected
                ? "bg-green-50 text-green-600"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {isConnected ? (
              <CheckCircle2 className="size-6" />
            ) : (
              <Inbox className="size-6" />
            )}
          </div>

          <h2 className="mt-6 text-2xl font-semibold tracking-tight">
            {isConnected ? "Gmail connected" : "Join your email"}
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            {isConnected
              ? `Connected as ${connection?.gmail_email}. Mail Plus can now read Gmail messages for your attention inbox.`
              : "Connect Gmail to let Mail Plus scan for emails that need your attention."}
          </p>

          <a
            href="/api/gmail/connect"
            className={`mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition ${
              isConnected
                ? "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
                : "bg-neutral-950 text-white hover:bg-neutral-800"
            }`}
          >
            {isConnected ? "Reconnect Gmail" : "Connect Gmail"}
            <ArrowRight className="size-4" />
          </a>

          <div className="mt-5 flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-green-600" />
            <p className="text-xs leading-5 text-neutral-500">
              You can revoke access from your Google account settings at any
              time.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

async function getGmailConnection(userId: string) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("gmail_connections")
      .select("gmail_email, created_at, updated_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function StatusMessage({
  isConnected,
  message,
  status,
}: {
  isConnected: boolean;
  message?: string;
  status: string;
}) {
  const success = isConnected && status === "connected";
  const displayMessage = getStatusMessage(status, success, message);

  return (
    <div
      className={`mt-6 flex max-w-2xl gap-3 rounded-2xl border p-4 ${
        success
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 size-5 shrink-0" />
      )}
      <p className="text-sm leading-6">{displayMessage}</p>
    </div>
  );
}

function getStatusMessage(
  status: string,
  success: boolean,
  message?: string,
) {
  if (success) {
    return "Gmail connected successfully.";
  }

  if (status === "error" && message) {
    return message;
  }

  return "Gmail is not connected yet.";
}
