import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { createApiClient } from "../lib/api";

interface AnalysisResult {
  txSignature:        string;
  wasAttacked:        boolean;
  attackType?:        string;
  estimatedLossUsd?:  number;
  frontrunTx?:        string;
  backrunTx?:         string;
  slippageActual:     number;
  slippageExpected:   number;
  details:            string;
}

export function registerAnalyze(program: Command): void {
  program
    .command("analyze")
    .description("Forensic analysis: was a past transaction sandwiched?")
    .requiredOption("--tx <signature>", "Transaction signature to analyze")
    .action(async (opts) => {
      const sig = opts.tx as string;

      if (sig.length < 64) {
        console.error(chalk.red("Invalid transaction signature (too short)."));
        process.exit(1);
      }

      console.log(chalk.bold.cyan("\n🔍  MEV Transaction Analyzer\n"));
      const spinner = ora(`Analyzing ${sig.slice(0, 16)}…`).start();

      try {
        const api = createApiClient();
        const res = await api.get<AnalysisResult>(`/api/shield/analyze/${sig}`);
        const result = res.data;

        spinner.stop();

        if (result.wasAttacked) {
          console.log(chalk.red.bold("⚠  SANDWICH ATTACK DETECTED\n"));
          console.log(`  Attack type     : ${chalk.red(result.attackType ?? "unknown")}`);
          if (result.frontrunTx) {
            console.log(`  Frontrun tx     : ${chalk.dim(result.frontrunTx)}`);
          }
          if (result.backrunTx) {
            console.log(`  Backrun tx      : ${chalk.dim(result.backrunTx)}`);
          }
          if (result.estimatedLossUsd) {
            console.log(`  Estimated loss  : ${chalk.red(`$${result.estimatedLossUsd.toFixed(2)}`)}`);
          }
          console.log(`  Slippage actual : ${chalk.red(result.slippageActual.toFixed(2) + "%")}`);
          console.log(`  Slippage expect : ${chalk.green(result.slippageExpected.toFixed(2) + "%")}`);
        } else {
          console.log(chalk.green("✓  No MEV attack detected\n"));
        }

        console.log(`\n  ${chalk.dim(result.details)}\n`);
        console.log(
          chalk.cyan(
            "  Protect future trades with:\n" +
            "  l2mev shield --dex jupiter --pair SOL/USDC --amount <n>\n",
          ),
        );
      } catch (err) {
        spinner.fail(chalk.red("Analysis failed"));
        console.error(chalk.gray((err as Error).message));
        process.exit(1);
      }
    });
}
