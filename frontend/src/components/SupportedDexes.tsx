const DEXES = [
  { name: "Jupiter",  logo: "🪐", desc: "Route aggregator — best price across all Solana DEXes" },
  { name: "Raydium",  logo: "⚡", desc: "AMM + order-book hybrid with deep SOL/USDC liquidity" },
  { name: "Orca",     logo: "🐳", desc: "Concentrated liquidity (Whirlpools) with low slippage" },
  { name: "Binance",  logo: "🔶", desc: "CEX price-feed integration for cross-venue arbitrage detection" },
];

export function SupportedDexes() {
  return (
    <section id="dexes" className="page-wrap px-0 py-12 sm:py-16">
      <div className="section-shell rounded px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Coverage</p>
          <h2 className="section-title mt-4">Supported exchanges and liquidity venues.</h2>
          <p className="mx-auto mt-5 max-w-xl text-center text-gray-600">
        MEV protection wherever you trade.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEXES.map((d) => (
            <div
              key={d.name}
              className="glass-panel flex flex-col items-center rounded p-6 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded border border-gray-300 bg-blue-50 text-4xl">
                {d.logo}
              </span>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{d.name}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
