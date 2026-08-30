import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LegitimacyMeter } from "@/components/legitimacy/legitimacy-meter";
import {
  getTotalOnchainVotes,
  getTotalMembers,
  getTotalTreasury,
  parties,
} from "@/lib/mock-data";
import { formatUSDC } from "@/lib/utils";
import {
  ArrowRight, Wallet, Users, Vote, KeyRound, Sparkles, Globe2, ScrollText,
} from "lucide-react";

export default function LandingPage() {
  const totalVotes = getTotalOnchainVotes();
  const totalMembers = getTotalMembers();
  const totalTreasury = getTotalTreasury();

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-24 md:py-32 lg:py-40 relative bg-grid">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-8 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs text-primary backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            From magical internet money to magical internet votes.
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter max-w-4xl leading-[0.95]">
            <span className="text-gradient-brand">Technodemocracy</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The financial crisis of 2008 motivated cryptocurrency. The political
            crisis of 2024 motivates technodemocracy. Join a digital party,
            grant a binding franchise, vote onchain.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/parties">
              <Button size="lg" className="gap-2 rounded-full px-7 glow-brand">
                Browse Parties <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/parties/new">
              <Button size="lg" variant="outline" className="rounded-full px-7">
                Start Your Own Party
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            Anyone can run for president of a digital party. Anyone can vote.
            100% democracy, 0.1% of the world is still 8M people.
          </p>
        </div>
      </section>

      <section className="w-full py-20 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">The Franchise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The Technodemocracy franchise is more than a Reddit upvote: it is
              a proposed social smart contract that grants named powers, limits
              each power, records consent, and lets a member revoke permission.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg border bg-card p-6">
              <KeyRound className="h-6 w-6 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Granular Permissions</h3>
              <p className="text-sm text-muted-foreground">
                Granular permissions work like OAuth for a political party. A
                member chooses which powers a president may exercise over a
                wallet, sees the exact limits, and can revoke each grant instead
                of surrendering blanket authority.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <ScrollText className="h-6 w-6 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Binding Campaign Promises</h3>
              <p className="text-sm text-muted-foreground">
                Binding campaign promises constrain both the party and the
                member through explicit contract parameters. A $100 slashing
                ceiling cannot silently become $10,000, and every delegated
                power remains limited to its recorded scope.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <Globe2 className="h-6 w-6 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Truly Universal</h3>
              <p className="text-sm text-muted-foreground">
                Universal franchise lets any wallet support any eligible party,
                while universal candidacy lets any wallet propose a new one.
                Technodemocracy models an open-ended party system without a
                geographic ballot or fixed two-party gate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            One click vote. One click party.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">1. Follow</h3>
              <p className="text-sm text-muted-foreground">
                The Follow step connects a wallet and records which party slate
                the member intends to support. In this public prototype, the
                interaction is demonstrated in the browser rather than written
                as a live blockchain transaction.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">2. Fund</h3>
              <p className="text-sm text-muted-foreground">
                The Fund step defines an annual USDC commitment before consent
                is granted. A real deployment would require the wallet owner to
                approve the transaction and would keep the amount bounded by the
                visible franchise terms.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Vote className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">3. Franchise</h3>
              <p className="text-sm text-muted-foreground">
                The Franchise step shows the exact voting, norms, slashing, and
                naming permissions requested by a party. A production contract
                could issue a soulbound vote receipt after confirmation; the
                current site displays a demonstration receipt only.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Streaming votes</h2>
          <p className="text-muted-foreground mb-8">
            Streaming voting replaces a single election day with a continuously
            inspectable tally. The prototype demonstrates how each confirmed
            vote could create a public record that independent observers can
            verify, while the current totals below remain sample data.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center mb-8">
            <div>
              <div className="text-3xl font-bold">{parties.length}</div>
              <div className="text-sm text-muted-foreground">Demo parties</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{totalMembers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Demo members</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{formatUSDC(totalTreasury)}</div>
              <div className="text-sm text-muted-foreground">Demo treasuries</div>
            </div>
            <div>
              <div className="text-3xl font-bold">∞</div>
              <div className="text-sm text-muted-foreground">Possible parties</div>
            </div>
          </div>
          <Link href="/feed">
            <Button variant="outline" size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Watch the Live Feed
            </Button>
          </Link>
        </div>
      </section>

      <section className="w-full py-20 border-t">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Democratic legitimacy, measured</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The legitimacy meter compares the prototype&apos;s sample vote total
              with published election-scale benchmarks. A future live system
              would need independently verifiable membership and transaction
              records before its tally could support any real legitimacy claim.
            </p>
          </div>
          <LegitimacyMeter currentVotes={totalVotes} variant="full" />
        </div>
      </section>

      <section className="w-full py-20 border-t">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Find your party.</h2>
          <p className="text-muted-foreground mb-8">
            The party quiz and directory let visitors compare sample communities
            such as Don&apos;t Die, Mars, and Open-Source AI, then model a new party
            of their own. No quiz answer or draft party is persisted by this
            prototype.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/join-quiz">
              <Button size="lg" className="gap-2">
                Find Your Party <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/parties">
              <Button size="lg" variant="outline">Browse All Parties</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
