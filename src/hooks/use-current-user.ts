"use client";

import { useAccount } from "wagmi";
import {
  DEMO_USER_ADDRESS,
  getUserGrants,
  getNFTsByAddress,
  type UserGrant,
  type IVotedNFT,
} from "@/lib/mock-data";

export interface CurrentUser {
  address: string;
  isConnected: boolean;
  isDemo: boolean;
  grants: UserGrant[];
  nfts: IVotedNFT[];
}

export function useCurrentUser(): CurrentUser {
  const { address, isConnected } = useAccount();
  const effective = (address ?? DEMO_USER_ADDRESS) as string;
  return {
    address: effective,
    isConnected: !!isConnected,
    isDemo: !isConnected,
    grants: getUserGrants(effective),
    nfts: getNFTsByAddress(effective),
  };
}

export function useIsMember(partyId: number): boolean {
  const { grants } = useCurrentUser();
  return grants.some((g) => g.partyId === partyId);
}
