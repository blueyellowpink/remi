use anchor_lang::prelude::*;

#[account]
pub struct App {
    pub mint: Pubkey, // 32
}

impl App {
    pub const MAXIMUM_SIZE: usize = 32;

    pub fn initialize(&mut self, mint: Pubkey) -> Result<()> {
        self.mint = mint;
        Ok(())
    }

    // pub fn add_liquidity(&self, sol_amount: u64, mint_amount: u64) -> Result<()> {
    //     let
    //     let cpi_accounts = Transfer {
    //         from:
    //     }
    //     Ok(())
    // }
}
