"use client";

import {
  getHouseById,
  getProposalsByHouse,
  CURRENT_USER_ADDRESS,
  CURRENT_USER_HOUSE_ID,
  CURRENT_USER_STAKE,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";
import {
  Users,
  Coins,
  Vote,
  LogOut,
  ExternalLink,
  Copy,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const house = getHouseById(CURRENT_USER_HOUSE_ID);
  const proposals = house ? getProposalsByHouse(CURRENT_USER_HOUSE_ID) : [];
  const [copied, setCopied] = useState(false);

  const userVotes = proposals.flatMap((p) =>
    p.voters
      .filter((v) => v.address === CURRENT_USER_ADDRESS)
      .map((v) => ({
        proposalId: p.id,
        proposalTitle: p.title,
        houseId: p.houseId,
        support: v.support,
        txHash: v.txHash,
      }))
  );

  const copyAddress = () => {
    navigator.clipboard.writeText(CURRENT_USER_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      {/* Wallet Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm">
              {shortenAddress(CURRENT_USER_ADDRESS, 8)}
            </span>
            <button
              onClick={copyAddress}
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* House Membership */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            House Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          {house ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{house.emoji}</span>
                  <Link
                    href={`/houses/${house.id}`}
                    className="font-semibold hover:underline"
                  >
                    {house.name}
                  </Link>
                </div>
                <Badge variant="secondary">Member</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="h-4 w-4" />
                <span>
                  Staked: <strong>{CURRENT_USER_STAKE} USDC</strong>
                </span>
              </div>
              <Button variant="destructive" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                Leave House
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                You haven't joined a house yet.
              </p>
              <Link href="/join-quiz">
                <Button>Find Your House</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vote History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Vote History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userVotes.length > 0 ? (
            <div className="space-y-3">
              {userVotes.map((vote, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <Link
                      href={`/houses/${vote.houseId}/proposals/${vote.proposalId}`}
                      className="text-sm hover:underline"
                    >
                      {vote.proposalTitle}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={vote.support ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {vote.support ? "Yes" : "No"}
                    </Badge>
                    <a
                      href={`https://sepolia.basescan.org/tx/${vote.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-4 text-center">
              No votes yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
