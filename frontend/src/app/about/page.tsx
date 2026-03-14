import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — L2-MEV Shield",
  description:
    "Learn about L2-MEV Shield — the open-source Solana MEV protection infrastructure.",
};

const TEAM_VALUES = [
  {
    title: "Open Source First",
    desc: "Every line of code is public. We believe security infrastructure should be auditable, forkable, and community-owned.",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: "indigo",
  },
  {
    title: "User-First Privacy",
    desc: "Your private keys and transaction details never leave your machine. We route privately, not through us.",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: "cyan",
  },
  {
    title: "Radical Transparency",
    desc: "We publish our MEV detection methodology, threat models, and effectiveness statistics publicly for community review.",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    color: "violet",
  },
];

const TECH_STACK = [
  { name: "Solana", desc: "High-performance blockchain for sub-second finality" },
  { name: "Jito Bundles", desc: "Private transaction routing bypassing the public mempool" },
  { name: "Anchor", desc: "Rust framework for on-chain slippage guard programs" },
  { name: "Jupiter / Raydium / Orca", desc: "Leading Solana DEX integrations" },
  { name: "WebSocket API", desc: "Real-time MEV detection and alert streaming" },
  { name: "Next.js + TypeScript", desc: "Type-safe, server-rendered frontend dashboard" },
];

const ICON_COLORS: Record<string, string> = {
  indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  cyan:   "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/20",
};

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="px-4 pb-16 pt-20">
        <div className="page-wrap mx-auto max-w-3xl text-center">
          <div className="badge mb-6 inline-flex text-xs">About L2-MEV Shield</div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Built by traders,
            <br />
            <span className="gradient-text">for traders</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400">
            L2-MEV Shield is open-source Solana MEV protection infrastructure. We combine
            private transaction routing, real-time threat detection, and on-chain slippage
            guards to ensure your trades settle at the price you expect — every time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/docs" className="btn-primary px-6 py-3 text-sm">
              Read the Docs →
            </Link>
            <a
              href="https://github.com/mesayanroy/L2-MEV"
              target="_blank"
              rel="noreferrer"
              className="classic-button px-6 py-3 text-sm"
            >
              View on GitHub ↗
            </a>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="page-wrap">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="badge mb-4 inline-flex text-xs">Our Mission</p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Fair execution for every Solana user
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-400">
                MEV (Maximal Extractable Value) bots steal millions of dollars from everyday
                DeFi traders through sandwich attacks, frontrunning, and backrunning. These
                predatory practices disproportionately hurt retail traders who lack
                institutional-grade tooling.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-400">
                L2-MEV Shield exists to level the playing field. We provide free, open-source
                MEV protection tools that anyone can use — from individual traders to DeFi
                protocols building on Solana.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "2.4M+", label: "Attacks Blocked" },
                { value: "$18M+", label: "Value Protected" },
                { value: "340+", label: "Monitored Pools" },
                { value: "99.9%", label: "Detection Uptime" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-panel rounded-xl p-6 text-center"
                >
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="page-wrap">
          <div className="mx-auto max-w-2xl text-center">
            <p className="badge mb-4 inline-flex text-xs">Our Values</p>
            <h2 className="section-title">What we stand for</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TEAM_VALUES.map((v) => (
              <div key={v.title} className="glass-panel rounded-xl p-6">
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${ICON_COLORS[v.color]}`}
                >
                  {v.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-100">{v.title}</h3>
                <p className="text-sm leading-7 text-slate-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="page-wrap">
          <div className="mx-auto max-w-2xl text-center">
            <p className="badge mb-4 inline-flex text-xs">Technology</p>
            <h2 className="section-title">Built on proven infrastructure</h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-400">
              We use battle-tested protocols and open standards at every layer of the stack.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="glass-panel flex items-start gap-4 rounded-xl p-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                  <svg aria-hidden="true" className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{tech.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="page-wrap">
          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-10 text-center">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-[200px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[80px]" />
            </div>
            <h2 className="relative text-2xl font-bold text-white sm:text-3xl">
              Ready to protect your trades?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-base text-slate-400">
              Get started in minutes with our CLI or integrate via the REST API.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/docs" className="btn-primary px-6 py-3 text-sm font-semibold">
                Get Started →
              </Link>
              <Link href="/dashboard" className="classic-button px-6 py-3 text-sm">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
