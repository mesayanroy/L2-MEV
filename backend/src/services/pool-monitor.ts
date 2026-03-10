/**
 * PoolMonitor
 *
 * Periodically polls DEX pools and emits MEV alerts when suspicious
 * transaction patterns are detected (sandwich, large price impacts, etc.).
 *
 * In production this would also subscribe to a Jito gRPC geyser stream for
 * sub-second latency, but the polling approach works for all RPC providers.
 */

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { MevAlert, PoolState, DexName } from "../types";
import { MevDetector } from "./mev-detector";
import { logger } from "../lib/logger";

// Default pools to watch (can be extended via config)
const DEFAULT_POOLS: Array<{ dex: DexName; pair: string }> = [
  { dex: "raydium", pair: "SOL/USDC" },
  { dex: "raydium", pair: "SOL/BONK" },
  { dex: "jupiter", pair: "SOL/USDC" },
  { dex: "jupiter", pair: "JUP/SOL" },
  { dex: "orca",    pair: "SOL/USDC" },
];

// Price APIs (public, no key required for basic polling)
const PRICE_API = "https://price.jup.ag/v4/price";

type AlertSubscriber = (alert: MevAlert) => void;

export class PoolMonitor {
  private static instance: PoolMonitor;

  private poolStates: Map<string, PoolState> = new Map();
  private recentAlerts: MevAlert[] = [];
  private subscribers: Set<AlertSubscriber> = new Set();
  private pollInterval: NodeJS.Timeout | null = null;
  private readonly pollMs = 5_000;

  private constructor() {}

  static getInstance(): PoolMonitor {
    if (!PoolMonitor.instance) {
      PoolMonitor.instance = new PoolMonitor();
    }
    return PoolMonitor.instance;
  }

  // ── Lifecycle ──────────────────────────────────────────────

  start(): void {
    if (this.pollInterval) return;
    logger.info("PoolMonitor started");
    void this.poll(); // initial poll
    this.pollInterval = setInterval(() => void this.poll(), this.pollMs);
  }

  async stop(): Promise<void> {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    logger.info("PoolMonitor stopped");
  }

  // ── Subscriptions ──────────────────────────────────────────

  subscribe(cb: AlertSubscriber): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  // ── Public data accessors ──────────────────────────────────

  getPoolStates(): PoolState[] {
    return Array.from(this.poolStates.values());
  }

  getRecentAlerts(limit = 20): MevAlert[] {
    return this.recentAlerts.slice(0, limit);
  }

  // ── Polling logic ──────────────────────────────────────────

  private async poll(): Promise<void> {
    for (const poolDef of DEFAULT_POOLS) {
      try {
        const state = await this.fetchPoolState(poolDef.dex, poolDef.pair);
        const key = `${poolDef.dex}:${poolDef.pair}`;
        const prev = this.poolStates.get(key);
        this.poolStates.set(key, state);

        if (prev) {
          this.checkForAnomalies(prev, state);
        }
      } catch (err) {
        logger.warn("Failed to fetch pool state", { pool: poolDef, err });
      }
    }
  }

  private async fetchPoolState(dex: DexName, pair: string): Promise<PoolState> {
    const [tokenA, tokenB] = pair.split("/");

    // Use Jupiter price API as a universal price oracle
    const res = await axios.get(PRICE_API, {
      params: { ids: `${tokenA},${tokenB}` },
      timeout: 5_000,
    });

    const prices = res.data?.data ?? {};
    const priceA = prices[tokenA]?.price ?? 0;
    const priceB = prices[tokenB]?.price ?? 1;
    const price = priceA / priceB;

    return {
      dex,
      pair,
      price,
      liquidity:       0,  // Would require DEX-specific API
      volume24h:       0,
      priceImpact1pct: 0,
      lastUpdated:     Date.now(),
    };
  }

  // ── Anomaly detection ──────────────────────────────────────

  private checkForAnomalies(prev: PoolState, current: PoolState): void {
    if (!prev.price || !current.price) return;

    const priceDeltaPct = Math.abs((current.price - prev.price) / prev.price) * 100;

    // A sudden price move > 1% within the polling window is suspicious
    if (priceDeltaPct > 1.0) {
      const alert: MevAlert = {
        id:        uuidv4(),
        timestamp: Date.now(),
        type:      "suspicious",
        pool:      current.pair,
        dex:       current.dex,
        severity:  priceDeltaPct > 5 ? "high" : "medium",
        details:   `Price moved ${priceDeltaPct.toFixed(2)}% on ${current.dex} ${current.pair} within ${this.pollMs / 1000}s — possible large trade or sandwich activity.`,
      };

      this.emitAlert(alert);
    }
  }

  private emitAlert(alert: MevAlert): void {
    this.recentAlerts.unshift(alert);
    if (this.recentAlerts.length > 500) this.recentAlerts.length = 500;

    // Also register with the detector for scoring purposes
    MevDetector.getInstance().recordAlert(alert);

    this.subscribers.forEach((cb) => {
      try {
        cb(alert);
      } catch (err) {
        logger.error("Alert subscriber threw", { err });
      }
    });

    logger.info("MEV alert emitted", { type: alert.type, dex: alert.dex, pool: alert.pool });
  }
}
