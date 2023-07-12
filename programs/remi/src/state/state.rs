use anchor_lang::prelude::*;

#[account]
pub struct App {
    mint: Pubkey, // 32
}

impl App {
    pub const MAXIMUM_SIZE: usize = 32;

    pub fn initialize(&mut self, mint: Pubkey) -> Result<()> {
        self.mint = mint;
        Ok(())
    }
}
