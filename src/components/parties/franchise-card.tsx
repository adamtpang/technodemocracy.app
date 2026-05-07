import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeyRound, ShieldAlert, Coins, Vote, UserPlus } from "lucide-react";
import type { FranchiseScope } from "@/lib/mock-data";
import { shortenAddress } from "@/lib/utils";

interface FranchiseCardProps {
  franchise: FranchiseScope;
  partyName: string;
  partyColor: string;
}

export function FranchiseCard({ franchise, partyName, partyColor }: FranchiseCardProps) {
  return (
    <Card className="border-2" style={{ borderColor: partyColor + "40" }}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="h-5 w-5" style={{ color: partyColor }} />
            The Franchise
          </CardTitle>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            Social Smart Contract
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          The binding, scoped digital authority members grant the {partyName}{" "}
          president on join. Revocable at any time. Like Google OAuth — but for
          political parties.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border bg-muted/30 py-3">
            <Coins className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">${franchise.duesUSDC}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Annual Dues</div>
          </div>
          <div className="rounded-lg border bg-muted/30 py-3">
            <ShieldAlert className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">${franchise.slashingMaxUSDC}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Max Slash</div>
          </div>
          <div className="rounded-lg border bg-muted/30 py-3">
            <Vote className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">{Math.round(franchise.delegatedVotingWeight * 100)}%</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Delegated Vote</div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Granted Scopes
          </p>
          <ul className="space-y-1.5">
            {franchise.scopes.map((scope, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: partyColor }} />
                {scope}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <UserPlus className="h-3 w-3" />
            Auto-Follow on Join
          </p>
          <div className="flex flex-wrap gap-1.5">
            {franchise.followAddresses.map((addr) => (
              <Badge key={addr} variant="secondary" className="font-mono text-xs">
                {shortenAddress(addr)}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
