import fs from 'fs'

import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError, BN, web3 } from "@coral-xyz/anchor";
import { Remi } from "../target/types/remi";
import { getAssociatedTokenAddress } from "@solana/spl-token";

export const MINT_PUBKEY = new web3.PublicKey("C4x2rucnVjC7cTcd8ysYhb2k74Y9h4QGNp2pF2ArGiCT")

export const getKeypair = (path: string): web3.Keypair => {
    const secretKey = Uint8Array.from(
        JSON.parse(fs.readFileSync(path) as unknown as string)
    )
    return web3.Keypair.fromSecretKey(secretKey)
}

export const setUp = async ({ keypair, network, mintPubkey }) => {
    const wallet = new anchor.Wallet(keypair)
    let connection
    if (network == 'devnet') {
        connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed')
    } else {
        connection = new web3.Connection('http://localhost:8899', 'confirmed')
    }
    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' })
    anchor.setProvider(provider);

    const program = anchor.workspace.Remi as Program<Remi>;
    const [pda, _bump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("appata")],
      program.programId
    );
    const appAta = await getAssociatedTokenAddress(mintPubkey, pda, true);
    return { program, wallet, appPda: pda, appAta }
}

export const requestAirdrop = async ({ connection, publicKey }) => {
    try {
        const signature = await connection.requestAirdrop(
            publicKey,
            web3.LAMPORTS_PER_SOL * 4
        )
        await connection.confirmTransaction(signature)
    } catch (err) {
        console.error(err)
    }
}
