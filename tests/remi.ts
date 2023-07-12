import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError } from "@coral-xyz/anchor";
import { Remi } from "../target/types/remi";
import { expect } from "chai";
import {
  createMint,
  createAssociatedTokenAccount,
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
    const mintPubkey = anchor.web3.Keypair.generate().publicKey;
    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          app: appKeypair.publicKey,
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

  it("should succeed while initializing app with a initialized mint", async () => {
    const appKeypair = anchor.web3.Keypair.generate();
    const tx = await program.methods
      .initialize()
      .accounts({
        app: appKeypair.publicKey,
        mint: mintPubkey,
        signer: wallet.publicKey,
      })
      .signers([appKeypair])
      .rpc();

    const app = await program.account.app.fetch(appKeypair.publicKey);
    expect(app.mint.toString()).to.equal(mintPubkey.toString());
  });
});
