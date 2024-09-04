// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import GemQuestIDL from '../target/idl/gem_quest.json';
import type { GemQuest } from '../target/types/gem_quest';

// Re-export the generated IDL and type
export { GemQuest, GemQuestIDL };

// The programId is imported from the program IDL.
export const GEM_QUEST_PROGRAM_ID = new PublicKey(GemQuestIDL.address);

// This is a helper function to get the GemQuest Anchor program.
export function getGemQuestProgram(provider: AnchorProvider) {
  return new Program(GemQuestIDL as GemQuest, provider);
}

// This is a helper function to get the program ID for the GemQuest program depending on the cluster.
export function getGemQuestProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return GEM_QUEST_PROGRAM_ID;
  }
}
