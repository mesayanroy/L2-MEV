"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  critical: "text-red-700 bg-red-100",
  high:     "text-orange-700 bg-orange-100",
  medium:   "text-yellow-800 bg-yellow-100",
  low:      "text-gray-700 bg-gray-100",
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

  const attackBreakdown = Object.entries(summary?.byType ?? {}).map(([type, count]) => ({
    type: humanize(type),
    count,
  }));

  const lossSeries = [...alerts]
    .reverse()
    .slice(-8)
    .map((alert) => ({
      time: new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      loss: alert.estimatedLossUsd ?? 0,
    }));

  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical" || alert.severity === "high").length;

  return (
    <div className="page-wrap py-12">
      <section className="rounded border border-gray-300 bg-gray-100 px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Operations center</p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-6xl">
              Live MEV protection dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-gray-700 sm:text-lg">
              Realtime monitoring for protected volume, active pools, suspicious execution
              patterns, and threat severity across the Solana trading surface.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            <MiniStat label="Refresh cadence" value="10s" tone="brand" />
            <MiniStat label="Critical alerts" value={criticalAlerts.toString()} tone="amber" />
            <MiniStat label="Monitored pools" value={pools.length.toString()} tone="cyan" />
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded border border-red-300 bg-red-50 px-4 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {summary && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Alerts in last 24h" value={summary.totalAlertsLast24h.toString()} note="Detected anomalies and suspicious execution attempts." />
          <StatCard label="Loss prevented" value={`$${summary.totalLossPreventedUsd.toFixed(2)}`} note="Estimated trader savings preserved through protection." />
          <StatCard label="Active pools" value={summary.activePoolCount.toString()} note="Liquidity venues with active monitoring and scoring." />
          <StatCard label="Detector uptime" value={formatUptime(summary.detectorUptime)} note={`Updated ${new Date(summary.timestamp).toLocaleTimeString()}`} />
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-panel rounded p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Threat breakdown</h2>
              <p className="mt-1 text-sm text-gray-600">Most common alert categories over the active sampling window.</p>
            </div>
          </div>

          <div className="mt-6 h-[280px]">
            {attackBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attackBreakdown}>
                  <CartesianGrid stroke="rgba(107,114,128,0.2)" vertical={false} />
                  <XAxis dataKey="type" stroke="#6b7280" tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(59,130,246,0.08)" }}
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="url(#barGradient)" />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="Threat categories will appear once alerts are recorded." />
            )}
          </div>
        </section>

        <section className="glass-panel rounded p-6">
          <h2 className="text-xl font-bold text-gray-900">Potential loss pressure</h2>
          <p className="mt-1 text-sm text-gray-600">Estimated risk curve from the most recent alert stream.</p>

          <div className="mt-6 h-[280px]">
            {lossSeries.some((point) => point.loss > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lossSeries}>
                  <defs>
                    <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(107,114,128,0.2)" vertical={false} />
                  <XAxis dataKey="time" stroke="#6b7280" tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                    }}
                  />
                  <Area type="monotone" dataKey="loss" stroke="#22d3ee" fill="url(#lossGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="Loss estimates will appear when flagged alerts include projected trader impact." />
            )}
          </div>
        </section>
      </div>

      {pools.length > 0 && (
        <section className="mt-8 glass-panel rounded p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Watched pools</h2>
              <p className="mt-1 text-sm text-gray-600">Realtime pricing, venue activity, and freshness of each monitored pair.</p>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Live monitored markets</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pools.map((p) => (
              <div key={`${p.dex}:${p.pair}`} className="rounded border border-gray-300 bg-gray-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-700">{p.dex}</p>
                    <p className="mt-2 font-mono text-lg text-gray-900">{p.pair}</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    live
                  </span>
                </div>

                <p className="mt-8 text-3xl font-bold text-gray-900">${p.price.toFixed(4)}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>Last update</span>
                  <span>{new Date(p.lastUpdated).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent MEV alerts</h2>
            <p className="mt-1 text-sm text-gray-600">Latest suspicious patterns detected across monitored venues.</p>
          </div>
        </div>
        {alerts.length === 0 ? (
          <EmptyState message="No alerts yet — all monitored pools are currently healthy." />
        ) : (
          <div className="space-y-4">
            {alerts.map((a) => (
              <div key={a.id} className="glass-panel rounded px-5 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${SEVERITY_COLORS[a.severity] ?? ""}`}
                    >
                      {a.severity}
                    </span>
                    <span className="font-semibold text-gray-900 capitalize">{humanize(a.type)}</span>
                  </div>
                  <div className="sm:ml-auto sm:text-right">
                    <p className="text-sm text-gray-700">{a.dex} · {a.pool}</p>
                    <p className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-gray-700">{a.details}</p>
                {a.estimatedLossUsd !== undefined && (
                  <p className="mt-3 inline-flex rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    Estimated loss exposure: ${a.estimatedLossUsd.toFixed(2)}
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

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="glass-panel rounded p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-gray-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-3 text-sm leading-6 text-gray-700">{note}</p>
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "brand" | "amber" | "cyan" }) {
  const toneClass = {
    brand: "from-blue-100 to-blue-50",
    amber: "from-amber-100 to-amber-50",
    cyan: "from-cyan-100 to-cyan-50",
  }[tone];

  return (
    <div className={`rounded border border-gray-300 bg-gradient-to-br ${toneClass} px-4 py-4`}>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-40 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm leading-7 text-gray-600">
      {message}
    </div>
  );
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function humanize(value: string): string {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
