import { Router, Request, Response } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { TransactionShield } from "../services/transaction-shield";
import { MevDetector } from "../services/mev-detector";

export const shieldRouter: Router = Router();

const ShieldBodySchema = z.object({
  dex: z.enum(["jupiter", "raydium", "orca", "binance"]),
  pair: z.string().regex(/^[A-Z0-9]+\/[A-Z0-9]+$/),
  amountIn: z.number().positive(),
  slippageBps: z.number().int().min(1).max(5000).default(50),
  walletPublicKey: z.string().min(32).max(44),
  privateRoute: z.boolean().optional().default(false),
  dryRun: z.boolean().optional().default(false),
});

/**
 * POST /api/shield
 * Build a MEV-protected transaction for the caller to sign and broadcast.
 */
shieldRouter.post("/", requireAuth, async (req: Request, res: Response) => {
  const parse = ShieldBodySchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Validation failed", details: parse.error.format() });
    return;
  }

  const input = parse.data;

  // Score the MEV risk BEFORE building the transaction
  const detector = MevDetector.getInstance();
  const riskScore = await detector.scoreTransaction({
    dex: input.dex,
    pair: input.pair,
    amountIn: input.amountIn,
  });

  const shield = TransactionShield.getInstance();
  const result = await shield.buildProtectedTransaction({
    ...input,
    mevRiskScore: riskScore,
  });

  if (input.dryRun) {
    res.json({ dryRun: true, riskScore, estimatedOutputAmount: result.estimatedOutputAmount, priceImpactPct: result.priceImpactPct });
    return;
  }

  res.json(result);
});

/**
 * GET /api/shield/analyze/:signature
 * Post-hoc forensic analysis — was a past tx sandwiched?
 */
shieldRouter.get("/analyze/:signature", requireAuth, async (req: Request, res: Response) => {
  const { signature } = req.params;
  if (!signature || signature.length < 64) {
    res.status(400).json({ error: "Invalid transaction signature" });
    return;
  }

  const detector = MevDetector.getInstance();
  const analysis = await detector.analyzeTransaction(signature);
  res.json(analysis);
});
