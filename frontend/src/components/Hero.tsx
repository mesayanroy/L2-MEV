"use client";

import Link from "next/link";
import { useState } from "react";

const INSTALL_CMD = "npm install -g l2mev";

const QUICK_LINKS = [
  { href: "/docs", label: "Documentation" },
  { href: "/docs/cli", label: "CLI Reference" },
  { href: "/docs/api", label: "API Reference" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Hero() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:pt-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[500px] rounded-full bg-purple-600/8 blur-[100px]" />
      </div>

      <div className="page-wrap">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
            <span className="glow-dot inline-block" />
            Solana MEV Protection — Now Open Source
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Stop MEV bots from
            <br />
            <span className="gradient-text">stealing your trades</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            L2-MEV Shield routes your Solana transactions privately through Jito bundles,
            eliminating sandwich attacks, frontrunning, and backrunning before they reach your wallet.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/docs" className="btn-primary px-6 py-3 text-sm font-semibold">
              Get Started Free →
            </Link>
            <Link href="/about" className="classic-button px-6 py-3 text-sm">
              Learn More
            </Link>
          </div>

          {/* Install command */}
          <div className="mx-auto mt-12 max-w-xl">
            <div className="flex items-center gap-3 rounded-xl border border-[rgba(99,102,241,0.2)] bg-[rgba(0,0,0,0.4)] px-5 py-4 text-left backdrop-blur-sm">
              <span className="select-none text-indigo-400">$</span>
              <code className="flex-1 font-mono text-sm text-slate-300">{INSTALL_CMD}</code>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-md border border-[rgba(99,102,241,0.3)] bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-all hover:bg-indigo-500/20"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {QUICK_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-[rgba(99,102,241,0.15)] bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-400 transition-all hover:border-indigo-500/30 hover:bg-white/[0.06] hover:text-slate-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-[rgba(99,102,241,0.15)]">
          {[
            { label: "Attacks Blocked", value: "2.4M+" },
            { label: "Value Protected", value: "$18M+" },
            { label: "Monitored Pools", value: "340+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[rgba(17,24,39,0.8)] px-6 py-6 text-center backdrop-blur-sm"
            >
              <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
