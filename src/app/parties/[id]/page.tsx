"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import {
  getPartyById, getProposalsByParty, getMembersByParty,
  getNormsForParty, getActiveElection, getEventsForParty,
  getPartySocial, getPostsForParty,
} from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ProposalCard } from "@/components/parties/proposal-card";
import { MemberList } from "@/components/parties/member-list";
import { FranchiseCard } from "@/components/parties/franchise-card";
import { CabinetCard } from "@/components/parties/cabinet-card";
import { NormsCard } from "@/components/parties/norms-card";
import { JoinPartyModal } from "@/components/parties/join-party-modal";
import { PostFeed } from "@/components/parties/post-feed";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatUSDC, shortenAddress } from "@/lib/utils";
import {
  Crown, ArrowLeft, Plus, Vote, Settings, CalendarDays,
  Sparkles, BadgeCheck,
} from "lucide-react";
import Link from "next/link";

export default function PartyDetailPage() {
  const params = useParams();
  const partyId = Number(params.id);
  const party = getPartyById(partyId);
  const [joinOpen, setJoinOpen] = useState(false);
  const { address } = useCurrentUser();

  if (!party) notFound();

  const social = getPartySocial(partyId);
  const proposals = getProposalsByParty(partyId);
  const members = getMembersByParty(partyId);
  const norms = getNormsForParty(partyId);
  const activeElection = getActiveElection(partyId);
  const events = getEventsForParty(partyId);
  const posts = getPostsForParty(partyId);
  const activeProposals = proposals.filter((p) => p.status === "active");
  const pastProposals = proposals.filter((p) => p.status !== "active");
  const isPresident = party.president.toLowerCase() === address.toLowerCase();

  const fundingPct = social
    ? Math.min(100, (social.fundingRaisedUSDC / social.fundingGoalUSDC) * 100)
    : 0;

  // Build hero gradient from party color.
  const heroGradient = `linear-gradient(135deg, ${party.color}40, ${party.color}20, ${party.color}10), radial-gradient(circle at 30% 30%, ${party.color}50, transparent 60%)`;

  return (
    <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-6 max-w-2xl">
      <Link
        href="/parties"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground my-4 px-4 sm:px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Parties
      </Link>

      {/* Hero banner */}
      <div className="rounded-none sm:rounded-2xl overflow-hidden border-y sm:border bg-card">
        <div
          className="h-44 relative"
          style={{ background: heroGradient }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg italic"
              style={{ textShadow: `0 2px 8px ${party.color}80` }}
            >
              {party.name}
            </h2>
          </div>
        </div>

        {/* Profile section */}
        <div className="px-4 pt-4 pb-5 -mt-12">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div className="rounded-full ring-4 ring-card bg-card overflow-hidden">
              <Avatar className="h-24 w-24">
                <AvatarFallback
                  className="text-2xl font-bold"
                  style={{ backgroundColor: party.color + "30", color: party.color }}
                >
                  {(social?.presidentName ?? party.name)
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            <h1 className="text-xl font-bold">
              {social?.presidentName ?? "President"}
            </h1>
            {social?.presidentVerified && (
              <BadgeCheck className="h-5 w-5 fill-current" style={{ color: "#3b82f6" }} />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            @{social?.presidentHandle ?? shortenAddress(party.president)}
          </p>

          <p className="text-sm leading-relaxed mb-4">
            {social?.bio ?? party.description}
          </p>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Button
              size="lg"
              className="rounded-full px-8 font-semibold"
              onClick={() => setJoinOpen(true)}
              style={{ backgroundColor: party.color, color: "white" }}
            >
              Apply
            </Button>
            <Link href={`/parties/${party.id}/election`}>
              <Button size="sm" variant="outline" className="rounded-full gap-2">
                <Vote className="h-4 w-4" />
                {activeElection ? "Election Live" : "Elections"}
              </Button>
            </Link>
            {isPresident && (
              <Link href={`/parties/${party.id}/dashboard`}>
                <Button size="sm" variant="outline" className="rounded-full gap-2">
                  <Settings className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
          </div>

          {/* Social proof */}
          {social && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <div className="flex -space-x-1.5">
                {social.slate.slice(0, 3).map((m) => (
                  <div
                    key={m.address}
                    className="rounded-full ring-2 ring-card overflow-hidden"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback
                        className="text-[10px] font-bold"
                        style={{ backgroundColor: party.color + "30", color: party.color }}
                      >
                        {m.name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {social.socialProofNames.join(", ")} and{" "}
                <strong className="text-foreground">
                  {party.memberCount.toLocaleString()}
                </strong>{" "}
                others
              </span>
            </div>
          )}

          {/* Funding bar */}
          {social && (
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold">
                  {formatUSDC(social.fundingRaisedUSDC).replace("$", "$")}{" "}
                  /{" "}
                  {social.fundingGoalUSDC >= 1_000_000
                    ? `${(social.fundingGoalUSDC / 1_000_000).toFixed(1)}M`
                    : formatUSDC(social.fundingGoalUSDC)}{" "}
                  <span className="text-muted-foreground font-normal">USDC</span>
                </span>
                <span className="text-muted-foreground">Raised</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${fundingPct}%`,
                    background: `linear-gradient(90deg, ${party.color}, ${party.color}cc)`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active election banner */}
      {activeElection && (
        <Card
          className="my-4 mx-4 sm:mx-0 border-2"
          style={{ borderColor: party.color + "60" }}
        >
          <CardContent className="pt-4 pb-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" style={{ color: party.color }} />
              <div>
                <p className="text-sm font-semibold">Presidential election in progress</p>
                <p className="text-xs text-muted-foreground">
                  {activeElection.candidates.length} candidates ·{" "}
                  {activeElection.candidates.reduce((s, c) => s + c.voteCount, 0)} votes streaming
                </p>
              </div>
            </div>
            <Link href={`/parties/${party.id}/election`}>
              <Button size="sm" style={{ backgroundColor: party.color }}>
                Vote in Election
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full mt-4">
        <div className="px-4 sm:px-0">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-grid sm:grid-cols-7">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="proposals">
              Proposals
              {activeProposals.length > 0 && (
                <span className="ml-1 text-[10px] text-muted-foreground">({activeProposals.length})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="franchise" className="hidden sm:inline-flex">Franchise</TabsTrigger>
            <TabsTrigger value="norms" className="hidden sm:inline-flex">
              Norms
            </TabsTrigger>
            <TabsTrigger value="cabinet" className="hidden sm:inline-flex">Cabinet</TabsTrigger>
            <TabsTrigger value="events" className="hidden sm:inline-flex">Events</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="mt-0">
          <div className="px-4 sm:px-0">
            <PostFeed posts={posts} partyColor={party.color} />
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-4 px-4 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Members</CardTitle>
              <p className="text-xs text-muted-foreground">
                Each member has granted the franchise. Each is cryptographically verifiable as a real wallet.
              </p>
            </CardHeader>
            <CardContent>
              <MemberList members={members} president={party.president} cabinet={party.cabinet} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="mt-4 px-4 sm:px-0">
          <div className="flex justify-end mb-4">
            {party.openProposals && (
              <Link href={`/parties/${party.id}/proposals/new`}>
                <Button size="sm" variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Proposal
                </Button>
              </Link>
            )}
          </div>
          {activeProposals.length > 0 && (
            <div className="mb-8">
              <h3 className="text-base font-semibold mb-3">Streaming Now</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeProposals.map((p) => <ProposalCard key={p.id} proposal={p} />)}
              </div>
            </div>
          )}
          {pastProposals.length > 0 && (
            <div>
              <h3 className="text-base font-semibold mb-3">Past Proposals</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {pastProposals.map((p) => <ProposalCard key={p.id} proposal={p} />)}
              </div>
            </div>
          )}
          {proposals.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">No proposals yet.</p>
          )}
        </TabsContent>

        <TabsContent value="franchise" className="mt-4 px-4 sm:px-0">
          <FranchiseCard
            franchise={party.franchise}
            partyName={party.name}
            partyColor={party.color}
          />
        </TabsContent>

        <TabsContent value="norms" className="mt-4 px-4 sm:px-0">
          <NormsCard versions={norms} partyName={party.name} partyColor={party.color} />
        </TabsContent>

        <TabsContent value="cabinet" className="mt-4 px-4 sm:px-0">
          <CabinetCard
            president={party.president}
            cabinet={party.cabinet}
            partyColor={party.color}
          />
        </TabsContent>

        <TabsContent value="events" className="mt-4 px-4 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Upcoming Events
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                RSVPing onchain mints a soulbound proof-of-attendance NFT.
              </p>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events.</p>
              ) : (
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div key={ev.id} className="rounded-lg border p-4 hover:border-foreground/40 transition-colors">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                        <h3 className="font-semibold text-sm">{ev.title}</h3>
                        <Badge variant={ev.isOnline ? "secondary" : "outline"} className="text-[10px]">
                          {ev.isOnline ? "Online" : "In-Person"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{ev.description}</p>
                      <div className="flex items-center justify-between gap-4 text-xs flex-wrap">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {new Date(ev.startTime).toLocaleString(undefined, {
                              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                          </span>
                          <span>{ev.location}</span>
                          <span>{ev.rsvpCount} RSVPs</span>
                        </div>
                        <Button size="sm" variant="outline" style={{ borderColor: party.color + "60", color: party.color }}>RSVP</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mobile-only: show extra tabs at the bottom */}
      <div className="sm:hidden mt-6 px-4 grid grid-cols-2 gap-2">
        <Link href={`#franchise-section`}>
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <Crown className="h-3.5 w-3.5" />
            Franchise
          </Button>
        </Link>
        <Link href={`/parties/${party.id}/election`}>
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <Vote className="h-3.5 w-3.5" />
            Elections
          </Button>
        </Link>
      </div>

      <JoinPartyModal party={party} open={joinOpen} onOpenChange={setJoinOpen} />
    </div>
  );
}
