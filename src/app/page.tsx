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
      <section className="w-full py-24 md:py-32 lg:py-40">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            From magical internet money to magical internet votes.
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            Technodemocracy
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            The financial crisis of 2008 motivated cryptocurrency. The political
            crisis of 2024 motivates technodemocracy. Join a digital party,
            grant a binding franchise, vote onchain.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/parties">
              <Button size="lg" className="gap-2">
                Browse Parties <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/parties/new">
              <Button size="lg" variant="outline">Start Your Own Party</Button>
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
              Joining a digital party is more than a Reddit upvote. It is a
              binding grant of digital power — a social smart contract.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg border bg-card p-6">
              <KeyRound className="h-6 w-6 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Granular Permissions</h3>
              <p className="text-sm text-muted-foreground">
                Like Google OAuth — but for political parties. You explicitly
                consent to which powers the party president holds over your
                wallet, and revoke them at any time.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <ScrollText className="h-6 w-6 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Binding Campaign Promises</h3>
              <p className="text-sm text-muted-foreground">
                Both party and member are bound. Provably limited government —
                the president can slash $100, never $10,000. Powers are
                cryptographically scoped.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <Globe2 className="h-6 w-6 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Truly Universal</h3>
              <p className="text-sm text-muted-foreground">
                Universal franchise: anyone votes for anyone. Universal
                candidacy: anyone runs for anything. No geography, no two-party
                trap. The endless-party system.
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
                Connect your wallet. Follow the party president and members
                onchain. This alone signals alignment.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">2. Fund</h3>
              <p className="text-sm text-muted-foreground">
                Pay annual party dues. Capital and time commitment is what
                distinguishes a real party from a mailing list.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Vote className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">3. Franchise</h3>
              <p className="text-sm text-muted-foreground">
                Grant the president scoped digital authority — a binding social
                smart contract. Receive your soulbound &quot;I voted&quot; NFT, verifiable on Basescan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Streaming votes</h2>
          <p className="text-muted-foreground mb-8">
            Forget &quot;election day.&quot; Every vote is registered onchain the moment
            it&apos;s cast. More like Twitter than the DMV. Any third party can
            verify these are real people, not bots.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center mb-8">
            <div>
              <p className="text-3xl font-bold">{parties.length}</p>
              <p className="text-sm text-muted-foreground">Active Parties</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{totalMembers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatUSDC(totalTreasury)}</p>
              <p className="text-sm text-muted-foreground">Total Treasuries</p>
            </div>
            <div>
              <p className="text-3xl font-bold">∞</p>
              <p className="text-sm text-muted-foreground">Possible parties</p>
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
              Just like Bitcoin&apos;s market cap eventually surpassed the Turkish
              lira, technodemocracy&apos;s vote count surpasses fiat
              presidential elections one benchmark at a time.
            </p>
          </div>
          <LegitimacyMeter currentVotes={totalVotes} variant="full" />
        </div>
      </section>

      <section className="w-full py-20 border-t">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Find your party.</h2>
          <p className="text-muted-foreground mb-8">
            Or start one. Don&apos;t Die, Mars, Open-Source AI, your own.
            Cryptographically verifiable democratic legitimacy starts with one wallet.
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
