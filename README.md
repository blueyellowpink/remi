# Token Swap

## Address deployed on Solana Devnet
- Mint token address: `2QxsXH2kMRtZMNbPYKaHvMUctGEoXUqKGALpxcLB3RJh`
- Program address: `CNPEe47uccxYFBZ86rvxNsEioZrga5hf3Z9sXdSFebRJ`

## Setup
- Install `yarn`: https://yarnpkg.com/getting-started/install
- Install dependencies
```bash
yarn
```

## Example command
### Check balance
- Check balance of swap program or user (default to swap program's balance if `keypair` is not provided)
```bash
anchor run balance # return swap program's balance
anchor run balance -- keypair=./user.json # return user.json balance
```

### Add Liquidity
- `sol` is the amount of SOL and `token` is the amount of token to add to the pool
- `keypair` is the path of keypair JSON file (default to `deployer.json` if `keypair` is not provided)
```bash
anchor run add -- sol=2 token=20
anchor run add -- sol=2 token=20 keypair=./deployer.json
```

### Swap SOL for token
- `sol` is the amount of SOL being swapped for token
- `keypair` is the path of keypair JSON file (default to `user.json` if `keypair` is not provided)
```bash
anchor run swap -- sol=1
anchor run swap -- sol=1 keypair=./user.json
```

### Swap token for SOL
- `token` is the amount of token being swapped for SOL
- `keypair` is the path of keypair JSON file (default to `user.json` if `keypair` is not provided)
```bash
anchor run swap -- token=5
anchor run swap -- token=5 keypair=./user.json
```
