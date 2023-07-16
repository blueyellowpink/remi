import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError, BN, web3 } from "@coral-xyz/anchor";
import { Remi } from "../target/types/remi";
import {
  createAssociatedTokenAccountIdempotent,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { getKeypair, setUp, MINT_PUBKEY } from "./utils";

const main = async () => {
  let walletPubkey;
  if (!process.argv[2]) {
    const program = anchor.workspace.Remi as Program<Remi>;
    const [pda, _bump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("appata")],
      program.programId
    );
    walletPubkey = pda;
  } else {
    const [key, path] = process.argv[2].split("=");
    if (key != "keypair") {
      throw new Error("invalid arguments");
    }
    walletPubkey = getKeypair(path).publicKey;
  }

  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  const walletAta = await getAssociatedTokenAddressSync(
    MINT_PUBKEY,
    walletPubkey,
    true
  );

  console.log(`Address: ${walletPubkey}`);
  // check balance
  const tokenAmount = await connection.getTokenAccountBalance(walletAta);
  console.log(`Current token balance: ${tokenAmount.value.uiAmount}`);

  const lamportAmount = await connection.getBalance(walletPubkey);
  console.log(
    `Current SOL balance: ${
      parseFloat(lamportAmount.toString()) / web3.LAMPORTS_PER_SOL
    }`
  );
};

main().then(() => {
  console.log("done");
});
