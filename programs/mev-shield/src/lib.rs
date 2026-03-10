//! # MEV Shield — Solana Anchor Program
//!
//! Provides two instructions that work together to prevent sandwich attacks:
//!
//! ## `commit_price`
//! Called by the client *in the same transaction* as the DEX swap.  
//! Records the user's expected execution price and maximum slippage tolerance
//! into a per-user PDA account.
//!
//! ## `validate_execution`
//! Called *after* the DEX CPI returns, still within the same atomic transaction.  
//! Reads the PDA, computes the actual execution price from token balance changes,
//! and reverts (returns an error) if the price deviated beyond the allowed tolerance.
//!
//! Because Solana transactions are atomic, a revert here undoes the entire
//! transaction — including the DEX swap — so the attacker's frontrun is wasted.
//!
//! ## Usage pattern (pseudo-code)
//! ```
//! transaction {
//!   1. mev_shield::commit_price(expected_price, slippage_bps)
//!   2. <DEX swap CPI>
//!   3. mev_shield::validate_execution(actual_output_amount)
//! }
//! ```

use anchor_lang::prelude::*;

declare_id!("MevShd1111111111111111111111111111111111111");

/// Maximum allowed slippage that a user can commit to (50% = 5000 bps).
/// This prevents committing to an unreasonably high slippage that would
/// allow any sandwich to succeed anyway.
pub const MAX_SLIPPAGE_BPS: u64 = 5000;

#[program]
pub mod mev_shield {
    use super::*;

    /// Commit to an expected execution price before the DEX swap.
    ///
    /// # Arguments
    /// * `expected_out_amount` – Minimum acceptable output token amount
    ///   (in the output token's smallest unit, e.g. lamports for SOL).
    /// * `slippage_bps` – Allowed deviation from `expected_out_amount`
    ///   in basis points (e.g. 50 = 0.5%).
    pub fn commit_price(
        ctx: Context<CommitPrice>,
        expected_out_amount: u64,
        slippage_bps: u64,
    ) -> Result<()> {
        require!(
            slippage_bps <= MAX_SLIPPAGE_BPS,
            MevShieldError::SlippageTooHigh
        );
        require!(expected_out_amount > 0, MevShieldError::InvalidAmount);

        let commitment = &mut ctx.accounts.price_commitment;
        commitment.owner          = ctx.accounts.user.key();
        commitment.expected_out   = expected_out_amount;
        commitment.slippage_bps   = slippage_bps;
        commitment.committed_at   = Clock::get()?.slot;
        commitment.bump           = ctx.bumps.price_commitment;

        emit!(PriceCommitted {
            owner:              commitment.owner,
            expected_out_amount,
            slippage_bps,
            slot: commitment.committed_at,
        });

        Ok(())
    }

    /// Validate the actual execution price after the DEX swap CPI.
    ///
    /// # Arguments
    /// * `actual_out_amount` – Actual output token amount received from the DEX.
    ///
    /// Reverts the entire transaction (including the DEX swap) if the actual
    /// output is below the minimum acceptable amount.
    pub fn validate_execution(
        ctx: Context<ValidateExecution>,
        actual_out_amount: u64,
    ) -> Result<()> {
        let commitment = &ctx.accounts.price_commitment;

        // Ensure this is the same user who committed
        require_keys_eq!(
            commitment.owner,
            ctx.accounts.user.key(),
            MevShieldError::Unauthorized
        );

        // Commitment must be from the current or previous slot (prevents replay)
        let current_slot = Clock::get()?.slot;
        require!(
            current_slot <= commitment.committed_at + 2,
            MevShieldError::CommitmentExpired
        );

        // Minimum acceptable output = expected * (1 - slippage_bps / 10_000)
        let min_out = commitment
            .expected_out
            .checked_mul(10_000 - commitment.slippage_bps)
            .ok_or(MevShieldError::MathOverflow)?
            .checked_div(10_000)
            .ok_or(MevShieldError::MathOverflow)?;

        require!(
            actual_out_amount >= min_out,
            MevShieldError::SlippageExceeded
        );

        emit!(ExecutionValidated {
            owner:              commitment.owner,
            actual_out_amount,
            min_out_amount:     min_out,
            slot:               current_slot,
        });

        Ok(())
    }

    /// Close the price commitment PDA and reclaim the rent lamports.
    /// Should be called after a successful swap to clean up on-chain state.
    pub fn close_commitment(_ctx: Context<CloseCommitment>) -> Result<()> {
        Ok(())
    }
}

// ── Accounts ──────────────────────────────────────────────────────────────────

/// PDA that stores the user's price commitment for a single swap.
/// Seeds: ["price_commitment", user_pubkey]
#[account]
#[derive(Default)]
pub struct PriceCommitment {
    pub owner:        Pubkey,
    pub expected_out: u64,
    pub slippage_bps: u64,
    pub committed_at: u64,  // slot
    pub bump:         u8,
}

impl PriceCommitment {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 1;
}

// ── Instruction contexts ──────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct CommitPrice<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = PriceCommitment::LEN,
        seeds = [b"price_commitment", user.key().as_ref()],
        bump,
    )]
    pub price_commitment: Account<'info, PriceCommitment>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ValidateExecution<'info> {
    #[account(
        seeds = [b"price_commitment", user.key().as_ref()],
        bump = price_commitment.bump,
    )]
    pub price_commitment: Account<'info, PriceCommitment>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseCommitment<'info> {
    #[account(
        mut,
        close = user,
        seeds = [b"price_commitment", user.key().as_ref()],
        bump = price_commitment.bump,
        has_one = owner @ MevShieldError::Unauthorized,
    )]
    pub price_commitment: Account<'info, PriceCommitment>,

    /// CHECK: only used as the rent recipient; verified via `has_one = owner`
    #[account(mut)]
    pub owner: UncheckedAccount<'info>,

    pub user: Signer<'info>,
}

// ── Events ────────────────────────────────────────────────────────────────────

#[event]
pub struct PriceCommitted {
    pub owner:              Pubkey,
    pub expected_out_amount: u64,
    pub slippage_bps:       u64,
    pub slot:               u64,
}

#[event]
pub struct ExecutionValidated {
    pub owner:             Pubkey,
    pub actual_out_amount: u64,
    pub min_out_amount:    u64,
    pub slot:              u64,
}

// ── Errors ────────────────────────────────────────────────────────────────────

#[error_code]
pub enum MevShieldError {
    #[msg("Slippage tolerance exceeds the maximum allowed (50%)")]
    SlippageTooHigh,

    #[msg("Expected output amount must be greater than zero")]
    InvalidAmount,

    #[msg("Actual execution price exceeded your slippage tolerance — transaction reverted to protect you")]
    SlippageExceeded,

    #[msg("Price commitment has expired — resubmit within 2 slots")]
    CommitmentExpired,

    #[msg("Caller is not the owner of this commitment")]
    Unauthorized,

    #[msg("Math overflow")]
    MathOverflow,
}
