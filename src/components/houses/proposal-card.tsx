import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import type { Proposal } from "@/lib/mock-data";

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercent = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;

  const statusConfig = {
    active: {
      label: "Active",
      variant: "secondary" as const,
      icon: Clock,
      color: "text-blue-400",
    },
    passed: {
      label: "Passed",
      variant: "default" as const,
      icon: CheckCircle2,
      color: "text-green-400",
    },
    failed: {
      label: "Failed",
      variant: "destructive" as const,
      icon: XCircle,
      color: "text-red-400",
    },
  };

  const status = statusConfig[proposal.status];
  const StatusIcon = status.icon;

  return (
    <Link href={`/houses/${proposal.houseId}/proposals/${proposal.id}`}>
      <Card className="hover:border-foreground/20 transition-colors cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{proposal.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                by {shortenAddress(proposal.author)}
              </p>
            </div>
            <Badge variant={status.variant} className="shrink-0 gap-1">
              <StatusIcon className={`h-3 w-3 ${status.color}`} />
              {status.label}
            </Badge>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Yes: {proposal.yesVotes}</span>
              <span>No: {proposal.noVotes}</span>
            </div>
            <Progress value={yesPercent} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {totalVotes} total votes
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
