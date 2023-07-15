import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError, BN, web3 } from "@coral-xyz/anchor";
import { Remi } from "../target/types/remi";
import {
  createMint,
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { getKeypair, setUp } from './utils'

const main = async () => {
    const { program, appPda, appAta, wallet } = await setUp({
        keypair: getKeypair('./deployer.json'),
        network: 'local',
        mintPubkey: MINT_PUBKEY,
    })

  const tx = await program.methods
    .initialize()
    .accounts({
      app: appPda,
      ata: appAta,
      mint: MINT_PUBKEY,
      signer: wallet.publicKey,
    })
    .rpc();

    console.log(tx)
    await program.provider.connection.confirmTransaction(tx)
}

main().then(() => {
    console.log('done')
})
