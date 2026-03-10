import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs — L2-MEV Shield",
};

const DOC_SECTIONS = [
  {
    title: "Getting Started",
    href:  "/docs",
    desc:  "Overview, architecture, and prerequisites",
  },
  {
    title: "CLI Reference",
    href:  "/docs/cli",
    desc:  "Every command, flag, and example for the l2mev CLI",
  },
  {
    title: "API Reference",
    href:  "/docs/api",
    desc:  "REST endpoints and WebSocket API for developers",
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-white">Documentation</h1>
      <p className="mt-4 text-lg text-slate-400">
        Everything you need to protect your Solana trades from MEV attacks.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {DOC_SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-dark-border bg-dark-card p-6 transition hover:border-brand-500/60"
          >
            <h2 className="font-semibold text-white">{s.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{s.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-16 prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white">What is MEV?</h2>
        <p className="mt-4 text-slate-300">
          <strong>Maximal Extractable Value (MEV)</strong> refers to the maximum value that can be
          extracted from block production beyond the standard block reward and gas fees by including,
          excluding, or reordering transactions.
        </p>

        <h3 className="mt-8 text-xl font-semibold text-white">Sandwich attacks explained</h3>
        <p className="mt-3 text-slate-300">
          When you submit a swap to a DEX, it briefly lives in the mempool (the queue of pending
          transactions) before being included in a block. A sandwich bot:
        </p>
        <ol className="mt-3 space-y-1 text-slate-300 list-decimal pl-6">
          <li>Sees your pending swap in the mempool</li>
          <li>Submits a buy of the same token <em>before</em> you with a higher fee (frontrun)</li>
          <li>Your trade executes at a worse price because the bot raised it</li>
          <li>The bot immediately sells (backrun), pocketing the spread</li>
        </ol>

        <h3 className="mt-8 text-xl font-semibold text-white">How L2-MEV Shield stops it</h3>
        <ul className="mt-3 space-y-2 text-slate-300 list-disc pl-6">
          <li>
            <strong>Private routing via Jito bundles</strong> — your transaction never enters the
            public mempool. Only the winning validator sees it.
          </li>
          <li>
            <strong>On-chain slippage guard</strong> — even if a bot frontrans, the on-chain program
            reverts your transaction if the actual execution price deviates beyond your tolerance.
          </li>
          <li>
            <strong>Real-time pool monitoring</strong> — anomalous price movements are detected
            before they affect your trade.
          </li>
        </ul>
      </section>
    </div>
  );
}
