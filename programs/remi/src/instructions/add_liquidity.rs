use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

use crate::state::*;

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(mut, seeds = [b"appata".as_ref()], bump = app.bump)]
    pub app: Account<'info, App>,

    #[account(mut)]
    pub app_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub from: Signer<'info>,

    #[account(mut)]
    pub from_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
