import { Command } from "commander";
import chalk from "chalk";
import { createApiClient } from "../lib/api";
import { getConfig } from "../lib/config";
import WebSocket from "ws";

export function registerMonitor(program: Command): void {
  program
    .command("monitor")
    .description("Watch DEX pools in real-time for MEV activity")
    .option("--pools <list>",    "Comma-separated dex:pair identifiers, e.g. raydium:SOL/USDC")
    .option("--threshold <pct>", "Alert when price impact exceeds this %", parseFloat, 1.0)
    .option("--quiet",           "Output structured JSON only (no colors or decorations)")
    .option("--output <path>",   "Append alerts to a JSON log file")
    .action(async (opts) => {
      const cfg   = getConfig();
      const quiet = Boolean(opts.quiet);

      if (!quiet) {
        console.log(chalk.bold.cyan("\n🛡️  L2-MEV Shield — Live Pool Monitor\n"));
        console.log(chalk.gray("Connecting to real-time alert feed… (Ctrl+C to stop)\n"));
      }

      const api = createApiClient();

      // Fetch initial pool snapshot
      try {
        const snap = await api.get<{ pools: unknown[] }>("/api/monitor/pools");
        if (!quiet) {
          console.log(chalk.dim(`Watching ${snap.data.pools.length} pools\n`));
        }
      } catch {
        if (!quiet) console.log(chalk.yellow("Could not fetch initial pool snapshot.\n"));
      }

      // Connect to WebSocket for real-time alerts
      const wsUrl = cfg.apiUrl.replace(/^http/, "ws") + "/ws/monitor";

      let fs: typeof import("fs") | null = null;
      if (opts.output) {
        fs = await import("fs");
      }

      const ws = new WebSocket(wsUrl, {
        headers: cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {},
      });

      ws.on("open", () => {
        if (!quiet) console.log(chalk.green("✓ Connected to alert feed\n"));
      });

      ws.on("message", (raw) => {
        try {
          const alert = JSON.parse(raw.toString()) as {
            type: string;
            severity: string;
            dex: string;
            pool: string;
            details: string;
            timestamp: number;
            estimatedLossUsd?: number;
          };

          const line = quiet
            ? JSON.stringify(alert)
            : formatAlert(alert, opts.threshold as number);

          if (line) console.log(line);

          if (fs && opts.output) {
            fs.appendFileSync(opts.output as string, JSON.stringify(alert) + "\n");
          }
        } catch {
          // ignore malformed messages
        }
      });

      ws.on("error", (err) => {
        if (!quiet) console.error(chalk.red("\nWebSocket error:"), err.message);
      });

      ws.on("close", () => {
        if (!quiet) console.log(chalk.yellow("\nDisconnected from alert feed."));
      });

      process.on("SIGINT", () => {
        ws.close();
        process.exit(0);
      });
    });
}

function formatAlert(
  alert: { type: string; severity: string; dex: string; pool: string; details: string; timestamp: number; estimatedLossUsd?: number },
  threshold: number,
): string | null {
  const severityColor: Record<string, (s: string) => string> = {
    critical: chalk.red.bold,
    high:     chalk.red,
    medium:   chalk.yellow,
    low:      chalk.gray,
  };

  const color = severityColor[alert.severity] ?? chalk.white;
  const time  = new Date(alert.timestamp).toLocaleTimeString();
  const loss  = alert.estimatedLossUsd ? ` (~$${alert.estimatedLossUsd.toFixed(2)} lost)` : "";

  return (
    `${chalk.dim(time)} ${color(`[${alert.severity.toUpperCase()}]`)} ` +
    `${chalk.cyan(alert.dex)}:${chalk.white(alert.pool)} ` +
    `${chalk.bold(alert.type)}${loss}\n` +
    `  ${chalk.dim(alert.details)}`
  );

  void threshold; // threshold filtering could be added here
}
