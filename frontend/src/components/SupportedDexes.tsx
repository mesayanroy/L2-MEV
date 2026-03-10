const DEXES = [
  { name: "Jupiter",  logo: "🪐", desc: "Route aggregator — best price across all Solana DEXes" },
  { name: "Raydium",  logo: "⚡", desc: "AMM + order-book hybrid with deep SOL/USDC liquidity" },
  { name: "Orca",     logo: "🐳", desc: "Concentrated liquidity (Whirlpools) with low slippage" },
  { name: "Binance",  logo: "🔶", desc: "CEX price-feed integration for cross-venue arbitrage detection" },
];

export function SupportedDexes() {
  return (
    <section id="dexes" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-bold text-white">Supported exchanges</h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
        MEV protection wherever you trade.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEXES.map((d) => (
          <div
            key={d.name}
            className="flex flex-col items-center rounded-xl border border-dark-border bg-dark-card p-6 text-center transition hover:border-brand-500/50"
          >
            <span className="text-4xl">{d.logo}</span>
            <h3 className="mt-3 font-bold text-white">{d.name}</h3>
            <p className="mt-1 text-xs text-slate-400">{d.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
