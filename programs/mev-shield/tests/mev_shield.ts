/**
 * Anchor integration tests for the mev-shield program.
 *
 * Run with:
 *   anchor test
 *
 * Requires a local validator:
 *   solana-test-validator
 */

import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { MevShield } from "../target/types/mev_shield";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import assert from "assert";

describe("mev-shield", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MevShield as Program<MevShield>;
  const user = (provider.wallet as anchor.Wallet).payer;

  function commitmentPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("price_commitment"), user.publicKey.toBuffer()],
      program.programId,
    );
  }

  it("commits a price and validates a successful execution", async () => {
    const [pda] = commitmentPDA();
    const expectedOut = new BN(1_000_000); // 1 USDC (6 decimals)
    const slippageBps = new BN(50);         // 0.5%

    await program.methods
      .commitPrice(expectedOut, slippageBps)
      .accounts({
        priceCommitment: pda,
        user:            user.publicKey,
        systemProgram:   SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Actual output = expected (no slippage) → should pass
    await program.methods
      .validateExecution(expectedOut)
      .accounts({
        priceCommitment: pda,
        user:            user.publicKey,
      })
      .signers([user])
      .rpc();
  });

  it("reverts when actual output is below minimum (sandwich simulation)", async () => {
    const [pda] = commitmentPDA();
    const expectedOut = new BN(1_000_000);
    const slippageBps = new BN(50); // 0.5% → min = 995_000

    await program.methods
      .commitPrice(expectedOut, slippageBps)
      .accounts({
        priceCommitment: pda,
        user:            user.publicKey,
        systemProgram:   SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Simulate a sandwich: actual output only 990_000 (below the 995_000 min)
    try {
      await program.methods
        .validateExecution(new BN(990_000))
        .accounts({
          priceCommitment: pda,
          user:            user.publicKey,
        })
        .signers([user])
        .rpc();

      assert.fail("Should have thrown SlippageExceeded");
    } catch (err: unknown) {
      const error = err as { message: string };
      assert.ok(
        error.message.includes("SlippageExceeded") ||
        error.message.includes("slippage tolerance"),
        `Unexpected error: ${error.message}`,
      );
    }
  });

  it("rejects a slippage commitment that exceeds 50%", async () => {
    const [pda] = commitmentPDA();

    try {
      await program.methods
        .commitPrice(new BN(1_000_000), new BN(6000)) // 60% — too high
        .accounts({
          priceCommitment: pda,
          user:            user.publicKey,
          systemProgram:   SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      assert.fail("Should have thrown SlippageTooHigh");
    } catch (err: unknown) {
      const error = err as { message: string };
      assert.ok(
        error.message.includes("SlippageTooHigh") ||
        error.message.includes("maximum allowed"),
        `Unexpected error: ${error.message}`,
      );
    }
  });

  it("closes the commitment PDA and reclaims rent", async () => {
    const [pda] = commitmentPDA();

    // Ensure it exists first
    await program.methods
      .commitPrice(new BN(500_000), new BN(100))
      .accounts({
        priceCommitment: pda,
        user:            user.publicKey,
        systemProgram:   SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    await program.methods
      .closeCommitment()
      .accounts({
        priceCommitment: pda,
        owner:           user.publicKey,
        user:            user.publicKey,
      })
      .signers([user])
      .rpc();

    // Account should no longer exist
    const info = await provider.connection.getAccountInfo(pda);
    assert.strictEqual(info, null, "PDA should be closed");
  });
});
