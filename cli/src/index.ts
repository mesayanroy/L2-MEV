#!/usr/bin/env node
/**
 * l2mev — L2-MEV Shield CLI
 *
 * Usage:
 *   l2mev init                       Interactive setup wizard
 *   l2mev shield --dex <x> ...       Execute a MEV-protected swap
 *   l2mev monitor [--pools ...]      Watch pools for live MEV activity
 *   l2mev analyze --tx <sig>         Forensic analysis of a past tx
 *   l2mev config list|set <k> <v>    View / update config
 *   l2mev status                     Health check against the API
 */

import { Command } from "commander";
import { registerInit }     from "./commands/init";
import { registerShield }   from "./commands/shield";
import { registerMonitor }  from "./commands/monitor";
import { registerAnalyze }  from "./commands/analyze";
import { registerConfig }   from "./commands/config";
import { registerStatus }   from "./commands/status";

const program = new Command();

program
  .name("l2mev")
  .description("🛡️  L2-MEV Shield — Protect your Solana trades from sandwich attacks & frontrunning")
  .version("1.0.0");

registerInit(program);
registerShield(program);
registerMonitor(program);
registerAnalyze(program);
registerConfig(program);
registerStatus(program);

program.parse(process.argv);
