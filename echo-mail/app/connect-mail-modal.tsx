"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, X } from "lucide-react";

export function ConnectMailModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldShow = searchParams.get("connect") === "mail";

  if (!shouldShow) {
    return null;
  }

  function dismiss() {
    router.replace("/");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_28px_90px_-35px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Mail className="size-6" />
          </div>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-950">
          Connect to your mail
        </h2>

        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Your Mail Plus account is ready. Connect Gmail to grant mail access
          and sync your inbox into Mail Plus.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/api/gmail/connect"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Connect Gmail
            <ArrowRight className="size-4" />
          </Link>

          <button
            type="button"
            onClick={dismiss}
            className="h-11 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Do this later
          </button>
        </div>
      </div>
    </div>
  );
}
