"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import {
  getHouseById,
  getProposalsByHouse,
  getMembersByHouse,
} from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IdeologyChart } from "@/components/houses/ideology-chart";
import { ProposalCard } from "@/components/houses/proposal-card";
import { MemberList } from "@/components/houses/member-list";
import { formatUSDC, shortenAddress } from "@/lib/utils";
import { Users, Coins, Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HouseDetailPage() {
  const params = useParams();
  const houseId = Number(params.id);
  const house = getHouseById(houseId);

  if (!house) {
    notFound();
  }

  const proposals = getProposalsByHouse(houseId);
  const members = getMembersByHouse(houseId);
  const activeProposals = proposals.filter((p) => p.status === "active");
  const pastProposals = proposals.filter((p) => p.status !== "active");

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/houses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Houses
      </Link>

      {/* House Header */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{house.emoji}</span>
            <h1 className="text-3xl font-bold">{house.name}</h1>
          </div>
          <p className="text-muted-foreground mb-6">{house.description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{house.memberCount}</strong> members
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{formatUSDC(house.treasuryBalance)}</strong> treasury
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono">
                {shortenAddress(house.leader)}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Button style={{ backgroundColor: house.color }}>
              Join {house.name}
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <IdeologyChart
            scores={house.ideologyScores}
            color={house.color}
            size="md"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="proposals" className="w-full">
        <TabsList>
          <TabsTrigger value="proposals">
            Proposals ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value="members">
            Members ({members.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="mt-6">
          {activeProposals.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Active Proposals</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {activeProposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            </div>
          )}
          {pastProposals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Past Proposals</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {pastProposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            </div>
          )}
          {proposals.length === 0 && (
            <p className="text-muted-foreground py-8 text-center">
              No proposals yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">House Members</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberList members={members} leader={house.leader} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
