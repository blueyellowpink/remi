import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError, BN, web3 } from "@coral-xyz/anchor";
import { Remi } from "../target/types/remi";
import { createAssociatedTokenAccountIdempotent } from "@solana/spl-token";
import { getKeypair, setUp, MINT_PUBKEY } from "./utils";

const main = async () => {
  // parse arguments
  const amount = {
    sol: null,
    token: null,
  };
  const [key, value] = process.argv[2].split("=");
  if ((key != "sol" && key != "token") || !value) {
    throw new Error("invalid arguments");
  }
  amount[key] = parseFloat(value);

  // swap
  const { program, appPda, appAta, wallet } = await setUp({
    keypair: getKeypair("./user.json"),
    network: "devnet",
    mintPubkey: MINT_PUBKEY,
  });

  const walletAta = await createAssociatedTokenAccountIdempotent(
    program.provider.connection,
    wallet.payer,
    MINT_PUBKEY,
    wallet.publicKey
  );

  let tx;
  try {
    if (key == "sol") {
      const swapAmount = new BN(amount.sol * web3.LAMPORTS_PER_SOL);
      tx = await program.methods
        .swapSolForToken(swapAmount)
        .accounts({
          app: appPda,
          appAta: appAta,
          sender: wallet.publicKey,
          senderAta: walletAta,
        })
        .rpc();
    } else {
      const swapAmount = new BN(amount.token * web3.LAMPORTS_PER_SOL);
      tx = await program.methods
        .swapTokenForSol(swapAmount)
        .accounts({
          app: appPda,
          appAta: appAta,
          sender: wallet.publicKey,
          senderAta: walletAta,
        })
        .rpc();
    }
  } catch (e) {
    const err: AnchorError = e;
    console.log(err.error.errorCode.code);
    process.exit(1);
  }
  console.log(tx);
  await program.provider.connection.confirmTransaction(tx);
  console.log("Swap success");

  // check balance
  const tokenAmount = await program.provider.connection.getTokenAccountBalance(
    walletAta
  );
  console.log(`Current token balance: ${tokenAmount.value.uiAmount}`);

  const lamportAmount = await program.provider.connection.getBalance(
    wallet.publicKey
  );
  console.log(
    `Current SOL balance: ${
      parseFloat(lamportAmount.toString()) / web3.LAMPORTS_PER_SOL
    }`
  );
};

main().then(() => {
  console.log("done");
});
