use anchor_lang::prelude::*;

#[account]
pub struct App {
    pub mint: Pubkey, // 32
    pub ata: Pubkey,  // 32
    pub bump: u8,     // 1
}

impl App {
    pub const MAXIMUM_SIZE: usize = 65;
    pub const TOKEN_PER_SOL: u64 = 10;

    pub fn initialize(&mut self, bump: u8, ata: Pubkey, mint: Pubkey) -> Result<()> {
        self.mint = mint;
        self.ata = ata;
        self.bump = bump;
        Ok(())
    }
}
