"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Summary {
  totalAlertsLast24h:   number;
  byType:               Record<string, number>;
  totalLossPreventedUsd: number;
  activePoolCount:      number;
  detectorUptime:       number;
  timestamp:            number;
}

interface Alert {
  id:               string;
  timestamp:        number;
  type:             string;
  pool:             string;
  dex:              string;
  severity:         string;
  estimatedLossUsd?: number;
  details:          string;
}

interface PoolState {
  dex:         string;
  pair:        string;
  price:       number;
  lastUpdated: number;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-400 bg-red-400/10",
  high:     "text-orange-400 bg-orange-400/10",
  medium:   "text-yellow-400 bg-yellow-400/10",
  low:      "text-slate-400 bg-slate-400/10",
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [alerts,  setAlerts]  = useState<Alert[]>([]);
  const [pools,   setPools]   = useState<PoolState[]>([]);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, a, p] = await Promise.all([
          axios.get<Summary>(`${API_URL}/api/analytics/summary`),
          axios.get<{ alerts: Alert[] }>(`${API_URL}/api/monitor/alerts?limit=20`),
          axios.get<{ pools: PoolState[] }>(`${API_URL}/api/monitor/pools`),
        ]);
        setSummary(s.data);
        setAlerts(a.data.alerts);
        setPools(p.data.pools);
      } catch {
        setError("Could not connect to the L2-MEV Shield API. Is the backend running?");
      }
    };

    void load();
    const timer = setInterval(() => void load(), 10_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white">
        🛡️ MEV Protection Dashboard
      </h1>
      <p className="mt-2 text-slate-400">Live statistics — refreshes every 10 seconds</p>

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Summary cards */}
      {summary && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Alerts (24h)"         value={summary.totalAlertsLast24h.toString()} />
          <StatCard label="Loss Prevented"       value={`$${summary.totalLossPreventedUsd.toFixed(2)}`} />
          <StatCard label="Active Pools"          value={summary.activePoolCount.toString()} />
          <StatCard label="Uptime"               value={formatUptime(summary.detectorUptime)} />
        </div>
      )}

      {/* Pools */}
      {pools.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-white">Watched Pools</h2>
          <div className="overflow-x-auto rounded-xl border border-dark-border bg-dark-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border text-left text-slate-500">
                  <th className="px-4 py-3">DEX</th>
                  <th className="px-4 py-3">Pair</th>
                  <th className="px-4 py-3">Price (USD)</th>
                  <th className="px-4 py-3">Last updated</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((p) => (
                  <tr key={`${p.dex}:${p.pair}`} className="border-b border-dark-border/40">
                    <td className="px-4 py-3 capitalize text-brand-500">{p.dex}</td>
                    <td className="px-4 py-3 font-mono text-white">{p.pair}</td>
                    <td className="px-4 py-3 text-slate-200">{p.price.toFixed(4)}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(p.lastUpdated).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Alert feed */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-white">Recent MEV Alerts</h2>
        {alerts.length === 0 ? (
          <p className="rounded-xl border border-dark-border bg-dark-card p-6 text-center text-slate-500">
            No alerts yet — all pools appear healthy 🟢
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-dark-border bg-dark-card px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase ${SEVERITY_COLORS[a.severity] ?? ""}`}
                  >
                    {a.severity}
                  </span>
                  <span className="font-semibold text-white capitalize">{a.type}</span>
                  <span className="text-xs text-slate-500">
                    {a.dex} · {a.pool}
                  </span>
                  <span className="ml-auto text-xs text-slate-600">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{a.details}</p>
                {a.estimatedLossUsd !== undefined && (
                  <p className="mt-1 text-xs text-red-400">
                    Estimated loss: ${a.estimatedLossUsd.toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-dark-border bg-dark-card p-5">
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
