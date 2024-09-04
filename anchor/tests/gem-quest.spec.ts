import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { GemQuest } from '../target/types/gem_quest';

describe('gem-quest', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.GemQuest as Program<GemQuest>;

  const gemQuestKeypair = Keypair.generate();

  it('Initialize GemQuest', async () => {
    await program.methods
      .initialize()
      .accounts({
        gemQuest: gemQuestKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([gemQuestKeypair])
      .rpc();

    const currentCount = await program.account.gemQuest.fetch(
      gemQuestKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment GemQuest', async () => {
    await program.methods
      .increment()
      .accounts({ gemQuest: gemQuestKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.gemQuest.fetch(
      gemQuestKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment GemQuest Again', async () => {
    await program.methods
      .increment()
      .accounts({ gemQuest: gemQuestKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.gemQuest.fetch(
      gemQuestKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement GemQuest', async () => {
    await program.methods
      .decrement()
      .accounts({ gemQuest: gemQuestKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.gemQuest.fetch(
      gemQuestKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set gemQuest value', async () => {
    await program.methods
      .set(42)
      .accounts({ gemQuest: gemQuestKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.gemQuest.fetch(
      gemQuestKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the gemQuest account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        gemQuest: gemQuestKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.gemQuest.fetchNullable(
      gemQuestKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
