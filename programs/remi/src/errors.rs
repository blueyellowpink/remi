use anchor_lang::error_code;

#[error_code]
pub enum AppError {
    AppAtaAddressesDoNotMatch,
    SenderInsufficientBalance,
    AppInsufficientBalance,
    BumpNotFound,
}
