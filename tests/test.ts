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

describe("remi", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.local());

  const program = anchor.workspace.Remi as Program<Remi>;
  const wallet = (program.provider as anchor.AnchorProvider).wallet;
  let mintPubkey, appPda, appAta, fromAta, walletAta;

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

    appPda = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("appata")],
      program.programId
    )[0];
    appAta = await getAssociatedTokenAddress(mintPubkey, appPda, true);

    const mintAmount = new BN(1000 * web3.LAMPORTS_PER_SOL);
    const mintTx = await mintTo(
      program.provider.connection,
      wallet.payer,
      mintPubkey,
      walletAta,
      wallet.publicKey,
      mintAmount
    );
  });

  it("should fail while initializing app with a uninitialized mint", async () => {
    const mintPubkey = web3.Keypair.generate().publicKey;
    const [appPda, _] = web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("appata")],
      program.programId
    );
    const appAta = await getAssociatedTokenAddress(mintPubkey, appPda, true);
    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          app: appPda,
          ata: appAta,
          mint: mintPubkey,
          signer: wallet.publicKey,
        })
        .rpc();
    } catch (e) {
      expect(e).to.be.instanceOf(AnchorError);
      const err: AnchorError = e;
      expect(err.error.errorCode.code).to.equal("AccountNotInitialized");
      expect(err.error.errorCode.number).to.equal(3012);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  it("should succeed while initializing app with a initialized mint", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        app: appPda,
        ata: appAta,
        mint: mintPubkey,
        signer: wallet.publicKey,
      })
      .rpc();

    const app = await program.account.app.fetch(appPda);
    expect(app.mint.toString()).to.equal(mintPubkey.toString());
    expect(app.ata.toString()).to.equal(appAta.toString());
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

  it("should fail adding liquidity because of sender's insufficient SOL balance", async () => {
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

  it("should fail adding liquidity because of sender's insufficient token balance", async () => {
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

  it("should fail because of app's insufficient balance", async () => {
    try {
      const swapAmount = new BN(1000000 * web3.LAMPORTS_PER_SOL);
      await program.methods
        .swapSolForToken(swapAmount)
        .accounts({
          app: appPda,
          appAta: appAta,
          sender: wallet.publicKey,
          senderAta: walletAta,
        })
        .rpc();
      throw new Error("should fail");
    } catch (e) {
      expect(e).to.be.instanceOf(AnchorError);
      const err: AnchorError = e;
      expect(err.error.errorCode.code).to.equal("AppInsufficientBalance");
      expect(err.error.errorCode.number).to.equal(6002);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  it("should fail because of sender's insufficient balance", async () => {
    try {
      const swapAmount = new BN("1000000000000000000");
      await program.methods
        .swapSolForToken(swapAmount)
        .accounts({
          app: appPda,
          appAta: appAta,
          sender: wallet.publicKey,
          senderAta: walletAta,
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

  it("should swap sol for token", async () => {
    {
      const appAtaBalance =
        await program.provider.connection.getTokenAccountBalance(appAta);
      expect(appAtaBalance.value.uiAmount).to.equal(500);

      const senderAtaBalance =
        await program.provider.connection.getTokenAccountBalance(walletAta);
      expect(senderAtaBalance.value.uiAmount).to.equal(500);
    }
    const swapAmount = new BN(1 * web3.LAMPORTS_PER_SOL);
    await program.methods
      .swapSolForToken(swapAmount)
      .accounts({
        app: appPda,
        appAta: appAta,
        sender: wallet.publicKey,
        senderAta: walletAta,
      })
      .rpc();

    {
      const appAtaBalance =
        await program.provider.connection.getTokenAccountBalance(appAta);
      expect(appAtaBalance.value.uiAmount).to.equal(490);

      const senderAtaBalance =
        await program.provider.connection.getTokenAccountBalance(walletAta);
      expect(senderAtaBalance.value.uiAmount).to.equal(510);
    }
  });
});
