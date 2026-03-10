/**
 * Tests for CLI config module (pure logic, no I/O).
 */

// Mock the `conf` package so tests don't write to disk
const mockStore: Record<string, unknown> = {};

jest.mock("conf", () =>
  jest.fn().mockImplementation(() => ({
    get store() { return { ...mockStore }; },
    get(key: string)                  { return mockStore[key]; },
    set(key: string, val: unknown)    { mockStore[key] = val; },
    clear()                           { Object.keys(mockStore).forEach((k) => delete mockStore[k]); },
    get path()                        { return "/tmp/l2mev-test/config.json"; },
  })),
);

import { getConfigValue, setConfigValue, resetConfig, configPath } from "../src/lib/config";

describe("CLI config", () => {
  beforeEach(() => {
    resetConfig();
  });

  it("sets and retrieves a string value", () => {
    setConfigValue("rpcUrl", "https://my-rpc.example.com");
    expect(getConfigValue("rpcUrl")).toBe("https://my-rpc.example.com");
  });

  it("sets and retrieves a numeric value", () => {
    setConfigValue("defaultSlippage", 100);
    expect(getConfigValue("defaultSlippage")).toBe(100);
  });

  it("sets and retrieves the defaultDex", () => {
    setConfigValue("defaultDex", "raydium");
    expect(getConfigValue("defaultDex")).toBe("raydium");
  });

  it("returns the config file path", () => {
    expect(typeof configPath()).toBe("string");
    expect(configPath().length).toBeGreaterThan(0);
  });
});
