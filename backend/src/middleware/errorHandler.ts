import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  logger.error(err.message, { stack: err.stack });

  if (err.message.startsWith("CORS:")) {
    res.status(403).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
}
