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
  const indexes = [2, 3];
  indexes.forEach((index) => {
    try {
      const [key, value] = process.argv[index].split("=");
      amount[key] = parseFloat(value);
    } catch (e) {
      throw new Error("invalid arguments");
    }
  });
  if (!amount.sol || !amount.token) {
    throw new Error("invalid arguments");
  }
  let keypairPath;
  if (!process.argv[4]) {
    keypairPath = "./user.json";
  } else {
    const [key, path] = process.argv[4].split("=");
    if (key == "keypair") {
      keypairPath = path;
    }
  }

  // add liquidity
  const { program, appPda, appAta, wallet } = await setUp({
    keypair: getKeypair(keypairPath),
    network: "devnet",
    mintPubkey: MINT_PUBKEY,
  });

  const walletAta = await createAssociatedTokenAccountIdempotent(
    program.provider.connection,
    wallet.payer,
    MINT_PUBKEY,
    wallet.publicKey
  );

  const solAmount = new BN(amount.sol * web3.LAMPORTS_PER_SOL);
  const tokenAmount = new BN(amount.token * web3.LAMPORTS_PER_SOL);
  try {
    const tx = await program.methods
      .addLiquidity(solAmount, tokenAmount)
      .accounts({
        app: appPda,
        appAta: appAta,
        from: wallet.publicKey,
        fromAta: walletAta,
      })
      .rpc();
    console.log(tx);
    await program.provider.connection.confirmTransaction(tx);
  } catch (e) {
    const err: AnchorError = e;
    console.log(err.error.errorCode.code);
    process.exit(1);
  }

  // check balance
  const solBalance = await program.provider.connection.getBalance(appPda);
  const tokenBalance = await program.provider.connection.getTokenAccountBalance(
    appAta
  );
  console.log(
    `Amount of SOL in pool: ${
      parseFloat(solBalance.toString()) / web3.LAMPORTS_PER_SOL
    }`
  );
  console.log(`Amount of token in pool: ${tokenBalance.value.uiAmount}`);
};

main().then(() => {
  console.log("done");
});
