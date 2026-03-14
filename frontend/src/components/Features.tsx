const FEATURES = [
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    label: "Private Routing",
    title: "Private Bundle Routing",
    desc:
      "Transactions submitted directly to Jito block-engine validators, bypassing the public mempool entirely. No bot can see or frontrun your transaction.",
    color: "indigo",
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    label: "Live Detection",
    title: "Real-time MEV Detection",
    desc:
      "WebSocket feed monitors top pools on Jupiter, Raydium, and Orca every few seconds. Sandwich patterns are flagged before they can hit your wallet.",
    color: "cyan",
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: "Slippage Guard",
    title: "On-chain Slippage Guard",
    desc:
      "Our Anchor program atomically validates your execution price. Trades that deviate beyond your allowed slippage automatically revert — even if frontrun.",
    color: "violet",
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    label: "Forensics",
    title: "Forensic Analyzer",
    desc:
      "Past transaction? Run `l2mev analyze --tx <sig>` to find out if you were sandwiched, who did it, and how much you lost.",
    color: "amber",
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    label: "Dashboard",
    title: "Live Dashboard",
    desc:
      "See real-time pool health, MEV alert feed, and aggregate statistics on attacks blocked and USD value protected.",
    color: "emerald",
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    label: "Developer API",
    title: "Developer API",
    desc:
      "REST + WebSocket API lets you integrate MEV protection into your own DeFi dApp or trading bot with a single HTTP call.",
    color: "pink",
  },
];

const ICON_COLORS: Record<string, string> = {
  indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  cyan:   "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  amber:  "bg-amber-500/15 text-amber-400 border-amber-500/20",
  emerald:"bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  pink:   "bg-pink-500/15 text-pink-400 border-pink-500/20",
};

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="page-wrap">
        <div className="mx-auto max-w-2xl text-center">
          <p className="badge mb-4 text-xs">Capabilities</p>
          <h2 className="section-title">Full-stack defense for every trade path</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-400">
            Every layer — from your terminal to the Solana runtime — is hardened against
            sandwich attacks, frontrunning, and backrunning.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass-panel group rounded-xl p-6 transition-all duration-200"
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${ICON_COLORS[f.color]}`}
              >
                {f.icon}
              </div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {f.label}
              </p>
              <h3 className="mb-3 text-base font-semibold text-slate-100">{f.title}</h3>
              <p className="text-sm leading-7 text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
