import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs — L2-MEV Shield",
  description: "Everything you need to protect your Solana trades from MEV attacks.",
};

const DOC_SECTIONS = [
  {
    title: "Getting Started",
    href:  "/docs",
    desc:  "Overview, architecture, and prerequisites",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "indigo",
  },
  {
    title: "CLI Reference",
    href:  "/docs/cli",
    desc:  "Every command, flag, and example for the l2mev CLI",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "cyan",
  },
  {
    title: "API Reference",
    href:  "/docs/api",
    desc:  "REST endpoints and WebSocket API for developers",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: "violet",
  },
];

const ICON_COLORS: Record<string, string> = {
  indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  cyan:   "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/20",
};

export default function DocsPage() {
  return (
    <div className="relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="page-wrap py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="badge mb-4 inline-flex text-xs">Documentation</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            L2-MEV Shield Docs
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-slate-400">
            Everything you need to protect your Solana trades from MEV attacks.
          </p>
        </div>

        {/* Doc sections */}
        <div className="grid gap-5 sm:grid-cols-3">
          {DOC_SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="glass-panel group rounded-xl p-6 transition-all duration-200"
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${ICON_COLORS[s.color]}`}
              >
                {s.icon}
              </div>
              <h2 className="text-base font-semibold text-slate-100 transition-colors group-hover:text-white">
                {s.title}
              </h2>
              <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
              <p className="mt-4 text-xs font-medium text-indigo-400 transition-colors group-hover:text-indigo-300">
                Read more →
              </p>
            </Link>
          ))}
        </div>

        {/* What is MEV */}
        <section className="mt-16 rounded-xl border border-[rgba(99,102,241,0.15)] bg-[rgba(17,24,39,0.6)] p-8">
          <h2 className="text-2xl font-bold text-white">What is MEV?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            <strong className="text-slate-200">Maximal Extractable Value (MEV)</strong> refers to
            the maximum value that can be extracted from block production beyond the standard block
            reward and gas fees by including, excluding, or reordering transactions.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-white">Sandwich attacks explained</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            When you submit a swap to a DEX, it briefly lives in the mempool (the queue of pending
            transactions) before being included in a block. A sandwich bot:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-400">
            <li>Sees your pending swap in the mempool</li>
            <li>Submits a buy of the same token <em>before</em> you with a higher fee (frontrun)</li>
            <li>Your trade executes at a worse price because the bot raised it</li>
            <li>The bot immediately sells (backrun), pocketing the spread</li>
          </ol>

          <h3 className="mt-8 text-lg font-semibold text-white">How L2-MEV Shield stops it</h3>
          <ul className="mt-3 list-disc space-y-3 pl-6 text-sm leading-7 text-slate-400">
            <li>
              <strong className="text-slate-200">Private routing via Jito bundles</strong> — your
              transaction never enters the public mempool. Only the winning validator sees it.
            </li>
            <li>
              <strong className="text-slate-200">On-chain slippage guard</strong> — even if a bot
              frontruns, the on-chain program reverts your transaction if the actual execution price
              deviates beyond your tolerance.
            </li>
            <li>
              <strong className="text-slate-200">Real-time pool monitoring</strong> — anomalous
              price movements are detected before they affect your trade.
            </li>
          </ul>
        </section>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/dashboard" className="btn-primary px-5 py-2.5 text-sm">
            Open Dashboard →
          </Link>
          <Link href="/about" className="classic-button px-5 py-2.5 text-sm">
            About the Project
          </Link>
        </div>
      </div>
    </div>
  );
}
