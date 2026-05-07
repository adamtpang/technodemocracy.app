"use client";

import { useState, useMemo } from "react";
import { parties, getTotalOnchainVotes } from "@/lib/mock-data";
import { PartyGrid } from "@/components/parties/party-grid";
import { LegitimacyMeter } from "@/components/legitimacy/legitimacy-meter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

type SortKey = "members" | "treasury" | "founded" | "alphabetical";

export default function PartiesPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("members");
  const totalVotes = getTotalOnchainVotes();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = parties.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "members": return b.memberCount - a.memberCount;
        case "treasury": return b.treasuryBalance - a.treasuryBalance;
        case "founded":
          return new Date(b.foundedAt).getTime() - new Date(a.foundedAt).getTime();
        case "alphabetical": return a.name.localeCompare(b.name);
      }
    });
    return list;
  }, [query, sort]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Digital Parties</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Each party is a binding social smart contract. Members grant the
            president scoped digital authority — and a verifiable franchise.
          </p>
        </div>
        <Link href="/parties/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Start Your Own
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <LegitimacyMeter currentVotes={totalVotes} variant="compact" />
      </div>

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parties by name, tagline, description…"
            className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Sort:</span>
          {([
            { k: "members", label: "Members" },
            { k: "treasury", label: "Treasury" },
            { k: "founded", label: "Newest" },
            { k: "alphabetical", label: "A→Z" },
          ] as { k: SortKey; label: string }[]).map((opt) => (
            <button
              key={opt.k}
              onClick={() => setSort(opt.k)}
              className={`text-xs rounded-full px-2.5 py-1 ${
                sort === opt.k
                  ? "bg-foreground text-background"
                  : "border bg-muted/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground mb-4">
            No parties match &ldquo;{query}&rdquo;.
          </p>
          <Link href="/parties/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Found one yourself
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-3">
            {filtered.length} part{filtered.length === 1 ? "y" : "ies"}
          </p>
          <PartyGrid parties={filtered} />
        </>
      )}
    </div>
  );
}
