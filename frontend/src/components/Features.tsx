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
    <section id="features" className="page-wrap px-0 py-12 sm:py-16">
      <div className="section-shell rounded px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Capabilities</p>
          <h2 className="section-title mt-4">Full-stack defense for every trade path.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-gray-600">
        Every layer — from your terminal to the Solana runtime — is hardened against
        sandwich attacks, frontrunning, and backrunning.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass-panel rounded p-6 transition hover:-translate-y-0.5"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded border border-gray-300 bg-blue-50 text-2xl">
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm leading-7 text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
