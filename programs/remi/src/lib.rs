mod errors;
mod instructions;
mod state;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::token::{self, Transfer};

use crate::errors::*;
use crate::instructions::*;
use crate::state::*;

declare_id!("CNPEe47uccxYFBZ86rvxNsEioZrga5hf3Z9sXdSFebRJ");

#[program]
pub mod remi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let bump = ctx.bumps.get("app").ok_or_else(|| AppError::BumpNotFound)?;
        ctx.accounts
            .app
            .initialize(*bump, ctx.accounts.ata.key(), ctx.accounts.mint.key())?;
        Ok(())
    }

    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        sol_amount: u64,
        mint_amount: u64,
    ) -> Result<()> {
        let app = &ctx.accounts.app;
        let app_ata = &ctx.accounts.app_ata;
        let from = &ctx.accounts.from;
        let from_ata = &ctx.accounts.from_ata;
        let token_program = &ctx.accounts.token_program;
        let system_program = &ctx.accounts.system_program;

        require_gte!(
            from.lamports(),
            sol_amount,
            AppError::SenderInsufficientBalance
        );
        require_gte!(
            from_ata.amount,
            mint_amount,
            AppError::SenderInsufficientBalance
        );

        // sends SOL to app
        let transfer_instruction =
            system_instruction::transfer(&from.key(), &app.key(), sol_amount);
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                from.to_account_info(),
                app.to_account_info(),
                system_program.to_account_info(),
            ],
            &[],
        )?;

        // sends token to app
        let cpi_accounts = Transfer {
            from: from_ata.to_account_info(),
            to: app_ata.to_account_info(),
            authority: from.to_account_info(),
        };
        let cpi_program = token_program.to_account_info();
        let context = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(context, mint_amount)?;

        Ok(())
    }

    pub fn swap_sol_for_token(ctx: Context<Swap>, sol_amount: u64) -> Result<()> {
        let app = &ctx.accounts.app;
        let app_ata = &ctx.accounts.app_ata;
        let sender = &ctx.accounts.sender;
        let sender_ata = &ctx.accounts.sender_ata;
        let token_program = &ctx.accounts.token_program;
        let system_program = &ctx.accounts.system_program;

        require_gte!(
            sender.lamports(),
            sol_amount,
            AppError::SenderInsufficientBalance
        );
        let token_amount = sol_amount * App::TOKEN_PER_SOL;
        require_gte!(
            app_ata.amount,
            token_amount,
            AppError::AppInsufficientBalance
        );

        // sender sends SOL to app
        let transfer_instruction =
            system_instruction::transfer(&sender.key(), &app.key(), sol_amount);
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                sender.to_account_info(),
                app.to_account_info(),
                system_program.to_account_info(),
            ],
            &[],
        )?;

        // app sends TOKEN to sender
        let cpi_accounts = Transfer {
            from: app_ata.to_account_info(),
            to: sender_ata.to_account_info(),
            authority: app.to_account_info(),
        };
        let cpi_program = token_program.to_account_info();
        let bump = app.bump;
        let seeds = vec![bump];
        let seeds = vec![b"appata".as_ref(), seeds.as_slice()];
        let seeds = vec![seeds.as_slice()];
        let seeds = seeds.as_slice();
        let context = CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds);
        token::transfer(context, token_amount)?;

        Ok(())
    }

    pub fn swap_token_for_sol(ctx: Context<Swap>, token_amount: u64) -> Result<()> {
        let app = &ctx.accounts.app;
        let app_ata = &ctx.accounts.app_ata;
        let sender = &ctx.accounts.sender;
        let sender_ata = &ctx.accounts.sender_ata;
        let token_program = &ctx.accounts.token_program;

        require_gte!(
            sender_ata.amount,
            token_amount,
            AppError::SenderInsufficientBalance
        );
        let sol_amount = token_amount / App::TOKEN_PER_SOL;
        require_gte!(
            app.to_account_info().lamports(),
            sol_amount,
            AppError::AppInsufficientBalance
        );

        // sender sends TOKEN to app
        let cpi_accounts = Transfer {
            from: sender_ata.to_account_info(),
            to: app_ata.to_account_info(),
            authority: sender.to_account_info(),
        };
        let cpi_program = token_program.to_account_info();
        let context = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(context, token_amount)?;

        // app sends SOL to sender
        **app.to_account_info().try_borrow_mut_lamports()? -= sol_amount;
        **sender.to_account_info().try_borrow_mut_lamports()? += sol_amount;

        Ok(())
    }
}
