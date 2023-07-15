import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError, BN, web3 } from "@coral-xyz/anchor";
import { Remi } from "../target/types/remi";
import { createAssociatedTokenAccountIdempotent } from "@solana/spl-token";
import { getKeypair, setUp, MINT_PUBKEY } from './utils'


const main = async () => {
    const { program, appPda, appAta, wallet } = await setUp({
        keypair: getKeypair('./user.json'),
        network: 'local',
        mintPubkey: MINT_PUBKEY,
    })

    const walletAta = await createAssociatedTokenAccountIdempotent(
      program.provider.connection,
      wallet.payer,
      MINT_PUBKEY,
      wallet.publicKey
    );

    const swapAmount = new BN(10 * web3.LAMPORTS_PER_SOL)

    const tx = await program.methods
        .swapTokenForSol(swapAmount)
        .accounts({
            app: appPda,
            appAta: appAta,
            sender: wallet.publicKey,
            senderAta: walletAta,
        })
        .rpc();

    console.log(tx)
    await program.provider.connection.confirmTransaction(tx)
    console.log('Swap success')

    const tokenAmount = await program.provider.connection.getTokenAccountBalance(walletAta)
    console.log(`Current token balance: ${tokenAmount.value.uiAmount}`)

    const lamportAmount = await program.provider.connection.getBalance(wallet.publicKey);
    console.log(
      `Current SOL balance: ${parseFloat(lamportAmount.toString()) / web3.LAMPORTS_PER_SOL}`
    );
}

main().then(() => {
    console.log('done')
})
