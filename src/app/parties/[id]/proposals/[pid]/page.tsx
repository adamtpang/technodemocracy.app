"use client";

import { useParams, notFound } from "next/navigation";
import { useState } from "react";
import { getProposalById, getPartyById } from "@/lib/mock-data";
import { useIsMember } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VoteButtons } from "@/components/voting/vote-buttons";
import { VoteProgress } from "@/components/voting/vote-progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { shortenAddress } from "@/lib/utils";
import { IVotedCard } from "@/components/parties/i-voted-card";
import {
  ArrowLeft, Clock, CheckCircle2, XCircle, ExternalLink, Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function ProposalDetailPage() {
  const params = useParams();
  const proposalId = Number(params.pid);
  const partyId = Number(params.id);
  const proposal = getProposalById(proposalId);
  const party = getPartyById(partyId);
  const isMember = useIsMember(partyId);

  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<boolean | undefined>();
  const [mintedTokenId] = useState(() => Math.floor(Math.random() * 9000) + 5000);

  if (!proposal || !party) notFound();

  const isActive = proposal.status === "active";
  const statusConfig = {
    active: { label: "Streaming", icon: Clock, color: "text-blue-400" },
    passed: { label: "Passed", icon: CheckCircle2, color: "text-green-400" },
    failed: { label: "Failed", icon: XCircle, color: "text-red-400" },
  };
  const status = statusConfig[proposal.status];
  const StatusIcon = status.icon;

  const handleVote = (support: boolean) => {
    setHasVoted(true);
    setUserVote(support);
  };

  const endDate = new Date(proposal.endTime);
  const now = new Date();
  const timeLeft = endDate.getTime() - now.getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const daysLeft = Math.floor(hoursLeft / 24);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href={`/parties/${partyId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {party.name}
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{party.emoji}</span>
          <Link href={`/parties/${partyId}`} className="text-xs text-muted-foreground hover:text-foreground">
            {party.name}
          </Link>
        </div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">{proposal.title}</h1>
          <Badge variant="secondary" className="shrink-0 gap-1">
            <StatusIcon className={`h-3 w-3 ${status.color}`} />
            {status.label}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>Proposed by <span className="font-mono">{shortenAddress(proposal.author)}</span></span>
          {isActive && (
            <span>{daysLeft > 0 ? `${daysLeft}d ${hoursLeft % 24}h left` : `${hoursLeft}h left`}</span>
          )}
          <span className="text-xs">{proposal.yesVotes + proposal.noVotes} streaming votes onchain</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{proposal.description}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Streaming Results</CardTitle>
          <p className="text-xs text-muted-foreground">Every vote is registered onchain the moment it&apos;s cast.</p>
        </CardHeader>
        <CardContent>
          <VoteProgress
            yesVotes={proposal.yesVotes + (hasVoted && userVote ? 1 : 0)}
            noVotes={proposal.noVotes + (hasVoted && !userVote ? 1 : 0)}
          />
        </CardContent>
      </Card>

      {isActive && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Cast Your Vote</CardTitle>
            <p className="text-xs text-muted-foreground">
              Casting mints your &quot;I Voted&quot; NFT to your wallet — a cryptographically verifiable receipt.
            </p>
          </CardHeader>
          <CardContent>
            {!isMember ? (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  You must hold the franchise of {party.name} to vote on this proposal.
                </p>
                <Link href={`/parties/${partyId}`}>
                  <Button size="sm" style={{ backgroundColor: party.color }}>Grant Franchise & Join</Button>
                </Link>
              </div>
            ) : hasVoted ? (
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2" style={{ color: party.color }} />
                <p className="text-sm font-semibold mb-1">
                  {userVote ? "Voted YES" : "Voted NO"} — registered onchain.
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Your soulbound &quot;I Voted&quot; NFT has been minted.
                </p>
                <div className="flex justify-center">
                  <IVotedCard
                    party={party}
                    tokenId={mintedTokenId}
                    size="md"
                  />
                </div>
                <a
                  href={`https://sepolia.basescan.org/token/0x0000000000000000000000000000000000000000?a=${mintedTokenId}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-3"
                >
                  View on Basescan <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ) : (
              <VoteButtons onVote={handleVote} disabled={!isMember} hasVoted={hasVoted} userVote={userVote} />
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Onchain Vote Receipts
            <span className="text-sm font-normal text-muted-foreground ml-2">({proposal.voters.length})</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Each row is an &quot;I Voted&quot; NFT minted to a real wallet. Cryptographically verifiable.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {proposal.voters.map((voter, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">{voter.address.slice(2, 4).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm font-mono">{shortenAddress(voter.address)}</span>
                    <p className="text-[10px] text-muted-foreground">NFT #{voter.nftTokenId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={voter.support ? "default" : "destructive"} className="text-xs">
                    {voter.support ? "Yes" : "No"}
                  </Badge>
                  <a href={`https://sepolia.basescan.org/tx/${voter.txHash}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
