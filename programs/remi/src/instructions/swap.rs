use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

use crate::state::*;

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut, owner = crate::ID, seeds = [b"appata".as_ref()], bump = app.bump)]
    pub app: Account<'info, App>,

    #[account(mut, owner = token_program.key())]
    pub app_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(mut, owner = token_program.key(), constraint = sender_ata.mint == app.mint)]
    pub sender_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
