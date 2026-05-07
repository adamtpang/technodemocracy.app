import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Coins, Crown } from "lucide-react";
import { IdeologyChart } from "./ideology-chart";
import { formatUSDC, shortenAddress } from "@/lib/utils";
import type { Party } from "@/lib/mock-data";

export function PartyCard({ party }: { party: Party }) {
  return (
    <Link href={`/parties/${party.id}`}>
      <Card className="h-full hover:border-foreground/20 transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{party.emoji}</span>
              {party.name}
            </CardTitle>
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wide"
              style={{ borderColor: party.color + "60", color: party.color }}
            >
              {party.tagline}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {party.description}
          </p>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex justify-center">
            <IdeologyChart
              scores={party.ideologyScores}
              color={party.color}
              size="sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{party.memberCount}</span>
              </div>
              <span className="text-[10px]">members</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                <span>{formatUSDC(party.treasuryBalance)}</span>
              </div>
              <span className="text-[10px]">treasury</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                <span>${party.duesUSDC}/yr</span>
              </div>
              <span className="text-[10px]">dues</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">
              President: {shortenAddress(party.president)}
            </span>
            <Badge
              variant="secondary"
              style={{ backgroundColor: party.color + "20", color: party.color }}
            >
              View
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
