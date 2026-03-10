import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { Keypair } from "@solana/web3.js";
import { createApiClient } from "../lib/api";
import { getConfig } from "../lib/config";

export function registerShield(program: Command): void {
  program
    .command("shield")
    .description("Execute a MEV-protected swap")
    .requiredOption("--dex <name>",       "DEX to use: jupiter | raydium | orca")
    .requiredOption("--pair <A/B>",       "Token pair, e.g. SOL/USDC")
    .requiredOption("--amount <n>",       "Input amount (in units of token A)", parseFloat)
    .option("--slippage <bps>",           "Max slippage in basis points (default: config)", parseInt)
    .option("--private",                  "Force Jito bundle routing regardless of risk score")
    .option("--dry-run",                  "Simulate only — do not broadcast")
    .action(async (opts) => {
      const cfg = getConfig();

      const dex      = opts.dex   as string;
      const pair     = opts.pair  as string;
      const amount   = opts.amount as number;
      const slippage = (opts.slippage as number | undefined) ?? cfg.defaultSlippage;
      const dryRun   = Boolean(opts.dryRun);
      const forcePrivate = Boolean(opts.private);

      if (!["jupiter", "raydium", "orca"].includes(dex)) {
        console.error(chalk.red(`Unknown DEX: ${dex}. Choose jupiter, raydium, or orca.`));
        process.exit(1);
      }

      if (!/^[A-Z0-9]+\/[A-Z0-9]+$/.test(pair)) {
        console.error(chalk.red(`Invalid pair format: ${pair}. Expected e.g. SOL/USDC`));
        process.exit(1);
      }

      console.log(
        chalk.bold.cyan(`\n🛡️  Shielding swap: ${chalk.white(amount)} ${pair} on ${chalk.white(dex.toUpperCase())}\n`),
      );

      if (!cfg.apiKey) {
        console.log(chalk.yellow("⚠  No API key set. Run `l2mev init` to configure one.\n"));
      }

      const spinner = ora("Assessing MEV risk…").start();

      try {
        const api = createApiClient();

        // Resolve wallet public key from the configured keypair file
        let walletPublicKey = "11111111111111111111111111111111"; // System Program (safe fallback)
        const keypairPath = cfg.keypairPath.replace(/^~/, process.env.HOME ?? "~");
        if (existsSync(keypairPath)) {
          try {
            const raw = JSON.parse(readFileSync(keypairPath, "utf-8")) as number[];
            const kp = Keypair.fromSecretKey(Uint8Array.from(raw));
            walletPublicKey = kp.publicKey.toBase58();
          } catch {
            console.log(chalk.yellow(`⚠  Could not read keypair from ${keypairPath} — using placeholder.\n`));
          }
        } else {
          console.log(
            chalk.yellow(
              `⚠  Keypair file not found at ${keypairPath}. Run \`l2mev init\` or set \`keypairPath\`.\n`,
            ),
          );
        }

        const body = {
          dex,
          pair,
          amountIn:     amount,
          slippageBps:  slippage,
          walletPublicKey,
          privateRoute: forcePrivate,
          dryRun,
        };

        spinner.text = "Building protected transaction…";
        const res = await api.post<{
          bundleId: string;
          serializedTransaction: string;
          estimatedOutputAmount: number;
          priceImpactPct: number;
          mevRiskScore: number;
          protectionMethod: string;
          dryRun?: boolean;
        }>("/api/shield", body);

        const data = res.data;

        spinner.succeed(chalk.green("Protected transaction built!\n"));

        console.log(chalk.bold("  Summary"));
        console.log(`  MEV Risk Score   : ${riskColor(data.mevRiskScore)}`);
        console.log(`  Protection       : ${chalk.cyan(data.protectionMethod)}`);
        if (!dryRun) {
          console.log(`  Estimated output : ${chalk.white(data.estimatedOutputAmount.toFixed(6))}`);
          console.log(`  Price impact     : ${chalk.yellow(data.priceImpactPct.toFixed(3) + "%")}`);
          console.log(`  Bundle ID        : ${chalk.gray(data.bundleId)}\n`);

          console.log(
            chalk.bold.yellow(
              "  ⚠  Sign and broadcast the transaction with your wallet:\n" +
              "     The serialized transaction has been written to ./shielded-tx.txt\n",
            ),
          );

          writeFileSync("./shielded-tx.txt", data.serializedTransaction);
        } else {
          console.log(chalk.gray("\n  (dry-run — no transaction broadcast)\n"));
        }
      } catch (err) {
        spinner.fail(chalk.red("Failed to build protected transaction"));
        console.error(chalk.gray((err as Error).message));
        process.exit(1);
      }
    });
}

function riskColor(score: number): string {
  if (score >= 70) return chalk.red.bold(`${score}/100 HIGH`);
  if (score >= 40) return chalk.yellow(`${score}/100 MEDIUM`);
  return chalk.green(`${score}/100 LOW`);
}
