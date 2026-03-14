const DEXES = [
  { name: "Jupiter",  abbr: "JUP", desc: "Route aggregator — best price across all Solana DEXes", color: "indigo" },
  { name: "Raydium",  abbr: "RAY", desc: "AMM + order-book hybrid with deep SOL/USDC liquidity", color: "cyan" },
  { name: "Orca",     abbr: "ORC", desc: "Concentrated liquidity (Whirlpools) with low slippage", color: "violet" },
  { name: "Binance",  abbr: "BNB", desc: "CEX price-feed integration for cross-venue arbitrage detection", color: "amber" },
];

const DEX_COLORS: Record<string, string> = {
  indigo: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  cyan:   "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-400",
  amber:  "border-amber-500/20 bg-amber-500/10 text-amber-400",
};

export function SupportedDexes() {
  return (
    <section id="dexes" className="py-24">
      <div className="page-wrap">
        <div className="mx-auto max-w-2xl text-center">
          <p className="badge mb-4 text-xs">Coverage</p>
          <h2 className="section-title">Supported exchanges & liquidity venues</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-400">
            MEV protection wherever you trade on Solana.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEXES.map((d) => (
            <div
              key={d.name}
              className="glass-panel flex flex-col items-center rounded-xl p-6 text-center transition-all duration-200"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl border text-sm font-bold ${DEX_COLORS[d.color]}`}
              >
                {d.abbr}
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-100">{d.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
