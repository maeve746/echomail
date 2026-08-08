import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Mail,
  MessageSquareReply,
  Mic2,
  Search,
  Sparkles,
} from "lucide-react";

const emails = [
  {
    sender: "Sarah from Acme",
    subject: "Partnership proposal",
    description: "Waiting for your campaign pricing and deliverables.",
    status: "Needs reply",
    time: "12 min ago",
    tone: "urgent",
  },
  {
    sender: "David Miller",
    subject: "Website redesign invoice",
    description: "Invoice payment has been pending for eight days.",
    status: "Follow up",
    time: "8 days ago",
    tone: "warning",
  },
  {
    sender: "Olivia at Northstar",
    subject: "Product collaboration",
    description: "You sent the proposal, but they have not responded.",
    status: "Waiting",
    time: "3 days ago",
    tone: "neutral",
  },
];

const features = [
  {
    icon: MessageSquareReply,
    title: "Find missed replies",
    description:
      "Mail Plus separates important emails waiting for your response.",
  },
  {
    icon: Clock3,
    title: "Track follow-ups",
    description:
      "Know which clients, leads, and conversations have gone silent.",
  },
  {
    icon: Sparkles,
    title: "Generate responses",
    description:
      "Create contextual replies based on the complete email conversation.",
  },
  {
    icon: Mic2,
    title: "Spoken updates",
    description:
      "Hear a quick summary of everything that needs your attention.",
  },
];

function MailPlusLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm">
        <Mail className="size-4.5" />
      </div>

      <span className="text-lg font-semibold tracking-tight text-neutral-950">
        Mail Plus
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f8f7] text-neutral-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[720px] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.13),_transparent_48%)]" />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <MailPlusLogo />

        <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
          <a className="transition hover:text-neutral-950" href="#features">
            Features
          </a>
          <a className="transition hover:text-neutral-950" href="#how-it-works">
            How it works
          </a>
          <a className="transition hover:text-neutral-950" href="#pricing">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-white sm:block"
          >
            Sign in
          </Link>

          <Link
            href="/api/gmail/connect"
            className="flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
          >
            Connect Gmail
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-20 text-center lg:px-8 lg:pt-28">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3.5 py-2 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur">
          <Sparkles className="size-3.5" />
          Your AI-powered attention inbox
          <ChevronRight className="size-3.5 text-neutral-400" />
        </div>

        <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
          Your inbox,
          <span className="block text-neutral-400">
            without all the noise.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
          Mail Plus finds conversations that need a reply, follow-up, payment,
          or decision—so nothing important gets buried in your inbox.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/api/gmail/connect"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-neutral-950/10 transition hover:-translate-y-0.5 hover:bg-neutral-800 sm:w-auto"
          >
            <Mail className="size-4" />
            Connect Gmail
          </Link>

          <button className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm font-medium text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 sm:w-auto">
            View demo
            <ArrowRight className="size-4" />
          </button>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          Start free · No credit card required
        </p>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-r from-indigo-200/30 via-white to-violet-200/30 blur-3xl" />

          <div className="overflow-hidden rounded-[30px] border border-white bg-white/80 p-3 shadow-[0_30px_100px_-35px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="overflow-hidden rounded-[22px] border border-neutral-200 bg-[#fbfbfa] text-left">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <MailPlusLogo />

                  <div className="hidden h-5 w-px bg-neutral-200 sm:block" />

                  <span className="hidden text-sm text-neutral-500 sm:block">
                    Attention inbox
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    aria-label="Search"
                    className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500"
                  >
                    <Search className="size-4" />
                  </button>

                  <button
                    aria-label="Notifications"
                    className="relative flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500"
                  >
                    <Bell className="size-4" />
                    <span className="absolute right-2 top-2 size-1.5 rounded-full bg-indigo-500" />
                  </button>

                  <div className="flex size-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                    MP
                  </div>
                </div>
              </div>

              <div className="grid min-h-[520px] lg:grid-cols-[220px_1fr]">
                <aside className="hidden border-r border-neutral-200 p-4 lg:block">
                  <div className="space-y-1">
                    {[
                      ["Overview", "8"],
                      ["Needs reply", "3"],
                      ["Follow-ups", "2"],
                      ["Waiting", "2"],
                      ["Completed", ""],
                    ].map(([label, count], index) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                          index === 0
                            ? "bg-neutral-950 font-medium text-white"
                            : "text-neutral-600"
                        }`}
                      >
                        <span>{label}</span>
                        {count && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              index === 0
                                ? "bg-white/15 text-white"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Mic2 className="size-4" />
                    </div>

                    <p className="mt-3 text-sm font-medium">
                      Speak my updates
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Hear a quick summary of your important conversations.
                    </p>

                    <button className="mt-3 w-full rounded-lg bg-neutral-100 py-2 text-xs font-medium text-neutral-700">
                      Play summary
                    </button>
                  </div>
                </aside>

                <section className="p-5 sm:p-7">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                      <p className="text-sm text-neutral-500">
                        Thursday, August 6
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                        Good afternoon, Monu
                      </h2>
                      <p className="mt-1 text-sm text-neutral-500">
                        8 conversations need your attention.
                      </p>
                    </div>

                    <button className="flex w-fit items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium shadow-sm">
                      <Sparkles className="size-3.5" />
                      Generate daily brief
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {[
                      ["Needs reply", "3"],
                      ["Follow-ups", "2"],
                      ["Payment", "1"],
                      ["Waiting", "2"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                      >
                        <p className="text-xs text-neutral-500">{label}</p>
                        <p className="mt-2 text-2xl font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">
                        Priority conversations
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        Sorted by urgency and expected impact
                      </p>
                    </div>

                    <button className="text-xs font-medium text-neutral-500">
                      View all
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {emails.map((email) => (
                      <article
                        key={email.subject}
                        className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex gap-4">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-sm font-semibold text-neutral-700">
                            {email.sender.charAt(0)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">
                                  {email.sender}
                                </p>
                                <p className="mt-0.5 truncate text-sm text-neutral-700">
                                  {email.subject}
                                </p>
                              </div>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                  email.tone === "urgent"
                                    ? "bg-red-50 text-red-600"
                                    : email.tone === "warning"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-neutral-100 text-neutral-600"
                                }`}
                              >
                                {email.status}
                              </span>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-neutral-500">
                              {email.description}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[11px] text-neutral-400">
                                {email.time}
                              </span>

                              <button className="flex items-center gap-1 text-xs font-medium text-neutral-700 opacity-70 transition group-hover:opacity-100">
                                Open conversation
                                <ArrowRight className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-indigo-600">
            Everything that needs attention
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop checking every email manually.
          </h2>

          <p className="mt-4 leading-7 text-neutral-600">
            Mail Plus turns a noisy inbox into a clear list of conversations
            that require action.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-neutral-100">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-5 font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="overflow-hidden rounded-[32px] bg-neutral-950 px-6 py-14 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Never let an important conversation disappear.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-neutral-400">
              Connect Gmail and let Mail Plus show you exactly what needs your
              attention.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-neutral-300">
              {[
                "No credit card",
                "Human-approved replies",
                "Privacy first",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-indigo-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/api/gmail/connect"
            className="mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-neutral-950 transition hover:bg-neutral-100 lg:mt-0"
          >
            Connect Gmail
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <MailPlusLogo />

          <p>© 2026 Mail Plus. Built for calmer inboxes.</p>
        </div>
      </footer>
    </main>
  );
}
