const FEATURES = [
  {
    icon: "🔒",
    title: "Private Bundle Routing",
    desc:
      "Transactions submitted directly to Jito block-engine validators, bypassing the public mempool entirely. No bot can see or frontrun your transaction.",
  },
  {
    icon: "📡",
    title: "Real-time MEV Detection",
    desc:
      "WebSocket feed monitors top pools on Jupiter, Raydium, and Orca every few seconds. Sandwich patterns are flagged before they can hit your wallet.",
  },
  {
    icon: "⚓",
    title: "On-chain Slippage Guard",
    desc:
      "Our Anchor program atomically validates your execution price. Trades that deviate beyond your allowed slippage automatically revert — even if frontrun.",
  },
  {
    icon: "🔍",
    title: "Forensic Analyzer",
    desc:
      "Past transaction? Run `l2mev analyze --tx <sig>` to find out if you were sandwiched, who did it, and how much you lost.",
  },
  {
    icon: "📊",
    title: "Live Dashboard",
    desc:
      "See real-time pool health, MEV alert feed, and aggregate statistics on attacks blocked and USD value protected.",
  },
  {
    icon: "🛠️",
    title: "Developer API",
    desc:
      "REST + WebSocket API lets you integrate MEV protection into your own DeFi dApp or trading bot with a single HTTP call.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-bold text-white">
        Full-stack MEV protection
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
        Every layer — from your terminal to the Solana runtime — is hardened against
        sandwich attacks, frontrunning, and backrunning.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-dark-border bg-dark-card p-6 transition hover:border-brand-500/50"
          >
            <div className="mb-3 text-3xl">{f.icon}</div>
            <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
