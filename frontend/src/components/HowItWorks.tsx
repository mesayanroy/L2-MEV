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
    <section id="how-it-works" className="bg-dark-card py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
          From install to protected trade in under two minutes.
        </p>

        <div className="mt-14 space-y-8">
          {STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="flex flex-col gap-4 rounded-xl border border-dark-border bg-dark-bg p-6 sm:flex-row sm:items-start"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                {s.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {idx + 1}. {s.title}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{s.desc}</p>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-dark-card px-4 py-3 text-sm text-green-400">
                  <code>$ {s.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
