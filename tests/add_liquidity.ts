import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError, BN, web3 } from "@coral-xyz/anchor";
import { Remi } from "../target/types/remi";
import { expect } from "chai";
import {
  createMint,
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

describe("add_liquidity", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Remi as Program<Remi>;
  const wallet = (program.provider as anchor.AnchorProvider).wallet;
  let mintPubkey, appPda, appAta, fromAta, walletAta, bump;

  before(async () => {
    mintPubkey = await createMint(
      program.provider.connection,
      wallet.payer,
      wallet.payer.publicKey,
      null,
      9
    );

    walletAta = await createAssociatedTokenAccount(
      program.provider.connection,
      wallet.payer,
      mintPubkey,
      wallet.publicKey
    );

    const [_pda, _bump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("appata")],
      program.programId
    );
    appPda = _pda;
    bump = _bump;
    appAta = await getAssociatedTokenAddress(mintPubkey, appPda, true);

    const mintAmount = new BN(1000000 * web3.LAMPORTS_PER_SOL);
    const mintTx = await mintTo(
      program.provider.connection,
      wallet.payer,
      mintPubkey,
      walletAta,
      wallet.publicKey,
      mintAmount
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        app: appPda,
        ata: appAta,
        mint: mintPubkey,
        signer: wallet.publicKey,
      })
      .rpc();
  });

  it("should add liquidity", async () => {
    const solAmount = new BN(500 * web3.LAMPORTS_PER_SOL);
    const tokenAmount = new BN(500 * web3.LAMPORTS_PER_SOL);
    await program.methods
      .addLiquidity(solAmount, tokenAmount)
      .accounts({
        app: appPda,
        appAta: appAta,
        from: wallet.publicKey,
        fromAta: walletAta,
      })
      .rpc();
    {
      const app = await program.account.app.fetch(appPda);
      expect(app.mint.toString()).to.equal(mintPubkey.toString());
    }
  });

  it("should fail because of sender's insufficient SOL balance", async () => {
    try {
      const solAmount = new BN("1000000000000000000");
      const tokenAmount = new BN(500 * web3.LAMPORTS_PER_SOL);
      await program.methods
        .addLiquidity(solAmount, tokenAmount)
        .accounts({
          app: appPda,
          appAta: appAta,
          from: wallet.publicKey,
          fromAta: walletAta,
        })
        .rpc();
      throw new Error("should fail");
    } catch (e) {
      expect(e).to.be.instanceOf(AnchorError);
      const err: AnchorError = e;
      expect(err.error.errorCode.code).to.equal("SenderInsufficientBalance");
      expect(err.error.errorCode.number).to.equal(6001);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  it("should fail because of sender's insufficient token balance", async () => {
    try {
      const solAmount = new BN(500 * web3.LAMPORTS_PER_SOL);
      const tokenAmount = new BN("1000000000000000000");
      await program.methods
        .addLiquidity(solAmount, tokenAmount)
        .accounts({
          app: appPda,
          appAta: appAta,
          from: wallet.publicKey,
          fromAta: walletAta,
        })
        .rpc();
      throw new Error("should fail");
    } catch (e) {
      expect(e).to.be.instanceOf(AnchorError);
      const err: AnchorError = e;
      expect(err.error.errorCode.code).to.equal("SenderInsufficientBalance");
      expect(err.error.errorCode.number).to.equal(6001);
      expect(err.program.equals(program.programId)).is.true;
    }
  });
});
