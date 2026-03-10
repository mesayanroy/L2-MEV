/**
 * MevDetector
 *
 * Watches on-chain transaction patterns to identify sandwich attacks,
 * frontrunning, and backrunning against DEX swaps.
 *
 * Detection algorithm:
 *  1. Subscribe to confirmed transactions for known DEX program IDs.
 *  2. Build a rolling window (default: 5 slots, ~2 seconds) of swap txns
 *     targeting the same liquidity pool.
 *  3. If the pattern [buy_A → victim_swap_A → sell_A] appears within the
 *     window with the same signer for buy and sell, flag as sandwich.
 *  4. Assign a MEV risk score (0-100) to incoming swap requests based on
 *     pool size, recent alert rate, and token volatility.
 */

import { Connection } from "@solana/web3.js";
import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";
import { MevAlert, AnalysisResult, DexName } from "../types";
import { logger } from "../lib/logger";

// Known program IDs for popular Solana DEXes (used for on-chain subscription filtering)
export const DEX_PROGRAMS: Record<DexName, string> = {
  jupiter:  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
  raydium:  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
  orca:     "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
  binance:  "", // CEX — no on-chain program; detected via price-feed divergence
};

// Time window for sandwich detection (milliseconds)
const DETECTION_WINDOW_MS = 3_000;

// Maximum alerts stored in memory
const MAX_ALERT_BUFFER = 500;

interface PendingSwap {
  slot: number;
  timestamp: number;
  signature: string;
  signer: string;
  pool: string;
  dex: DexName;
  direction: "buy" | "sell";
  amountIn: number;
}

interface ScoreInput {
  dex: DexName;
  pair: string;
  amountIn: number;
}

export class MevDetector extends EventEmitter {
  private static instance: MevDetector;
  private connection: Connection;
  private recentSwaps: PendingSwap[] = [];
  private alerts: MevAlert[] = [];
  private startedAt = Date.now();

  private constructor() {
    super();
    const rpc = process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
    this.connection = new Connection(rpc, "confirmed");
  }

  static getInstance(): MevDetector {
    if (!MevDetector.instance) {
      MevDetector.instance = new MevDetector();
    }
    return MevDetector.instance;
  }

  // ── Public API ─────────────────────────────────────────────

  /**
   * Score an incoming swap request for MEV risk (0 = safe, 100 = extreme risk).
   * Used by the shield route to decide whether to force Jito bundle routing.
   */
  async scoreTransaction(input: ScoreInput): Promise<number> {
    let score = 0;

    // 1. Recent alert rate for this pool
    const recentForPair = this.alerts.filter(
      (a) => a.pool === input.pair && Date.now() - a.timestamp < 60_000,
    );
    score += Math.min(recentForPair.length * 10, 50);

    // 2. Amount-based risk: large trades are more attractive sandwich targets
    const amountScore = Math.min(Math.log10(input.amountIn + 1) * 10, 30);
    score += amountScore;

    // 3. DEX-specific baseline risk (Raydium pools are historically higher MEV)
    const dexRisk: Record<DexName, number> = {
      raydium: 15,
      jupiter: 10,
      orca:    8,
      binance: 5,
    };
    score += dexRisk[input.dex] ?? 10;

    return Math.min(Math.round(score), 100);
  }

  /**
   * Analyze a confirmed transaction to determine if it was sandwiched.
   */
  async analyzeTransaction(signature: string): Promise<AnalysisResult> {
    try {
      const tx = await this.connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0,
        commitment: "finalized",
      });

      if (!tx) {
        return {
          txSignature: signature,
          wasAttacked: false,
          slippageActual: 0,
          slippageExpected: 0,
          details: "Transaction not found or not yet finalized.",
        };
      }

      // Look for the sandwich pattern in the transaction's slot neighbourhood
      const sandwichCandidate = this.alerts.find(
        (a) =>
          a.type === "sandwich" &&
          (a.victimTx === signature || a.attackerTx === signature),
      );

      if (sandwichCandidate) {
        return {
          txSignature: signature,
          wasAttacked: true,
          attackType: sandwichCandidate.type,
          estimatedLossUsd: sandwichCandidate.estimatedLossUsd,
          frontrunTx: sandwichCandidate.attackerTx,
          slippageActual: 0,
          slippageExpected: 0,
          details: sandwichCandidate.details,
        };
      }

      // Heuristic: check balance changes for unusual price impact
      const preBalances  = tx.meta?.preTokenBalances  ?? [];
      const postBalances = tx.meta?.postTokenBalances ?? [];

      const slippageActual = this.estimateSlippage(preBalances, postBalances);
      const wasAttacked = slippageActual > 2; // >2% unexpected slippage is suspicious

      return {
        txSignature: signature,
        wasAttacked,
        attackType: wasAttacked ? "sandwich" : undefined,
        slippageActual,
        slippageExpected: 0.5,
        details: wasAttacked
          ? `Unusually high slippage (${slippageActual.toFixed(2)}%) detected — possible sandwich attack.`
          : "No sandwich attack pattern detected.",
      };
    } catch (err) {
      logger.error("Error analyzing transaction", { signature, err });
      return {
        txSignature: signature,
        wasAttacked: false,
        slippageActual: 0,
        slippageExpected: 0,
        details: "Analysis failed due to RPC error.",
      };
    }
  }

  /** Record a newly detected alert (called by PoolMonitor). */
  recordAlert(alert: MevAlert): void {
    this.alerts.unshift(alert);
    if (this.alerts.length > MAX_ALERT_BUFFER) {
      this.alerts.length = MAX_ALERT_BUFFER;
    }
    this.emit("alert", alert);
  }

  /** Return seconds since the detector was instantiated. */
  uptimeSeconds(): number {
    return Math.floor((Date.now() - this.startedAt) / 1000);
  }

  // ── Private helpers ────────────────────────────────────────

  /**
   * Detect the sandwich pattern across a rolling window of swaps.
   * Pattern: [buy X] → [victim swap X] → [sell X]  — same signer for buy/sell.
   */
  detectSandwich(swaps: PendingSwap[]): MevAlert | null {
    const now = Date.now();
    const window = swaps.filter((s) => now - s.timestamp <= DETECTION_WINDOW_MS);

    for (let i = 0; i < window.length - 2; i++) {
      const front = window[i];
      const victim = window[i + 1];
      const back = window[i + 2];

      const isSandwich =
        front.pool === victim.pool &&
        victim.pool === back.pool &&
        front.direction === "buy" &&
        back.direction === "sell" &&
        front.signer === back.signer &&
        front.signer !== victim.signer;

      if (isSandwich) {
        const estimatedLossUsd = front.amountIn * 0.005; // rough 0.5% estimate

        const alert: MevAlert = {
          id: uuidv4(),
          timestamp: now,
          type: "sandwich",
          pool: front.pool,
          dex: front.dex,
          severity: estimatedLossUsd > 500 ? "critical" : estimatedLossUsd > 100 ? "high" : "medium",
          attackerTx: front.signature,
          victimTx: victim.signature,
          estimatedLossUsd,
          details: `Sandwich detected: frontrun ${front.signature.slice(0, 8)}… → victim ${victim.signature.slice(0, 8)}… → backrun ${back.signature.slice(0, 8)}…`,
        };

        this.recordAlert(alert);
        return alert;
      }
    }

    return null;
  }

  private estimateSlippage(
    pre: Array<{ uiTokenAmount?: { uiAmount?: number | null } }>,
    post: Array<{ uiTokenAmount?: { uiAmount?: number | null } }>,
  ): number {
    if (!pre.length || !post.length) return 0;
    const preAmt = pre[0]?.uiTokenAmount?.uiAmount ?? 0;
    const postAmt = post[0]?.uiTokenAmount?.uiAmount ?? 0;
    if (!preAmt) return 0;
    return Math.abs((postAmt - preAmt) / preAmt) * 100;
  }
}
