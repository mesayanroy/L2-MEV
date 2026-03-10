import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { createApiClient } from "../lib/api";
import { getConfig } from "../lib/config";

export function registerStatus(program: Command): void {
  program
    .command("status")
    .description("Check connectivity to the L2-MEV Shield API")
    .action(async () => {
      const cfg = getConfig();
      const spinner = ora(`Connecting to ${cfg.apiUrl}…`).start();

      try {
        const api = createApiClient();
        const res = await api.get<{ status: string; timestamp: number }>("/health");

        spinner.succeed(chalk.green("API is online ✓"));
        console.log(chalk.dim(`  Endpoint  : ${cfg.apiUrl}`));
        console.log(chalk.dim(`  Server UTC: ${new Date(res.data.timestamp).toUTCString()}`));

        // Also fetch summary if available
        try {
          const summary = await api.get<{
            totalAlertsLast24h: number;
            totalLossPreventedUsd: number;
            activePoolCount: number;
          }>("/api/analytics/summary");

          const s = summary.data;
          console.log(chalk.cyan(`\n  Active pools     : ${s.activePoolCount}`));
          console.log(chalk.cyan(`  Alerts (24h)     : ${s.totalAlertsLast24h}`));
          console.log(chalk.cyan(`  Loss prevented   : $${s.totalLossPreventedUsd.toFixed(2)}`));
        } catch {
          // summary endpoint optional
        }

        console.log();
      } catch (err) {
        spinner.fail(chalk.red("API unreachable"));
        console.error(chalk.gray(`  ${(err as Error).message}`));
        console.log(chalk.yellow("\n  Is the backend running? Try: npm run dev:backend\n"));
        process.exit(1);
      }
    });
}
