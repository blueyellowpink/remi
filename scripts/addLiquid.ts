import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError, BN, web3 } from "@coral-xyz/anchor";
import { Remi } from "../target/types/remi";
import { createAssociatedTokenAccountIdempotent } from "@solana/spl-token";

import { getKeypair, setUp, MINT_PUBKEY } from './utils'

const main = async () => {
    const { program, appPda, appAta, wallet } = await setUp({
        keypair: getKeypair('./deployer.json'),
        network: 'local',
        mintPubkey: MINT_PUBKEY,
    })

    const walletAta = await createAssociatedTokenAccountIdempotent(
      program.provider.connection,
      wallet.payer,
      MINT_PUBKEY,
      wallet.publicKey
    );

    const solAmount = new BN(500 * web3.LAMPORTS_PER_SOL);
    const tokenAmount = new BN(500 * web3.LAMPORTS_PER_SOL);
  const tx = await program.methods
    .addLiquidity(solAmount, tokenAmount)
    .accounts({
      app: appPda,
      appAta: appAta,
      from: wallet.publicKey,
      fromAta: walletAta,
    })
    .rpc();

    console.log(tx)
    await program.provider.connection.confirmTransaction(tx)
}

main().then(() => {
    console.log('done')
})
