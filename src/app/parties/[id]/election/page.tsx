"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import {
  getPartyById, getActiveElection, getElectionsForParty,
} from "@/lib/mock-data";
import { useIsMember } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { shortenAddress } from "@/lib/utils";
import {
  ArrowLeft, Vote, Crown, Sparkles, CheckCircle2, Calendar, Trophy,
} from "lucide-react";
import Link from "next/link";

export default function ElectionPage() {
  const params = useParams();
  const partyId = Number(params.id);
  const party = getPartyById(partyId);
  const isMember = useIsMember(partyId);
  const [voted, setVoted] = useState<string | null>(null);

  if (!party) notFound();

  const active = getActiveElection(partyId);
  const past = getElectionsForParty(partyId).filter((e) => e.finalized);
  const totalVotes = active ? active.candidates.reduce((s, c) => s + c.voteCount, 0) : 0;
  const now = Date.now();
  const endsIn = active ? Math.max(0, new Date(active.endTime).getTime() - now) : 0;
  const daysLeft = Math.floor(endsIn / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((endsIn / (1000 * 60 * 60)) % 24);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/parties/${partyId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {party.name}
      </Link>

      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <Badge variant="outline" className="mb-2 gap-1.5">
            <Vote className="h-3 w-3" />
            Presidential Election
          </Badge>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span>{party.emoji}</span>
            {party.name} Election
          </h1>
        </div>
      </div>

      {active ? (
        <>
          <Card className="mb-6 border-2" style={{ borderColor: party.color + "60" }}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" style={{ color: party.color }} />
                  Streaming Election
                </CardTitle>
                <Badge variant="outline" style={{ borderColor: party.color, color: party.color }}>
                  {daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h left` : `${hoursLeft}h left`}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Each member casts a single vote. Tally streams onchain. Winner takes the presidency the moment the window closes.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="rounded border bg-muted/30 py-2">
                  <div className="text-lg font-bold">{active.candidates.length}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">Candidates</div>
                </div>
                <div className="rounded border bg-muted/30 py-2">
                  <div className="text-lg font-bold">{totalVotes.toLocaleString()}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">Votes Cast</div>
                </div>
                <div className="rounded border bg-muted/30 py-2">
                  <div className="text-lg font-bold">
                    {Math.round((totalVotes / Math.max(1, party.memberCount)) * 100)}%
                  </div>
                  <div className="text-[10px] uppercase text-muted-foreground">Turnout</div>
                </div>
              </div>

              <div className="space-y-4">
                {active.candidates.slice().sort((a, b) => b.voteCount - a.voteCount).map((c, i) => {
                  const pct = totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0;
                  const youVoted = voted === c.address;
                  const isIncumbent = c.address === party.president;
                  return (
                    <div
                      key={c.address}
                      className="rounded-lg border p-4"
                      style={youVoted ? { borderColor: party.color, borderWidth: 2 } : undefined}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xs" style={i === 0 ? { backgroundColor: party.color + "20", color: party.color } : undefined}>
                            {c.address.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-mono text-sm">{shortenAddress(c.address)}</span>
                            {isIncumbent && (
                              <Badge variant="outline" className="text-[10px] gap-1">
                                <Crown className="h-2.5 w-2.5" />Incumbent
                              </Badge>
                            )}
                            {i === 0 && (
                              <Badge className="text-[10px]" style={{ backgroundColor: party.color, color: "white" }}>Leading</Badge>
                            )}
                            {youVoted && (
                              <Badge variant="secondary" className="text-[10px] gap-1">
                                <CheckCircle2 className="h-2.5 w-2.5" />Your Vote
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground italic mb-3">&ldquo;{c.manifesto}&rdquo;</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{c.voteCount.toLocaleString()} votes</span>
                              <span className="font-semibold">{pct.toFixed(1)}%</span>
                            </div>
                            <Progress value={pct} className="h-2" />
                          </div>
                        </div>
                        {isMember && !voted && (
                          <Button size="sm" style={{ backgroundColor: party.color }} onClick={() => setVoted(c.address)}>
                            Vote
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isMember && (
                <div className="mt-4 rounded border border-dashed p-3 text-center text-xs text-muted-foreground">
                  Only members of {party.name} can vote in this election.{" "}
                  <Link href={`/parties/${partyId}`} className="text-foreground hover:underline">
                    Grant the franchise →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {isMember && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Run for President</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Any member can declare candidacy before the election window closes.
                </p>
              </CardHeader>
              <CardContent>
                <textarea
                  rows={3} placeholder="Your manifesto. What will you do as president?"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <Button className="mt-3 w-full" variant="outline" style={{ borderColor: party.color, color: party.color }}>
                  Declare Candidacy
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="mb-6">
          <CardContent className="py-12 text-center">
            <Calendar className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-semibold mb-2">No active election right now</h2>
            <p className="text-sm text-muted-foreground mb-4">
              The current president serves a 365-day term. Cabinet members with ElectionScheduler power can call an election early.
            </p>
            <Button variant="outline" disabled>Schedule Election</Button>
          </CardContent>
        </Card>
      )}

      {past.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Past Elections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {past.map((e) => {
              const winner = e.candidates.find((c) => c.address === e.winner);
              const total = e.candidates.reduce((s, c) => s + c.voteCount, 0);
              return (
                <div key={e.raceId} className="rounded border p-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">
                      Election #{e.raceId} · {new Date(e.startTime).toLocaleDateString()} — {new Date(e.endTime).toLocaleDateString()}
                    </span>
                    {winner && (
                      <Badge className="gap-1" style={{ backgroundColor: party.color, color: "white" }}>
                        <Crown className="h-2.5 w-2.5" />
                        {shortenAddress(winner.address)} won
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-xs">
                    {e.candidates.slice().sort((a, b) => b.voteCount - a.voteCount).map((c) => {
                      const pct = total > 0 ? (c.voteCount / total) * 100 : 0;
                      return (
                        <div key={c.address} className="flex items-center justify-between">
                          <span className="font-mono">{shortenAddress(c.address)}</span>
                          <span className="text-muted-foreground">
                            {c.voteCount.toLocaleString()} ({pct.toFixed(1)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
