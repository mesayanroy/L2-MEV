# L2-MEV Shield 🛡️

> **Professional Solana MEV Protection Infrastructure** — Detect and prevent sandwich attacks, frontrunning, and backrunning across Jupiter, Raydium, Orca, and more.

[![CI](https://github.com/mesayanroy/L2-MEV/actions/workflows/ci.yml/badge.svg)](https://github.com/mesayanroy/L2-MEV/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/l2mev.svg)](https://www.npmjs.com/package/l2mev)

---

## What is L2-MEV Shield?

**Maximal Extractable Value (MEV)** is the profit extracted by validators and bots by reordering, inserting, or censoring transactions in a block. On Solana DEXes like Jupiter and Raydium, the most common MEV attack is the **sandwich attack**:

1. A bot sees your pending swap in the mempool  
2. It buys the same token *before* your transaction executes (**frontrun**), raising the price  
3. Your trade settles at a worse price  
4. The bot immediately sells (**backrun**), pocketing the difference  

**L2-MEV Shield** is an open infrastructure platform that protects DeFi traders from these attacks by:

| Protection Layer | How it works |
|---|---|
| 🔒 **Private Bundle Routing** | Submits your trades via [Jito](https://jito.wtf) bundles, bypassing the public mempool |
| 📡 **Real-time MEV Detection** | WebSocket feed monitoring pools on Jupiter/Raydium/Orca for sandwich patterns |
| ⚓ **On-chain Slippage Guard** | Anchor program that atomically validates execution price before settling |
| 🛠️ **CLI Shield** | One-command protection for any Solana swap from your terminal |
| 📊 **Dashboard** | Real-time analytics of blocked attacks, protected volume, and pool health |

---

## Quick Start (CLI)

### 1. Install the CLI

```bash
npm install -g l2mev
```

### 2. Initialize your profile

```bash
l2mev init
```

This wizard will ask for:
- Your Solana wallet keypair path (or create a new one)
- Your preferred RPC endpoint
- Default DEX preferences

Config is stored locally in `~/.l2mev/config.json` — your keys never leave your machine.

### 3. Protect a trade

```bash
# Shield a Jupiter swap: buy 10 SOL worth of BONK with max 0.5% slippage
l2mev shield --dex jupiter --pair SOL/BONK --amount 10 --slippage 0.5

# Shield a Raydium swap
l2mev shield --dex raydium --pair SOL/USDC --amount 100 --slippage 0.3
```

### 4. Monitor pools in real-time

```bash
# Watch top pools for live sandwich/frontrun activity
l2mev monitor --pools raydium:SOL/USDC,jupiter:SOL/BONK

# Alert-only mode (no sound, just logs)
l2mev monitor --quiet
```

### 5. Analyze a past transaction

```bash
# Was your transaction sandwiched?
l2mev analyze --tx <TRANSACTION_SIGNATURE>
```

### 6. View / update your config

```bash
l2mev config list
l2mev config set rpcUrl https://your-premium-rpc.com
```

---

## CLI Commands Reference

| Command | Description |
|---|---|
| `l2mev init` | Interactive setup wizard |
| `l2mev shield [options]` | Execute a MEV-protected swap |
| `l2mev monitor [options]` | Real-time pool surveillance |
| `l2mev analyze --tx <sig>` | Post-hoc sandwich attack forensics |
| `l2mev config list` | Show current configuration |
| `l2mev config set <key> <val>` | Update a config value |
| `l2mev status` | Check backend connectivity and health |

### `l2mev shield` options

```
--dex <name>        DEX to trade on (jupiter | raydium | orca) [required]
--pair <A/B>        Token pair, e.g. SOL/USDC [required]
--amount <n>        Input amount in units of token A [required]
--slippage <pct>    Max allowed slippage in % (default: 0.5)
--private           Force Jito bundle routing (default: auto)
--dry-run           Simulate without broadcasting
```

### `l2mev monitor` options

```
--pools <list>      Comma-separated dex:pair identifiers
--threshold <pct>   Alert when price impact exceeds this % (default: 1.0)
--quiet             Suppress UI, output structured JSON only
--output <path>     Write alerts to JSON log file
```

---

## Project Structure

```
L2-MEV/
├── frontend/           # Next.js 14 docs site + dashboard
├── backend/            # Express/TypeScript MEV protection API
├── cli/                # npm CLI package (l2mev)
├── programs/           # Anchor/Rust Solana on-chain programs
│   └── mev-shield/     # Slippage guard + commitment instructions
├── devops/             # Dockerfiles, nginx config
├── .github/workflows/  # CI (test + lint) and deploy pipelines
├── docker-compose.yml  # Full-stack local development
└── .env.example        # Environment variable template
```

---

## Architecture

```
User Terminal (CLI)
       │
       ▼
  l2mev shield ──► Backend API (/api/shield)
                        │
              ┌─────────┴──────────┐
              │                    │
        MEV Detector          Transaction Shield
     (pool surveillance)    (private bundle builder)
              │                    │
              ▼                    ▼
       Solana RPC           Jito Block Engine
    (pool state reads)    (private submission)
              │
              ▼
    On-chain mev-shield
       Anchor Program
   (slippage guard CPI)
```

---

## Running Locally

### Prerequisites

- Node.js ≥ 20, npm ≥ 10
- Rust + [Anchor CLI](https://book.anchor-lang.com/getting_started/installation.html)
- Docker + Docker Compose (optional, for full-stack mode)

### Install dependencies

```bash
npm install
```

### Start dev servers

```bash
# Frontend (http://localhost:3000)
npm run dev:frontend

# Backend API (http://localhost:4000)
npm run dev:backend
```

### Docker Compose (recommended)

```bash
cp .env.example .env   # fill in your values
npm run docker:up
```

Starts: frontend (3000), backend (4000), nginx reverse proxy (80/443).

---

## On-chain Program

The `mev-shield` Anchor program enforces a **price commitment** pattern:

1. Your client pre-computes the expected execution price
2. The program's `commit_price` instruction records this commitment on-chain
3. The program's `validate_and_swap` instruction CPIs into the DEX and reverts if the actual execution price deviates beyond the committed slippage bound

This prevents any bot from sandwiching your transaction even if they manage to frontrun it — the transaction simply reverts.

```bash
cd programs
anchor build
anchor test
anchor deploy --provider.cluster devnet
```

---

## Security

- All API routes require JWT authentication
- Rate limiting on all public endpoints (100 req/min)
- CORS restricted to configured origins
- Keypairs never transmitted to backend; all signing is done client-side in the CLI
- See [SECURITY.md](SECURITY.md) for responsible disclosure policy

---

## Contributing

Pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

```bash
git clone https://github.com/mesayanroy/L2-MEV.git
cd L2-MEV
npm install
npm test
```

---

## License

MIT — see [LICENSE](LICENSE).