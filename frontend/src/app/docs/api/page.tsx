import type { Metadata } from "next";

export const metadata: Metadata = { title: "API Reference — L2-MEV Shield" };

const ENDPOINTS = [
  {
    method: "GET",
    path:   "/health",
    auth:   false,
    desc:   "Health check. Returns server status and timestamp.",
    response: `{ "status": "ok", "timestamp": 1712000000000 }`,
  },
  {
    method: "POST",
    path:   "/api/shield",
    auth:   true,
    desc:   "Build a MEV-protected swap transaction for the caller to sign and broadcast.",
    body: `{
  "dex":             "jupiter",
  "pair":            "SOL/USDC",
  "amountIn":        10,
  "slippageBps":     50,
  "walletPublicKey": "<base58-pubkey>",
  "privateRoute":    false,
  "dryRun":          false
}`,
    response: `{
  "bundleId":             "bundle_1712000000000",
  "serializedTransaction": "<base64-unsigned-tx>",
  "estimatedOutputAmount": 142.56,
  "priceImpactPct":        0.012,
  "mevRiskScore":          23,
  "protectionMethod":      "jito-bundle"
}`,
  },
  {
    method: "GET",
    path:   "/api/shield/analyze/:signature",
    auth:   true,
    desc:   "Forensic analysis of a past transaction. Detects if it was sandwiched.",
    response: `{
  "txSignature":       "3Xf9…",
  "wasAttacked":       true,
  "attackType":        "sandwich",
  "estimatedLossUsd":  12.40,
  "frontrunTx":        "4Yg0…",
  "slippageActual":    3.2,
  "slippageExpected":  0.5,
  "details":           "Sandwich detected: frontrun 4Yg0… → victim 3Xf9…"
}`,
  },
  {
    method: "GET",
    path:   "/api/monitor/pools",
    auth:   false,
    desc:   "Returns the latest state snapshot for all watched pools.",
    response: `{
  "pools": [
    { "dex": "raydium", "pair": "SOL/USDC", "price": 142.8, "lastUpdated": 1712000000000 }
  ],
  "timestamp": 1712000000000
}`,
  },
  {
    method: "GET",
    path:   "/api/monitor/alerts?limit=20",
    auth:   false,
    desc:   "Returns the most recent MEV alerts (max 100).",
    response: `{
  "alerts": [
    {
      "id": "uuid",
      "type": "suspicious",
      "severity": "medium",
      "dex": "raydium",
      "pool": "SOL/USDC",
      "details": "Price moved 1.4% within 5s"
    }
  ]
}`,
  },
  {
    method: "GET",
    path:   "/api/analytics/summary",
    auth:   false,
    desc:   "Aggregate statistics: attacks blocked, volume protected, active pools.",
    response: `{
  "totalAlertsLast24h": 47,
  "byType": { "sandwich": 12, "suspicious": 35 },
  "totalLossPreventedUsd": 3210.50,
  "activePoolCount": 5,
  "detectorUptime": 86400
}`,
  },
];

const methodColor: Record<string, string> = {
  GET:  "bg-green-500/20 text-green-400",
  POST: "bg-blue-500/20 text-blue-400",
};

export default function ApiReferencePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-white">API Reference</h1>
      <p className="mt-4 text-slate-400">
        Base URL: <code className="rounded bg-dark-card px-2 py-0.5 text-sm text-green-400">https://api.l2mev.io</code>
        <br />
        Authentication: <code className="rounded bg-dark-card px-2 py-0.5 text-sm text-white">Authorization: Bearer &lt;token&gt;</code>
      </p>

      <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
        <strong>Note:</strong> Protected endpoints require a JWT. Obtain one via{" "}
        <code className="text-yellow-200">l2mev init</code> or the upcoming auth API.
      </div>

      <div className="mt-12 space-y-12">
        {ENDPOINTS.map((e) => (
          <section key={`${e.method}-${e.path}`} className="border-b border-dark-border pb-12">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${methodColor[e.method] ?? ""}`}
              >
                {e.method}
              </span>
              <code className="font-mono text-lg text-white">{e.path}</code>
              {e.auth && (
                <span className="rounded bg-brand-500/20 px-2 py-0.5 text-xs text-brand-500">
                  🔒 Auth required
                </span>
              )}
            </div>
            <p className="mt-2 text-slate-400">{e.desc}</p>

            {e.body && (
              <>
                <p className="mt-4 text-sm font-semibold text-slate-300">Request body</p>
                <pre className="mt-1 overflow-x-auto rounded-lg bg-dark-card px-4 py-3 text-xs text-slate-300">
                  {e.body}
                </pre>
              </>
            )}

            <p className="mt-4 text-sm font-semibold text-slate-300">Response</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-dark-card px-4 py-3 text-xs text-slate-300">
              {e.response}
            </pre>
          </section>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">WebSocket — Real-time alerts</h2>
        <p className="mt-3 text-slate-400">
          Connect to <code className="rounded bg-dark-card px-2 py-0.5 text-sm text-green-400">wss://api.l2mev.io/ws/monitor</code>.
          You will receive a JSON message for every MEV alert detected, in the same format as{" "}
          <code className="text-white">/api/monitor/alerts</code>.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-dark-card px-4 py-3 text-xs text-slate-300">
{`const ws = new WebSocket("wss://api.l2mev.io/ws/monitor");
ws.onmessage = (event) => {
  const alert = JSON.parse(event.data);
  console.log("MEV alert:", alert);
};`}
        </pre>
      </section>
    </div>
  );
}
