"use client";

import { useState } from "react";
import { getStreamingFeed, getPartyById, parties } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shortenAddress, relativeTime } from "@/lib/utils";
import {
  Vote, UserPlus, Plus, Crown, ExternalLink, Sparkles, Filter,
} from "lucide-react";
import Link from "next/link";

const KIND_META = {
  vote: { label: "vote", Icon: Vote, color: "#6366f1" },
  join: { label: "joined", Icon: UserPlus, color: "#10b981" },
  proposal: { label: "proposed", Icon: Plus, color: "#f59e0b" },
  election: { label: "election", Icon: Sparkles, color: "#ec4899" },
  found: { label: "founded", Icon: Crown, color: "#ef4444" },
} as const;

export default function FeedPage() {
  const [filter, setFilter] = useState<"all" | keyof typeof KIND_META>("all");
  const [partyFilter, setPartyFilter] = useState<number | null>(null);

  const allFeed = getStreamingFeed(100);
  const filtered = allFeed.filter((item) => {
    if (filter !== "all" && item.kind !== filter) return false;
    if (partyFilter !== null && item.partyId !== partyFilter) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Streaming Feed</h1>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Every join, vote, proposal, and election the moment it lands onchain.
          More like Twitter than the DMV.
        </p>
      </div>

      <Card className="mb-4 sticky top-14 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="py-3 flex items-center gap-2 flex-wrap">
          <Filter className="h-3 w-3 text-muted-foreground" />
          <button
            onClick={() => setFilter("all")}
            className={`text-xs rounded-full px-3 py-1 ${filter === "all" ? "bg-foreground text-background" : "border bg-muted/30 text-muted-foreground hover:text-foreground"}`}
          >All</button>
          {(Object.keys(KIND_META) as (keyof typeof KIND_META)[]).map((k) => {
            const m = KIND_META[k];
            const M = m.Icon;
            return (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`text-xs rounded-full px-3 py-1 inline-flex items-center gap-1 ${filter === k ? "border-2 font-semibold" : "border bg-muted/30 text-muted-foreground hover:text-foreground"}`}
                style={filter === k ? { borderColor: m.color, color: m.color } : undefined}
              >
                <M className="h-3 w-3" />
                {m.label}s
              </button>
            );
          })}
          <span className="mx-2 h-4 w-px bg-border" />
          <button
            onClick={() => setPartyFilter(null)}
            className={`text-xs rounded-full px-3 py-1 ${partyFilter === null ? "bg-foreground text-background" : "border bg-muted/30 text-muted-foreground hover:text-foreground"}`}
          >All parties</button>
          {parties.map((p) => (
            <button
              key={p.id}
              onClick={() => setPartyFilter(partyFilter === p.id ? null : p.id)}
              className={`text-xs rounded-full px-2.5 py-1 inline-flex items-center gap-1 ${partyFilter === p.id ? "border-2 font-semibold" : "border bg-muted/30 text-muted-foreground hover:text-foreground"}`}
              style={partyFilter === p.id ? { borderColor: p.color, color: p.color } : undefined}
              title={p.name}
            >
              <span>{p.emoji}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No activity matching this filter.
            </CardContent>
          </Card>
        ) : (
          filtered.map((item) => {
            const party = getPartyById(item.partyId);
            if (!party) return null;
            const meta = KIND_META[item.kind];
            const M = meta.Icon;
            const ago = relativeTime(item.timestamp);
            const detail = renderDetail(item, party);

            return (
              <Card key={item.id} className="hover:border-foreground/30 transition-colors">
                <CardContent className="py-3 flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: meta.color + "20" }}>
                    <M className="h-4 w-4" style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <Link href={`/parties/${party.id}`} className="font-semibold hover:underline inline-flex items-center gap-1">
                        <span>{party.emoji}</span>
                        {party.name}
                      </Link>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{ago}</span>
                    </div>
                    <div className="text-sm mt-0.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.actor === "0x0000000000000000000000000000000000000000" ? "—" : shortenAddress(item.actor)}
                      </span>{" "}
                      <span className="text-muted-foreground">{meta.label}</span>{" "}
                      {detail}
                    </div>
                  </div>
                  {item.txHash && (
                    <a href={`https://sepolia.basescan.org/tx/${item.txHash}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground shrink-0 mt-1">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="mt-6 text-center">
        <Button variant="outline" disabled>Loading older events…</Button>
        <p className="text-[10px] text-muted-foreground mt-2">
          (In production, this paginates through subgraph events.)
        </p>
      </div>
    </div>
  );
}

function renderDetail(
  item: ReturnType<typeof getStreamingFeed>[number],
  party: NonNullable<ReturnType<typeof getPartyById>>
) {
  switch (item.kind) {
    case "vote": {
      const support = item.payload.support as boolean;
      return (
        <>
          <Badge variant={support ? "default" : "destructive"} className="text-[10px] mx-1">
            {support ? "YES" : "NO"}
          </Badge>
          on{" "}
          <Link href={`/parties/${party.id}/proposals/${item.payload.proposalId}`} className="hover:underline">
            <em>{String(item.payload.proposalTitle).slice(0, 50)}</em>
          </Link>
        </>
      );
    }
    case "join":
      return <span>and granted the franchise</span>;
    case "proposal":
      return (
        <Link href={`/parties/${party.id}/proposals/${item.payload.proposalId}`} className="hover:underline">
          <em>{String(item.payload.proposalTitle).slice(0, 60)}</em>
        </Link>
      );
    case "election":
      return (
        <Link href={`/parties/${party.id}/election`} className="hover:underline">
          scheduled with {String(item.payload.candidates)} candidates
        </Link>
      );
    case "found":
      return <span>the party</span>;
  }
}
