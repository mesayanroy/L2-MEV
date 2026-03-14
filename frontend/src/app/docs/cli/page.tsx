import type { Metadata } from "next";

export const metadata: Metadata = { title: "CLI Reference — L2-MEV Shield" };

const COMMANDS = [
  {
    cmd:     "l2mev init",
    desc:    "Interactive setup wizard. Configures RPC, keypair path, default DEX, slippage, and API key.",
    options: [],
    example: "l2mev init",
  },
  {
    cmd:     "l2mev shield",
    desc:    "Build and broadcast a MEV-protected swap transaction.",
    options: [
      { flag: "--dex <name>",    required: true,  desc: "DEX: jupiter | raydium | orca" },
      { flag: "--pair <A/B>",    required: true,  desc: "Token pair, e.g. SOL/USDC" },
      { flag: "--amount <n>",    required: true,  desc: "Input amount in token A units" },
      { flag: "--slippage <bps>",required: false, desc: "Max slippage in basis points (default: config, e.g. 50 = 0.5%)" },
      { flag: "--private",       required: false, desc: "Force Jito bundle routing" },
      { flag: "--dry-run",       required: false, desc: "Simulate only — no broadcast" },
    ],
    example: "l2mev shield --dex jupiter --pair SOL/USDC --amount 10 --slippage 50",
  },
  {
    cmd:     "l2mev monitor",
    desc:    "Real-time WebSocket feed of MEV alerts for the specified pools.",
    options: [
      { flag: "--pools <list>",    required: false, desc: "Comma-separated dex:pair identifiers" },
      { flag: "--threshold <pct>", required: false, desc: "Price-impact alert threshold %" },
      { flag: "--quiet",           required: false, desc: "JSON output only" },
      { flag: "--output <path>",   required: false, desc: "Append alerts to a JSON log file" },
    ],
    example: "l2mev monitor --pools raydium:SOL/USDC,jupiter:SOL/BONK --quiet",
  },
  {
    cmd:     "l2mev analyze",
    desc:    "Post-hoc forensic analysis of a past transaction.",
    options: [
      { flag: "--tx <signature>", required: true, desc: "Base58 transaction signature" },
    ],
    example: "l2mev analyze --tx 3Xf9…abc",
  },
  {
    cmd:     "l2mev config list",
    desc:    "Print all configuration values.",
    options: [],
    example: "l2mev config list",
  },
  {
    cmd:     "l2mev config set <key> <value>",
    desc:    "Update a single configuration value.",
    options: [],
    example: "l2mev config set rpcUrl https://my-rpc.example.com",
  },
  {
    cmd:     "l2mev status",
    desc:    "Check connectivity and health of the L2-MEV Shield API.",
    options: [],
    example: "l2mev status",
  },
];

export default function CliReferencePage() {
  return (
    <div className="page-wrap py-14">
      <h1 className="text-4xl font-bold text-gray-900">CLI Reference</h1>
      <p className="mt-4 text-gray-700">
        Install: <code className="rounded border border-gray-300 bg-gray-100 px-2 py-0.5 text-sm text-blue-700">npm install -g l2mev</code>
      </p>

      <div className="mt-12 space-y-14">
        {COMMANDS.map((c) => (
          <section key={c.cmd} className="rounded border border-gray-300 bg-gray-100 p-6">
            <h2 className="font-mono text-xl font-bold text-blue-700">{c.cmd}</h2>
            <p className="mt-2 text-gray-800">{c.desc}</p>

            {c.options.length > 0 && (
              <table className="mt-6 w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 text-left text-gray-500">
                    <th className="py-2 pr-4 font-medium">Flag</th>
                    <th className="py-2 pr-4 font-medium">Required</th>
                    <th className="py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {c.options.map((o) => (
                    <tr key={o.flag} className="border-b border-gray-200">
                      <td className="py-2 pr-4 font-mono text-blue-700">{o.flag}</td>
                      <td className="py-2 pr-4 text-gray-600">{o.required ? "Yes" : "No"}</td>
                      <td className="py-2 text-gray-800">{o.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-4 overflow-x-auto rounded border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-800">
              <span className="text-blue-700">$ </span>
              {c.example}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
