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
    <section id="how-it-works" className="page-wrap px-0 py-12 sm:py-16">
      <div className="section-shell rounded px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Workflow</p>
          <h2 className="section-title mt-4">From zero setup to protected execution.</h2>
          <p className="mx-auto mt-5 max-w-xl text-center text-gray-600">
          From install to protected trade in under two minutes.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="glass-panel flex flex-col gap-4 rounded p-6 sm:flex-row sm:items-start"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-blue-300 bg-blue-100 text-sm font-bold text-blue-700">
                {s.step}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {idx + 1}. {s.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-700">{s.desc}</p>
                <pre className="mt-4 overflow-x-auto rounded border border-gray-300 bg-gray-100 px-4 py-4 text-sm text-blue-700">
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
