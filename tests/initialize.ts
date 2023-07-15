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

// describe("initialize", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());
//
//   const program = anchor.workspace.Remi as Program<Remi>;
//   const wallet = (program.provider as anchor.AnchorProvider).wallet;
//
//   it("should fail while initializing app with a uninitialized mint", async () => {
//     const mintPubkey = web3.Keypair.generate().publicKey;
//     const [appPda, _] = web3.PublicKey.findProgramAddressSync(
//       [anchor.utils.bytes.utf8.encode("appata")],
//       program.programId
//     );
//     const appAta = await getAssociatedTokenAddress(mintPubkey, appPda, true);
//     try {
//       const tx = await program.methods
//         .initialize()
//         .accounts({
//           app: appPda,
//           ata: appAta,
//           mint: mintPubkey,
//           signer: wallet.publicKey,
//         })
//         .rpc();
//     } catch (e) {
//       expect(e).to.be.instanceOf(AnchorError);
//       const err: AnchorError = e;
//       expect(err.error.errorCode.code).to.equal("AccountNotInitialized");
//       expect(err.error.errorCode.number).to.equal(3012);
//       expect(err.program.equals(program.programId)).is.true;
//     }
//   });
//
//   it("should succeed while initializing app with a initialized mint", async () => {
//     const mintPubkey = await createMint(
//       program.provider.connection,
//       wallet.payer,
//       wallet.payer.publicKey,
//       null,
//       9
//     );
//     const [appPda, _] = web3.PublicKey.findProgramAddressSync(
//       [anchor.utils.bytes.utf8.encode("appata")],
//       program.programId
//     );
//     const appAta = await getAssociatedTokenAddress(mintPubkey, appPda, true);
//     const tx = await program.methods
//       .initialize()
//       .accounts({
//         app: appPda,
//         ata: appAta,
//         mint: mintPubkey,
//         signer: wallet.publicKey,
//       })
//       .rpc();
//
//     const app = await program.account.app.fetch(appPda);
//     expect(app.mint.toString()).to.equal(mintPubkey.toString());
//     expect(app.ata.toString()).to.equal(appAta.toString());
//   });
// });
