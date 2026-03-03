import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Coins } from "lucide-react";
import { IdeologyChart } from "./ideology-chart";
import { formatUSDC, shortenAddress } from "@/lib/utils";
import type { House } from "@/lib/mock-data";

interface HouseCardProps {
  house: House;
}

export function HouseCard({ house }: HouseCardProps) {
  return (
    <Link href={`/houses/${house.id}`}>
      <Card className="h-full hover:border-foreground/20 transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{house.emoji}</span>
              {house.name}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {house.description}
          </p>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex justify-center">
            <IdeologyChart
              scores={house.ideologyScores}
              color={house.color}
              size="sm"
            />
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{house.memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="h-3.5 w-3.5" />
              <span>{formatUSDC(house.treasuryBalance)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">
              Leader: {shortenAddress(house.leader)}
            </span>
            <Badge
              variant="secondary"
              style={{ backgroundColor: house.color + "20", color: house.color }}
            >
              View
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
