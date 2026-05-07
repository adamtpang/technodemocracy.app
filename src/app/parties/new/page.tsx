"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Sparkles, KeyRound, ShieldAlert, Coins, Vote, Globe2,
} from "lucide-react";
import Link from "next/link";

const COLOR_OPTIONS = ["#10b981","#ef4444","#6366f1","#f59e0b","#ec4899","#06b6d4","#a855f7","#84cc16"];
const EMOJI_OPTIONS = ["\u{1F3DB}\u{FE0F}","\u{1F33F}","\u{1F680}","\u{1F916}","\u{1F30D}","\u{1F4A1}","\u{1F525}","\u{1FA90}"];

export default function NewPartyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [duesUSDC, setDuesUSDC] = useState(75);
  const [slashingMaxUSDC, setSlashingMaxUSDC] = useState(75);
  const [delegatedVotingWeight, setDelegatedVotingWeight] = useState(0.1);
  const [scope, setScope] = useState(
    "Vote for me as President\nSlash up to stake max for norm violation\nAuto-debit annual dues"
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => router.push("/parties"), 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/parties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Parties
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-3 gap-1">
          <Globe2 className="h-3 w-3" />
          Universal Candidacy
        </Badge>
        <h1 className="text-3xl font-bold">Start Your Own Party</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Anyone can run for president of a digital party. Define your platform,
          your dues, your franchise scope. Members opt in via cryptographic
          consent — and revoke anytime.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Party Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <input
                id="name" type="text" required value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Don't Die Party"
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <input
                id="tagline" type="text" required value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Longevity"
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description" required rows={4} value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this party stand for? What do members commit to?"
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div>
              <Label>Emoji</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e} type="button"
                    onClick={() => setEmoji(e)}
                    className={`h-10 w-10 rounded-lg border text-xl ${emoji === e ? "border-2 border-foreground" : ""}`}
                  >{e}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Brand Color</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c} type="button"
                    onClick={() => setColor(c)}
                    className={`h-10 w-10 rounded-lg ${color === c ? "ring-2 ring-offset-2 ring-offset-background ring-foreground" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: color + "40" }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <KeyRound className="h-5 w-5" style={{ color }} />
              The Franchise
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Define the binding social smart contract members grant you on
              join. Less is more — ask only for what you need.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="flex items-center gap-1.5"><Coins className="h-4 w-4" />Annual Dues</Label>
                <span className="text-sm font-bold">${duesUSDC} USDC/yr</span>
              </div>
              <Slider value={[duesUSDC]} onValueChange={(v) => setDuesUSDC(v[0])} min={0} max={500} step={5} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="flex items-center gap-1.5"><ShieldAlert className="h-4 w-4" />Max Slashable Stake</Label>
                <span className="text-sm font-bold">${slashingMaxUSDC} USDC</span>
              </div>
              <Slider value={[slashingMaxUSDC]} onValueChange={(v) => setSlashingMaxUSDC(v[0])} min={0} max={500} step={5} />
              <p className="text-[10px] text-muted-foreground mt-1">
                The maximum you can slash from a member for norm violations. Provably limited.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="flex items-center gap-1.5"><Vote className="h-4 w-4" />Delegated Voting Weight</Label>
                <span className="text-sm font-bold">{Math.round(delegatedVotingWeight * 100)}%</span>
              </div>
              <Slider value={[delegatedVotingWeight * 100]} onValueChange={(v) => setDelegatedVotingWeight(v[0] / 100)} min={0} max={50} step={1} />
              <p className="text-[10px] text-muted-foreground mt-1">
                Portion of member voting power delegated to you for routine decisions. 0% = pure direct democracy.
              </p>
            </div>
            <div>
              <Label htmlFor="scope">Scope statements (one per line)</Label>
              <textarea
                id="scope" rows={5} value={scope} onChange={(e) => setScope(e.target.value)}
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                These show up in the member&apos;s OAuth-style consent screen on join.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit" disabled={submitting || !name || !description}
          className="w-full gap-2" style={{ backgroundColor: color }} size="lg"
        >
          {submitting ? (
            <><Sparkles className="h-4 w-4 animate-pulse" />Registering party onchain...</>
          ) : <>Found {name || "Your Party"}</>}
        </Button>
      </form>
    </div>
  );
}
