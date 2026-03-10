import { MevDetector } from "../src/services/mev-detector";
import { MevAlert } from "../src/types";
import { v4 as uuidv4 } from "uuid";

// Minimal PendingSwap shape exposed for testing
interface TestSwap {
  slot: number;
  timestamp: number;
  signature: string;
  signer: string;
  pool: string;
  dex: "raydium" | "jupiter" | "orca" | "binance";
  direction: "buy" | "sell";
  amountIn: number;
}

function makeSwap(override: Partial<TestSwap> = {}): TestSwap {
  return {
    slot:      100,
    timestamp: Date.now(),
    signature: uuidv4().replace(/-/g, ""),
    signer:    "attacker1",
    pool:      "SOL/USDC",
    dex:       "raydium",
    direction: "buy",
    amountIn:  1000,
    ...override,
  };
}

describe("MevDetector", () => {
  let detector: MevDetector;

  beforeEach(() => {
    // Reset singleton for isolated tests
    // @ts-expect-error accessing private for test reset — needed to isolate singleton
    MevDetector.instance = undefined;
    detector = MevDetector.getInstance();
  });

  describe("detectSandwich()", () => {
    it("detects a classic sandwich pattern", () => {
      const now = Date.now();
      const swaps: TestSwap[] = [
        makeSwap({ signer: "attacker", direction: "buy",  timestamp: now - 100 }),
        makeSwap({ signer: "victim",   direction: "buy",  timestamp: now - 50  }),
        makeSwap({ signer: "attacker", direction: "sell", timestamp: now       }),
      ];

      // Access the public method via typed cast for testing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alert: MevAlert | null = (detector as any).detectSandwich(swaps);
      expect(alert).not.toBeNull();
      expect(alert?.type).toBe("sandwich");
    });

    it("does NOT flag when buy/sell signers differ", () => {
      const now = Date.now();
      const swaps: TestSwap[] = [
        makeSwap({ signer: "attacker1", direction: "buy",  timestamp: now - 100 }),
        makeSwap({ signer: "victim",    direction: "buy",  timestamp: now - 50  }),
        makeSwap({ signer: "attacker2", direction: "sell", timestamp: now       }),
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alert = (detector as any).detectSandwich(swaps);
      expect(alert).toBeNull();
    });

    it("does NOT flag when buy+sell are for different pools", () => {
      const now = Date.now();
      const swaps: TestSwap[] = [
        makeSwap({ signer: "attacker", direction: "buy",  pool: "SOL/USDC", timestamp: now - 100 }),
        makeSwap({ signer: "victim",   direction: "buy",  pool: "SOL/BONK", timestamp: now - 50  }),
        makeSwap({ signer: "attacker", direction: "sell", pool: "SOL/BONK", timestamp: now       }),
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alert = (detector as any).detectSandwich(swaps);
      expect(alert).toBeNull();
    });

    it("does NOT flag swaps outside the time window", () => {
      const now = Date.now();
      const swaps: TestSwap[] = [
        makeSwap({ signer: "attacker", direction: "buy",  timestamp: now - 10_000 }), // 10s ago — outside window
        makeSwap({ signer: "victim",   direction: "buy",  timestamp: now - 50     }),
        makeSwap({ signer: "attacker", direction: "sell", timestamp: now          }),
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alert = (detector as any).detectSandwich(swaps);
      expect(alert).toBeNull();
    });
  });

  describe("scoreTransaction()", () => {
    it("returns a score between 0 and 100", async () => {
      const score = await detector.scoreTransaction({
        dex: "raydium",
        pair: "SOL/USDC",
        amountIn: 1000,
      });
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("scores Raydium higher than Orca for the same trade", async () => {
      const raydium = await detector.scoreTransaction({ dex: "raydium", pair: "SOL/USDC", amountIn: 100 });
      const orca    = await detector.scoreTransaction({ dex: "orca",    pair: "SOL/USDC", amountIn: 100 });
      expect(raydium).toBeGreaterThan(orca);
    });

    it("scores larger amounts higher than smaller ones", async () => {
      const small = await detector.scoreTransaction({ dex: "jupiter", pair: "SOL/USDC", amountIn: 1 });
      const large = await detector.scoreTransaction({ dex: "jupiter", pair: "SOL/USDC", amountIn: 100_000 });
      expect(large).toBeGreaterThan(small);
    });
  });

  describe("recordAlert() + uptimeSeconds()", () => {
    it("stores alerts and exposes uptime", () => {
      const alert: MevAlert = {
        id: uuidv4(),
        timestamp: Date.now(),
        type: "frontrun",
        pool: "SOL/USDC",
        dex: "raydium",
        severity: "medium",
        details: "Test frontrun alert",
      };

      detector.recordAlert(alert);

      // uptime should be ≥ 0
      expect(detector.uptimeSeconds()).toBeGreaterThanOrEqual(0);
    });
  });
});
