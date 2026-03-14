import { Router, Request, Response } from "express";
import { PoolMonitor } from "../services/pool-monitor";
import { MevDetector } from "../services/mev-detector";

export const analyticsRouter: Router = Router();

/**
 * GET /api/analytics/summary
 * Aggregate stats: total attacks blocked, volume protected, etc.
 */
analyticsRouter.get("/summary", async (_req: Request, res: Response) => {
  const monitor = PoolMonitor.getInstance();
  const detector = MevDetector.getInstance();

  const alerts = monitor.getRecentAlerts(1000);
  const byType = alerts.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1;
    return acc;
  }, {});

  const totalLossPreventedUsd = alerts.reduce(
    (sum, a) => sum + (a.estimatedLossUsd ?? 0),
    0,
  );

  res.json({
    totalAlertsLast24h: alerts.length,
    byType,
    totalLossPreventedUsd,
    activePoolCount: monitor.getPoolStates().length,
    detectorUptime: detector.uptimeSeconds(),
    timestamp: Date.now(),
  });
});
