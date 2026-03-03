"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useState } from "react";
import { getProposalById, getHouseById, CURRENT_USER_HOUSE_ID } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButtons } from "@/components/voting/vote-buttons";
import { VoteProgress } from "@/components/voting/vote-progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { shortenAddress } from "@/lib/utils";
import { ArrowLeft, Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ProposalDetailPage() {
  const params = useParams();
  const proposalId = Number(params.pid);
  const houseId = Number(params.id);
  const proposal = getProposalById(proposalId);
  const house = getHouseById(houseId);

  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<boolean | undefined>();

  if (!proposal || !house) {
    notFound();
  }

  const isMember = CURRENT_USER_HOUSE_ID === houseId;
  const isActive = proposal.status === "active";

  const statusConfig = {
    active: { label: "Active", icon: Clock, color: "text-blue-400" },
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
      <Link
        href={`/houses/${houseId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {house.name}
      </Link>

      {/* Proposal Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">{proposal.title}</h1>
          <Badge variant="secondary" className="shrink-0 gap-1">
            <StatusIcon className={`h-3 w-3 ${status.color}`} />
            {status.label}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Proposed by{" "}
            <span className="font-mono">{shortenAddress(proposal.author)}</span>
          </span>
          {isActive && (
            <span>
              {daysLeft > 0
                ? `${daysLeft}d ${hoursLeft % 24}h left`
                : `${hoursLeft}h left`}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{proposal.description}</p>
        </CardContent>
      </Card>

      {/* Vote Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Results</CardTitle>
        </CardHeader>
        <CardContent>
          <VoteProgress
            yesVotes={proposal.yesVotes + (hasVoted && userVote ? 1 : 0)}
            noVotes={proposal.noVotes + (hasVoted && !userVote ? 1 : 0)}
          />
        </CardContent>
      </Card>

      {/* Vote Action */}
      {isActive && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Cast Your Vote</CardTitle>
          </CardHeader>
          <CardContent>
            {!isMember ? (
              <p className="text-sm text-muted-foreground">
                You must be a member of {house.name} to vote on this proposal.
              </p>
            ) : (
              <VoteButtons
                onVote={handleVote}
                disabled={!isMember}
                hasVoted={hasVoted}
                userVote={userVote}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Vote History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vote History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {proposal.voters.map((voter, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {voter.address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-mono">
                    {shortenAddress(voter.address)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={voter.support ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {voter.support ? "Yes" : "No"}
                  </Badge>
                  <a
                    href={`https://sepolia.basescan.org/tx/${voter.txHash}`}
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
        </CardContent>
      </Card>
    </div>
  );
}
