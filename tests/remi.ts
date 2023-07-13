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
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Remi as Program<Remi>;
  const wallet = (program.provider as anchor.AnchorProvider).wallet;

  it("should fail while initializing app with a uninitialized mint", async () => {
    const appKeypair = anchor.web3.Keypair.generate();
    const appAta = anchor.web3.Keypair.generate().publicKey;
    const mintPubkey = anchor.web3.Keypair.generate().publicKey;
    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          app: appKeypair.publicKey,
          ata: appAta,
          mint: mintPubkey,
          signer: wallet.publicKey,
        })
        .signers([appKeypair])
        .rpc();
    } catch (e) {
      expect(e).to.be.instanceOf(AnchorError);
      const err: AnchorError = e;
      expect(err.error.errorCode.code).to.equal("AccountNotInitialized");
      expect(err.error.errorCode.number).to.equal(3012);
      expect(err.program.equals(program.programId)).is.true;
    }
  });

  let mintPubkey;
  it("should initialize a mint", async () => {
    mintPubkey = await createMint(
      program.provider.connection,
      wallet.payer,
      wallet.payer.publicKey,
      null,
      0
    );
  });

  let appAta;
  let appKeypair;
  it("should succeed while initializing app with a initialized mint", async () => {
    appKeypair = anchor.web3.Keypair.generate();
    appAta = await getAssociatedTokenAddress(
      mintPubkey,
      appKeypair.publicKey,
      true
    );
    const tx = await program.methods
      .initialize()
      .accounts({
        app: appKeypair.publicKey,
        ata: appAta,
        mint: mintPubkey,
        signer: wallet.publicKey,
      })
      .signers([appKeypair])
      .rpc();

    const app = await program.account.app.fetch(appKeypair.publicKey);
    expect(app.mint.toString()).to.equal(mintPubkey.toString());
    // expect(app.ata.toString()).to.equal(appAta.toString());
  });

  it("should add liquidity", async () => {
    const fromAta = await createAssociatedTokenAccount(
      program.provider.connection,
      wallet.payer,
      mintPubkey,
      wallet.publicKey
    );
    const mintAmount = new BN(1000);
    const mintTx = await mintTo(
      program.provider.connection,
      wallet.payer,
      mintPubkey,
      fromAta,
      wallet.publicKey,
      mintAmount
    );

    const solAmount = new BN(100 * web3.LAMPORTS_PER_SOL);
    const tokenAmount = new BN(500);
    const tx = await program.methods
      .addLiquidity(solAmount, tokenAmount)
      .accounts({
        app: appKeypair.publicKey,
        from: wallet.publicKey,
        fromAta: fromAta,
        toAta: appAta,
      })
      .rpc();

    const appAtaBalance =
      await program.provider.connection.getTokenAccountBalance(appAta);
    expect(appAtaBalance.value.amount).to.equal(tokenAmount.toString());

    const appBalance = await program.provider.connection.getBalance(
      appKeypair.publicKey
    );
    expect(appBalance).to.gt(100 * web3.LAMPORTS_PER_SOL);
  });
});
