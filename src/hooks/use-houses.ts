"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS, HOUSE_REGISTRY_ABI } from "@/lib/contracts";
import { houses as mockHouses, getHouseById as mockGetHouseById } from "@/lib/mock-data";

// For MVP: return mock data, but set up the hooks structure
// for when contracts are deployed

const USE_MOCK = true;

export function useHouses() {
  // When contracts are deployed, uncomment:
  // const { data: count } = useReadContract({
  //   address: CONTRACTS.houseRegistry,
  //   abi: HOUSE_REGISTRY_ABI,
  //   functionName: "getHouseCount",
  // });

  if (USE_MOCK) {
    return {
      houses: mockHouses,
      isLoading: false,
      error: null,
    };
  }

  return {
    houses: [],
    isLoading: false,
    error: null,
  };
}

export function useHouseDetail(id: number) {
  if (USE_MOCK) {
    const house = mockGetHouseById(id);
    return {
      house,
      isLoading: false,
      error: null,
    };
  }

  return {
    house: undefined,
    isLoading: false,
    error: null,
  };
}
