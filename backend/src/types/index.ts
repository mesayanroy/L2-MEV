// ── Shared domain types ───────────────────────────────────────

export type DexName = "jupiter" | "raydium" | "orca" | "binance";

export interface ShieldRequest {
  dex: DexName;
  pair: string;           // e.g. "SOL/USDC"
  amountIn: number;       // in units of input token
  slippageBps: number;    // basis points, e.g. 50 = 0.5 %
  walletPublicKey: string;
  privateRoute?: boolean; // force Jito bundle even on low-risk txns
}

export interface ShieldResponse {
  bundleId: string;
  serializedTransaction: string; // base64 — client signs and re-submits
  estimatedOutputAmount: number;
  priceImpactPct: number;
  mevRiskScore: number;           // 0-100
  protectionMethod: "jito-bundle" | "direct";
}

export interface MevAlert {
  id: string;
  timestamp: number;
  type: "sandwich" | "frontrun" | "backrun" | "suspicious";
  pool: string;
  dex: DexName;
  severity: "low" | "medium" | "high" | "critical";
  attackerTx?: string;
  victimTx?: string;
  estimatedLossUsd?: number;
  details: string;
}

export interface PoolState {
  dex: DexName;
  pair: string;
  price: number;
  liquidity: number;
  volume24h: number;
  priceImpact1pct: number; // price impact for a 1% of pool size trade
  lastUpdated: number;
}

export interface AnalysisResult {
  txSignature: string;
  wasAttacked: boolean;
  attackType?: MevAlert["type"];
  estimatedLossUsd?: number;
  frontrunTx?: string;
  backrunTx?: string;
  slippageActual: number;
  slippageExpected: number;
  details: string;
}
