import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import helmet from "helmet";

import { corsMiddleware } from "./middleware/cors";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { shieldRouter } from "./routes/shield";
import { monitorRouter } from "./routes/monitor";
import { analyticsRouter } from "./routes/analytics";
import { healthRouter } from "./routes/health";
import { PoolMonitor } from "./services/pool-monitor";
import { logger } from "./lib/logger";

const PORT = Number(process.env.PORT ?? 4000);

async function bootstrap() {
  const app = express();

  // ── Global middleware ──────────────────────────────────────
  app.use(helmet());
  app.use(corsMiddleware);
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimiter);

  // ── Routes ─────────────────────────────────────────────────
  app.use("/health", healthRouter);
  app.use("/api/shield", shieldRouter);
  app.use("/api/monitor", monitorRouter);
  app.use("/api/analytics", analyticsRouter);

  // ── Error handler (must be last) ──────────────────────────
  app.use(errorHandler);

  // ── HTTP + WebSocket server ────────────────────────────────
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/monitor" });

  const poolMonitor = PoolMonitor.getInstance();

  wss.on("connection", (ws) => {
    logger.info("WS client connected");

    const unsubscribe = poolMonitor.subscribe((alert) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(alert));
      }
    });

    ws.on("close", () => {
      logger.info("WS client disconnected");
      unsubscribe();
    });

    ws.on("error", (err) => {
      logger.error("WS error", { err });
    });
  });

  httpServer.listen(PORT, () => {
    logger.info(`L2-MEV Shield backend listening on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    logger.info("Shutting down…");
    await poolMonitor.stop();
    httpServer.close(() => process.exit(0));
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

bootstrap().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
