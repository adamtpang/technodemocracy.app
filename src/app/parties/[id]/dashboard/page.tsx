"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import {
  getPartyById, getNormsForParty, getDisputesForParty, getMembersByParty,
} from "@/lib/mock-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { shortenAddress, formatUSDC } from "@/lib/utils";
import {
  ArrowLeft, Crown, ScrollText, Users, ShieldAlert, Coins, Plus, Trash2,
  Sparkles, Lock, Vote as VoteIcon,
} from "lucide-react";
import Link from "next/link";

export default function PresidentDashboardPage() {
  const params = useParams();
  const partyId = Number(params.id);
  const party = getPartyById(partyId);
  const { address, isConnected } = useCurrentUser();
  const [normsDraft, setNormsDraft] = useState("");
  const [slashAmount, setSlashAmount] = useState(50);

  if (!party) notFound();

  const isPresident = party.president.toLowerCase() === address.toLowerCase();
  const norms = getNormsForParty(partyId);
  const disputes = getDisputesForParty(partyId);
  const members = getMembersByParty(partyId);
  const pending = disputes.filter((d) => d.status === "pending");
  const resolved = disputes.filter((d) => d.status !== "pending");

  if (!isPresident) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href={`/parties/${partyId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to {party.name}
        </Link>
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Lock className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-xl font-semibold mb-2">President-only dashboard</h1>
            <p className="text-sm text-muted-foreground mb-4">
              This page is gated to the current president of {party.name}.
            </p>
            <p className="text-xs text-muted-foreground">
              President: <span className="font-mono">{shortenAddress(party.president)}</span>
              <br />
              {isConnected ? `You: ${shortenAddress(address)}` : "Connect a wallet to verify identity."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/parties/${partyId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {party.name}
      </Link>

      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <Badge className="mb-2 gap-1" style={{ backgroundColor: party.color, color: "white" }}>
            <Crown className="h-3 w-3" />
            President — {party.name}
          </Badge>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span>{party.emoji}</span>President Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            All actions on this page are exercises of cryptographically scoped authority. Provably limited.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="rounded border bg-muted/30 px-3 py-2">
            <div className="text-base font-bold">{party.memberCount.toLocaleString()}</div>
            <div className="text-[10px] uppercase text-muted-foreground">Members</div>
          </div>
          <div className="rounded border bg-muted/30 px-3 py-2">
            <div className="text-base font-bold">{formatUSDC(party.treasuryBalance)}</div>
            <div className="text-[10px] uppercase text-muted-foreground">Treasury</div>
          </div>
          <div className="rounded border bg-muted/30 px-3 py-2">
            <div className="text-base font-bold">{pending.length}</div>
            <div className="text-[10px] uppercase text-muted-foreground">Open Disputes</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="cabinet" className="w-full">
        <TabsList>
          <TabsTrigger value="cabinet">Cabinet</TabsTrigger>
          <TabsTrigger value="norms">Norms</TabsTrigger>
          <TabsTrigger value="disputes">Disputes {pending.length > 0 && `(${pending.length})`}</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
        </TabsList>

        <TabsContent value="cabinet" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cabinet Management
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Appoint cabinet members and grant cryptographically scoped powers. You hold every power implicitly.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {party.cabinet.map((member) => (
                  <div key={member.address} className="rounded-lg border p-3 flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs bg-muted">{member.address.slice(2, 4).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm">{shortenAddress(member.address)}</span>
                        <Badge variant="secondary" className="text-[10px]">{member.role}</Badge>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {member.powers.map((p, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: party.color }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border-dashed border-2 p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Appoint New Cabinet Member
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label className="text-xs">Wallet Address</Label>
                    <input type="text" placeholder="0x..." className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <Label className="text-xs">Role</Label>
                    <input type="text" placeholder="e.g. Vice President" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <Label className="text-xs">Powers Granted</Label>
                <div className="grid sm:grid-cols-2 gap-1 mt-1 text-xs">
                  {["TreasurySmallSpend","TreasuryLargeSpend","NormsAmendment","EventScheduler","DisputeResolve","MemberOnboard","ElectionScheduler","CensusAdmin"].map((p) => (
                    <label key={p} className="flex items-center gap-1.5 cursor-pointer hover:text-foreground text-muted-foreground">
                      <input type="checkbox" className="rounded" />
                      {p}
                    </label>
                  ))}
                </div>
                <Button className="mt-4 w-full" style={{ backgroundColor: party.color }}>Appoint</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="norms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ScrollText className="h-5 w-5" />
                Norms Editor
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Publish a new norms version. Body uploaded to IPFS; content hash anchored onchain.
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid sm:grid-cols-2 gap-3">
                <div className="rounded border bg-muted/30 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Current Version</div>
                  <div className="text-2xl font-bold">v{norms.length || 0}</div>
                </div>
                <div className="rounded border bg-muted/30 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Next Version</div>
                  <div className="text-2xl font-bold">v{(norms.length || 0) + 1}</div>
                </div>
              </div>
              <Label htmlFor="norms-body" className="text-xs">New norms text (markdown)</Label>
              <textarea
                id="norms-body" rows={14} value={normsDraft}
                onChange={(e) => setNormsDraft(e.target.value)}
                placeholder={`# ${party.name} Norms — v${(norms.length || 0) + 1}\n\n1. ...`}
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
              <Button className="mt-3 w-full gap-2" style={{ backgroundColor: party.color }} disabled={normsDraft.trim().length < 10}>
                <Sparkles className="h-4 w-4" />
                Publish to IPFS & Anchor Onchain
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="mt-6 space-y-4">
          {pending.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-yellow-500" />
                  Pending Disputes ({pending.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pending.map((d) => (
                  <div key={d.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Dispute #{d.id} · filed {new Date(d.filedAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-mono">{shortenAddress(d.complainant)}</span>{" "}vs{" "}
                          <span className="font-mono">{shortenAddress(d.defendant)}</span>
                        </div>
                      </div>
                      <Badge variant="outline">Cited Norm v{d.normVersion}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 italic">&ldquo;{d.evidence}&rdquo;</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Label className="text-xs">Slash amount:</Label>
                      <input
                        type="number" value={slashAmount}
                        onChange={(e) => setSlashAmount(Number(e.target.value))}
                        max={party.franchise.slashingMaxUSDC} min={0}
                        className="w-20 rounded border bg-background px-2 py-1 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">/ max ${party.franchise.slashingMaxUSDC}</span>
                      <div className="flex gap-2 ml-auto">
                        <Button size="sm" variant="outline">Dismiss</Button>
                        <Button size="sm" variant="destructive">Slash ${slashAmount}</Button>
                        <Button size="sm" variant="destructive" className="bg-red-900 hover:bg-red-950">Eject</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {resolved.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resolved Disputes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resolved.map((d) => (
                  <div key={d.id} className="rounded border p-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Dispute #{d.id} · resolved {d.resolvedAt && new Date(d.resolvedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs mt-1">Defendant: {shortenAddress(d.defendant)}</div>
                      {d.resolutionNote && (
                        <p className="text-[10px] text-muted-foreground mt-1 italic">{d.resolutionNote}</p>
                      )}
                    </div>
                    <Badge
                      variant={d.status === "slash" || d.status === "eject" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {d.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {disputes.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No disputes filed yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="treasury" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Treasury — {formatUSDC(party.treasuryBalance)}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Three spend lanes: small-spend by treasurer, voted large-spend, and 2-of-N cabinet emergency multisig.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded border p-3">
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Small Spend Cap</div>
                  <div className="text-lg font-bold">$5,000</div>
                  <p className="text-[10px] text-muted-foreground mt-1">Treasurer can execute unilaterally</p>
                </div>
                <div className="rounded border p-3">
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Emergency Cap</div>
                  <div className="text-lg font-bold">$25,000</div>
                  <p className="text-[10px] text-muted-foreground mt-1">2-of-N cabinet multisig</p>
                </div>
                <div className="rounded border p-3">
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Above Cap</div>
                  <div className="text-lg font-bold">Member Vote</div>
                  <p className="text-[10px] text-muted-foreground mt-1">7-day proposal + streaming vote</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline">Update Caps</Button>
                <Button style={{ backgroundColor: party.color }}>Propose New Spend</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Member Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mb-3">
                {members.length} members have granted the franchise.
                {members.length < party.memberCount && ` ${party.memberCount - members.length} additional onchain attestations indexed.`}
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <VoteIcon className="h-3 w-3" />
                Schedule Census
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
