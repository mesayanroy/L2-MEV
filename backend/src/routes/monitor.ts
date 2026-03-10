import { Router, Request, Response } from "express";
import { PoolMonitor } from "../services/pool-monitor";

export const monitorRouter = Router();

/**
 * GET /api/monitor/pools
 * Returns the latest state snapshot for all watched pools.
 */
monitorRouter.get("/pools", async (_req: Request, res: Response) => {
  const monitor = PoolMonitor.getInstance();
  const pools = monitor.getPoolStates();
  res.json({ pools, timestamp: Date.now() });
});

/**
 * GET /api/monitor/alerts?limit=20
 * Returns the most recent MEV alerts.
 */
monitorRouter.get("/alerts", async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  const monitor = PoolMonitor.getInstance();
  const alerts = monitor.getRecentAlerts(limit);
  res.json({ alerts, total: alerts.length });
});
