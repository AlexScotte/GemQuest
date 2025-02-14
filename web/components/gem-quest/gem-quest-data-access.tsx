'use client';

import { getGemQuestProgram, getGemQuestProgramId } from '@gem-quest/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useGemQuestProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getGemQuestProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getGemQuestProgram(provider);

  const accounts = useQuery({
    queryKey: ['gem-quest', 'all', { cluster }],
    queryFn: () => program.account.gemQuest.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['gem-quest', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ gemQuest: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useGemQuestProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useGemQuestProgram();

  const accountQuery = useQuery({
    queryKey: ['gem-quest', 'fetch', { cluster, account }],
    queryFn: () => program.account.gemQuest.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['gem-quest', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ gemQuest: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['gem-quest', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ gemQuest: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['gem-quest', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ gemQuest: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['gem-quest', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ gemQuest: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
