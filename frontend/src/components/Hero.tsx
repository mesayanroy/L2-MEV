"use client";

import { useState } from "react";

const INSTALL_CMD = "npm install -g l2mev";
const INIT_CMD    = "l2mev init";

export function Hero() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(`${INSTALL_CMD}\n${INIT_CMD}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="relative isolate overflow-hidden px-4 pb-24 pt-20 text-center">
      {/* Background gradient blob */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.2), transparent)",
        }}
      />

      <div className="mx-auto max-w-3xl">
        <span className="mb-4 inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-500">
          Solana MEV Protection Infrastructure
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          Stop sandwich attacks{" "}
          <span className="text-brand-500">before they happen</span>
        </h1>

        <p className="mt-6 text-lg text-slate-400">
          L2-MEV Shield detects frontrunning and backrunning on Jupiter, Raydium, Orca and more —
          routing your trades privately via Jito bundles so no bot can sandwich your transaction.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/docs"
            className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-brand-700"
          >
            Read the Docs
          </a>
          <a
            href="/dashboard"
            className="rounded-lg border border-dark-border bg-dark-card px-6 py-3 font-semibold text-slate-200 transition hover:border-brand-500"
          >
            Live Dashboard →
          </a>
        </div>

        {/* Install command box */}
        <div className="mx-auto mt-12 max-w-lg overflow-hidden rounded-xl border border-dark-border bg-dark-card text-left font-mono text-sm shadow-2xl">
          <div className="flex items-center justify-between border-b border-dark-border px-4 py-2">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500 opacity-80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500 opacity-80" />
              <span className="h-3 w-3 rounded-full bg-green-500 opacity-80" />
            </div>
            <span className="text-xs text-slate-500">Terminal</span>
            <button
              onClick={handleCopy}
              className="rounded px-2 py-0.5 text-xs text-slate-400 transition hover:bg-dark-border hover:text-white"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <div className="px-5 py-4 leading-relaxed text-slate-300">
            <p>
              <span className="text-green-400">$</span>{" "}
              <span className="text-white">{INSTALL_CMD}</span>
            </p>
            <p className="mt-2">
              <span className="text-green-400">$</span>{" "}
              <span className="text-white">{INIT_CMD}</span>
            </p>
            <p className="mt-3 text-slate-500"># then protect a trade:</p>
            <p className="mt-1">
              <span className="text-green-400">$</span>{" "}
              <span className="text-white">
                l2mev shield --dex jupiter --pair SOL/USDC --amount 10
              </span>
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-600">
          Free &amp; open source · Your keys never leave your machine
        </p>
      </div>
    </section>
  );
}
