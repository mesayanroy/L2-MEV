const STEPS = [
  {
    step: "01",
    title: "Install the CLI",
    code: "npm install -g l2mev",
    desc: "One command installs the l2mev CLI globally on your machine.",
  },
  {
    step: "02",
    title: "Run the setup wizard",
    code: "l2mev init",
    desc:
      "Interactive prompts configure your RPC endpoint, wallet keypair path, and default DEX. Keys never leave your machine.",
  },
  {
    step: "03",
    title: "Monitor live MEV activity",
    code: "l2mev monitor --pools raydium:SOL/USDC,jupiter:SOL/BONK",
    desc:
      "A real-time feed streams sandwich alerts, price anomalies, and frontrun attempts as they happen on-chain.",
  },
  {
    step: "04",
    title: "Execute a protected trade",
    code: "l2mev shield --dex jupiter --pair SOL/USDC --amount 100 --slippage 50",
    desc:
      "The CLI scores your trade for MEV risk, wraps it in a Jito bundle, adds on-chain slippage guards, and broadcasts it privately.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="page-wrap">
        <div className="mx-auto max-w-2xl text-center">
          <p className="badge mb-4 text-xs">Workflow</p>
          <h2 className="section-title">From zero to protected in minutes</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-400">
            From install to protected trade in under two minutes.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="glass-panel flex flex-col gap-5 rounded-xl p-6 sm:flex-row sm:items-start"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-xs font-bold text-indigo-400">
                {s.step}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-100">
                  {idx + 1}. {s.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{s.desc}</p>
                <div className="code-block mt-4 overflow-x-auto text-xs">
                  <span className="text-indigo-400">$ </span>
                  <span className="text-cyan-300">{s.code}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
