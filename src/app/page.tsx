import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, Users, Vote } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="w-full py-24 md:py-32 lg:py-40">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-3xl">
            Houses
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            Technodemocracy at Network School. Join a house, stake your
            conviction, vote on what matters — all verifiable onchain.
          </p>
          <div className="flex gap-4">
            <Link href="/houses">
              <Button size="lg" className="gap-2">
                Browse Houses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/join-quiz">
              <Button size="lg" variant="outline">
                Find Your House
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-20 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">1. Connect</h3>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to get started. Your identity is your
                Ethereum address.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">2. Join a House</h3>
              <p className="text-sm text-muted-foreground">
                Take the ideology quiz, find your house, and stake USDC to join.
                Your stake is your commitment.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Vote className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">3. Vote & Govern</h3>
              <p className="text-sm text-muted-foreground">
                Vote on proposals, elect leaders, and shape the future of your
                community. Every vote is onchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full py-20 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <p className="text-3xl font-bold">4</p>
              <p className="text-sm text-muted-foreground">Houses</p>
            </div>
            <div>
              <p className="text-3xl font-bold">83</p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold">$50.5k</p>
              <p className="text-sm text-muted-foreground">Total Treasury</p>
            </div>
            <div>
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm text-muted-foreground">Onchain Votes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
