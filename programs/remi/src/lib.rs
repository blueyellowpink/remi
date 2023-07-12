mod errors;
mod instructions;
mod state;

use anchor_lang::prelude::*;

use crate::instructions::*;

declare_id!("CNPEe47uccxYFBZ86rvxNsEioZrga5hf3Z9sXdSFebRJ");

#[program]
pub mod remi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.app.initialize(ctx.accounts.mint.key())
    }
}
