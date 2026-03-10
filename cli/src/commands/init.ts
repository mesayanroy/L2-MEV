import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { setConfigValue, configPath } from "../lib/config";

export function registerInit(program: Command): void {
  program
    .command("init")
    .description("Interactive setup wizard — configure your wallet, RPC, and API key")
    .action(async () => {
      console.log(chalk.bold.cyan("\n🛡️  L2-MEV Shield — Setup Wizard\n"));
      console.log(
        chalk.gray(
          "Your private key is NEVER transmitted. All signing happens locally.\n",
        ),
      );

      const answers = await inquirer.prompt([
        {
          type:    "input",
          name:    "rpcUrl",
          message: "Solana RPC endpoint:",
          default: "https://api.mainnet-beta.solana.com",
          validate: (v: string) =>
            v.startsWith("http") ? true : "Must be a valid HTTP(S) URL",
        },
        {
          type:    "input",
          name:    "keypairPath",
          message: "Path to your Solana keypair JSON file:",
          default: "~/.config/solana/id.json",
        },
        {
          type:    "list",
          name:    "defaultDex",
          message: "Default DEX for protected swaps:",
          choices: [
            { name: "Jupiter  (best route aggregator)", value: "jupiter" },
            { name: "Raydium  (AMM pools)",             value: "raydium" },
            { name: "Orca     (concentrated liquidity)", value: "orca"   },
          ],
          default: "jupiter",
        },
        {
          type:    "number",
          name:    "defaultSlippage",
          message: "Default max slippage (basis points, 50 = 0.5%):",
          default: 50,
          validate: (v: number) =>
            v >= 1 && v <= 5000 ? true : "Must be between 1 and 5000",
        },
        {
          type:    "input",
          name:    "apiUrl",
          message: "L2-MEV Shield API URL:",
          default: "https://api.l2mev.io",
        },
        {
          type:    "password",
          name:    "apiKey",
          message: "API key (leave blank to use anonymously):",
          mask:    "*",
          default: "",
        },
      ]);

      const spinner = ora("Saving configuration…").start();
      try {
        setConfigValue("rpcUrl",          answers.rpcUrl);
        setConfigValue("keypairPath",     answers.keypairPath);
        setConfigValue("defaultDex",      answers.defaultDex);
        setConfigValue("defaultSlippage", answers.defaultSlippage);
        setConfigValue("apiUrl",          answers.apiUrl);
        setConfigValue("apiKey",          answers.apiKey);

        spinner.succeed(
          chalk.green(`Configuration saved to ${chalk.bold(configPath())}`),
        );

        console.log(
          chalk.cyan(
            "\nNext steps:\n" +
              "  l2mev shield --dex jupiter --pair SOL/USDC --amount 10\n" +
              "  l2mev monitor\n" +
              "  l2mev status\n",
          ),
        );
      } catch (err) {
        spinner.fail("Failed to save configuration");
        console.error(err);
        process.exit(1);
      }
    });
}
