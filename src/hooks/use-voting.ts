"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, HOUSE_VOTING_ABI, HOUSE_REGISTRY_ABI, ERC20_ABI } from "@/lib/contracts";

export function useCastVote() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const castVote = (proposalId: number, support: boolean) => {
    writeContract({
      address: CONTRACTS.houseVoting,
      abi: HOUSE_VOTING_ABI,
      functionName: "castVote",
      args: [BigInt(proposalId), support],
    });
  };

  return {
    castVote,
    isPending,
    isConfirming,
    isSuccess,
    error,
    txHash: hash,
  };
}

export function useJoinHouse() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approveAndJoin = async (houseId: number) => {
    // Step 1: Approve USDC spend
    writeContract({
      address: CONTRACTS.usdc,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [CONTRACTS.houseRegistry, BigInt(10_000_000)], // 10 USDC (6 decimals)
    });

    // Step 2 would be called after approval confirmation
    // For now this is a simplified version
  };

  const joinHouse = (houseId: number) => {
    writeContract({
      address: CONTRACTS.houseRegistry,
      abi: HOUSE_REGISTRY_ABI,
      functionName: "joinHouse",
      args: [BigInt(houseId)],
    });
  };

  return {
    approveAndJoin,
    joinHouse,
    isPending,
    isConfirming,
    isSuccess,
    error,
    txHash: hash,
  };
}

export function useVoteForLeader() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const voteForLeader = (houseId: number, candidate: `0x${string}`) => {
    writeContract({
      address: CONTRACTS.houseVoting,
      abi: HOUSE_VOTING_ABI,
      functionName: "voteForLeader",
      args: [BigInt(houseId), candidate],
    });
  };

  return {
    voteForLeader,
    isPending,
    isConfirming,
    isSuccess,
    error,
    txHash: hash,
  };
}
