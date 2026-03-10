import { Command } from "commander";
import chalk from "chalk";
import { getConfig, setConfigValue, configPath, L2MevConfig } from "../lib/config";

export function registerConfig(program: Command): void {
  const config = program.command("config").description("View or update CLI configuration");

  config
    .command("list")
    .description("Print all current settings")
    .action(() => {
      const cfg = getConfig();
      console.log(chalk.bold.cyan("\n⚙  L2-MEV Shield Configuration\n"));
      console.log(chalk.dim(`  File: ${configPath()}\n`));

      for (const [k, v] of Object.entries(cfg)) {
        const display = k === "apiKey" && v ? chalk.gray("***hidden***") : chalk.white(String(v));
        console.log(`  ${chalk.bold(k.padEnd(20))} ${display}`);
      }
      console.log();
    });

  config
    .command("set <key> <value>")
    .description("Update a single config value")
    .action((key: string, value: string) => {
      const validKeys: Array<keyof L2MevConfig> = [
        "rpcUrl",
        "keypairPath",
        "apiUrl",
        "apiKey",
        "defaultDex",
        "defaultSlippage",
      ];

      if (!validKeys.includes(key as keyof L2MevConfig)) {
        console.error(
          chalk.red(`Unknown key: ${key}\nValid keys: ${validKeys.join(", ")}`),
        );
        process.exit(1);
      }

      const typedKey = key as keyof L2MevConfig;
      const typedValue = typedKey === "defaultSlippage"
        ? (parseInt(value, 10) as unknown as L2MevConfig[typeof typedKey])
        : (value as unknown as L2MevConfig[typeof typedKey]);

      setConfigValue(typedKey, typedValue);
      console.log(chalk.green(`✓  ${key} updated`));
    });
}
