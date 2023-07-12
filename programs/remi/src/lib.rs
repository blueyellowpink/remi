mod errors;
mod instructions;
mod state;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::token::{self, Transfer};

use crate::instructions::*;

declare_id!("CNPEe47uccxYFBZ86rvxNsEioZrga5hf3Z9sXdSFebRJ");

#[program]
pub mod remi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.app.initialize(ctx.accounts.mint.key())
    }

    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        sol_amount: u64,
        mint_amount: u64,
    ) -> Result<()> {
        let from = &ctx.accounts.from;
        let from_ata = &ctx.accounts.from_ata;
        let to_ata = &ctx.accounts.to_ata;
        let token_program = &ctx.accounts.token_program;

        let cpi_accounts = Transfer {
            from: from_ata.to_account_info(),
            to: to_ata.to_account_info(),
            authority: from.to_account_info(),
        };
        let cpi_program = token_program.to_account_info();

        let context = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(context, mint_amount)?;

        Ok(())
    }
}
