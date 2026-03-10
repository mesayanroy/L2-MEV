/**
 * Persistent configuration store.
 * Stored in ~/.config/l2mev/config.json (cross-platform via `conf`).
 */

import Conf from "conf";

export interface L2MevConfig {
  rpcUrl:       string;
  keypairPath:  string;
  apiUrl:       string;
  apiKey:       string;
  defaultDex:   "jupiter" | "raydium" | "orca";
  defaultSlippage: number; // basis points
}

const DEFAULTS: L2MevConfig = {
  rpcUrl:          "https://api.mainnet-beta.solana.com",
  keypairPath:     "~/.config/solana/id.json",
  apiUrl:          "https://api.l2mev.io",
  apiKey:          "",
  defaultDex:      "jupiter",
  defaultSlippage: 50,
};

const store = new Conf<L2MevConfig>({
  projectName: "l2mev",
  defaults:    DEFAULTS,
});

export function getConfig(): L2MevConfig {
  return store.store;
}

export function getConfigValue<K extends keyof L2MevConfig>(key: K): L2MevConfig[K] {
  return store.get(key);
}

export function setConfigValue<K extends keyof L2MevConfig>(key: K, value: L2MevConfig[K]): void {
  store.set(key, value);
}

export function resetConfig(): void {
  store.clear();
}

export function configPath(): string {
  return store.path;
}
