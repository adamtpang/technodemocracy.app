import { type Address } from "viem";

// Contract addresses — update after deployment
export const CONTRACTS = {
  houseRegistry: (process.env.NEXT_PUBLIC_HOUSE_REGISTRY_ADDRESS ||
    "0x0000000000000000000000000000000000000000") as Address,
  houseVoting: (process.env.NEXT_PUBLIC_HOUSE_VOTING_ADDRESS ||
    "0x0000000000000000000000000000000000000000") as Address,
  houseTreasury: (process.env.NEXT_PUBLIC_HOUSE_TREASURY_ADDRESS ||
    "0x0000000000000000000000000000000000000000") as Address,
  usdc: (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
    "0x0000000000000000000000000000000000000000") as Address,
} as const;

// Minimal ABIs for the hooks — expand after contract compilation
export const HOUSE_REGISTRY_ABI = [
  {
    type: "function",
    name: "getHouseCount",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "houses",
    inputs: [{ type: "uint256" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "createdAt", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "joinHouse",
    inputs: [{ name: "houseId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "leaveHouse",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getHouseMembers",
    inputs: [{ name: "houseId", type: "uint256" }],
    outputs: [{ type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMemberHouse",
    inputs: [{ name: "member", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const HOUSE_VOTING_ABI = [
  {
    type: "function",
    name: "castVote",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "support", type: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getProposalResult",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "yesVotes", type: "uint256" },
      { name: "noVotes", type: "uint256" },
      { name: "ended", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "voteForLeader",
    inputs: [
      { name: "houseId", type: "uint256" },
      { name: "candidate", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "VoteCast",
    inputs: [
      { name: "voter", type: "address", indexed: true },
      { name: "proposalId", type: "uint256", indexed: true },
      { name: "support", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "LeaderVoteChanged",
    inputs: [
      { name: "voter", type: "address", indexed: true },
      { name: "houseId", type: "uint256", indexed: true },
      { name: "newLeader", type: "address", indexed: false },
    ],
  },
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;
