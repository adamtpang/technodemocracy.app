"use client";

import { getPartyById } from "@/lib/mock-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IVotedCard } from "@/components/parties/i-voted-card";
import { shortenAddress } from "@/lib/utils";
import {
  Coins, Vote, LogOut, ExternalLink, Copy, CheckCircle2,
  KeyRound, ShieldAlert, Crown, Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ProfilePage() {
  const { address, isConnected, isDemo, grants, nfts } = useCurrentUser();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalDuesPaid = grants.reduce((s, g) => s + g.duesPaid, 0);
  const totalSlashed = grants.reduce((s, g) => s + g.totalSlashed, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isConnected ? `Connected as ${shortenAddress(address)}` : "Demo mode — connect a wallet to make actions binding"}
          </p>
        </div>
        {isDemo && (
          <Badge variant="outline" className="gap-1.5">
            <Wallet className="h-3 w-3" />
            Demo Persona
          </Badge>
        )}
      </div>

      {!isConnected && (
        <Card className="mb-6 border-dashed">
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Connect your wallet</h3>
              <p className="text-xs text-muted-foreground">
                You&apos;re viewing a demo account. Connect a wallet to grant real franchises and cast binding onchain votes.
              </p>
            </div>
            <ConnectButton showBalance={false} chainStatus="none" />
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-sm">{shortenAddress(address, 8)}</span>
            <button onClick={copyAddress} className="text-muted-foreground hover:text-foreground">
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <a href={`https://sepolia.basescan.org/address/${address}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded border bg-muted/30 py-2">
              <div className="text-base font-bold">{grants.length}</div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Active Franchises</div>
            </div>
            <div className="rounded border bg-muted/30 py-2">
              <div className="text-base font-bold">${totalDuesPaid}</div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Lifetime Dues</div>
            </div>
            <div className="rounded border bg-muted/30 py-2">
              <div className="text-base font-bold">{nfts.length}</div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">I Voted NFTs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Active Franchises
            <span className="text-sm font-normal text-muted-foreground">({grants.length})</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            You can hold the franchise of many parties simultaneously. Each grant is an independent social smart contract.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {grants.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No active franchises yet.</p>
              <Link href="/join-quiz"><Button>Find Your Party</Button></Link>
            </div>
          ) : (
            grants.map((grant) => {
              const party = getPartyById(grant.partyId);
              if (!party) return null;
              return (
                <div key={grant.partyId} className="rounded-lg border-2 p-4" style={{ borderColor: party.color + "40" }}>
                  <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl">{party.emoji}</span>
                      <Link href={`/parties/${party.id}`} className="font-semibold hover:underline">{party.name}</Link>
                      {grant.cabinetRole && (
                        <Badge className="gap-1" style={{ backgroundColor: party.color, color: "white" }}>
                          <Crown className="h-2.5 w-2.5" />
                          {grant.cabinetRole}
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" style={{ borderColor: party.color + "60", color: party.color }}>
                      Granted {new Date(grant.joinedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded border bg-muted/30 py-1.5 text-center">
                      <Coins className="h-3 w-3 mx-auto mb-0.5 text-muted-foreground" />
                      <div className="text-xs font-bold">${grant.duesPaid}</div>
                      <div className="text-[9px] uppercase text-muted-foreground">Dues Paid</div>
                    </div>
                    <div className="rounded border bg-muted/30 py-1.5 text-center">
                      <ShieldAlert className="h-3 w-3 mx-auto mb-0.5 text-muted-foreground" />
                      <div className="text-xs font-bold">${grant.totalSlashed}</div>
                      <div className="text-[9px] uppercase text-muted-foreground">Slashed</div>
                    </div>
                    <div className="rounded border bg-muted/30 py-1.5 text-center">
                      <Vote className="h-3 w-3 mx-auto mb-0.5 text-muted-foreground" />
                      <div className="text-xs font-bold">{Math.round(party.franchise.delegatedVotingWeight * 100)}%</div>
                      <div className="text-[9px] uppercase text-muted-foreground">Vote Weight</div>
                    </div>
                  </div>

                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground">
                      {grant.scopesGranted.length} scopes granted →
                    </summary>
                    <ul className="mt-2 space-y-1 pl-4">
                      {grant.scopesGranted.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="h-1 w-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: party.color }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </details>

                  <Button variant="ghost" size="sm" className="gap-2 mt-3 text-muted-foreground hover:text-destructive">
                    <LogOut className="h-3 w-3" />
                    Revoke Franchise
                  </Button>
                </div>
              );
            })
          )}

          <Link href="/parties" className="block text-center text-xs text-muted-foreground hover:text-foreground pt-2">
            + Grant a franchise to another party
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Vote className="h-5 w-5" />
            &quot;I Voted&quot; NFT Collection
            <span className="text-sm font-normal text-muted-foreground">({nfts.length})</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Each NFT is a soulbound, cryptographically verifiable receipt of an onchain vote.
          </p>
        </CardHeader>
        <CardContent>
          {nfts.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No vote receipts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {nfts.map((nft) => {
                const party = getPartyById(nft.partyId);
                if (!party) return null;
                return (
                  <Link
                    key={nft.tokenId}
                    href={`/parties/${nft.partyId}/proposals/${nft.proposalId}`}
                    className="block hover:scale-105 transition-transform"
                  >
                    <IVotedCard
                      party={party}
                      tokenId={nft.tokenId}
                      txHash={nft.txHash}
                      voter={address}
                      size="sm"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center mt-6">
        Want to start your own party?{" "}
        <Link href="/parties/new" className="text-foreground hover:underline">
          Universal candidacy is one click away.
        </Link>
      </p>
    </div>
  );
}
