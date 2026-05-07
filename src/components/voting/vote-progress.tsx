import { Progress } from "@/components/ui/progress";

interface VoteProgressProps {
  yesVotes: number;
  noVotes: number;
}

export function VoteProgress({ yesVotes, noVotes }: VoteProgressProps) {
  const total = yesVotes + noVotes;
  const yesPct = total > 0 ? (yesVotes / total) * 100 : 0;
  const noPct = total > 0 ? (noVotes / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-semibold text-green-400">Yes</span>
          <span className="text-muted-foreground">
            {yesVotes} ({yesPct.toFixed(1)}%)
          </span>
        </div>
        <Progress value={yesPct} className="h-2" />
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-semibold text-red-400">No</span>
          <span className="text-muted-foreground">
            {noVotes} ({noPct.toFixed(1)}%)
          </span>
        </div>
        <Progress value={noPct} className="h-2" />
      </div>
      <p className="text-xs text-muted-foreground text-center pt-2">
        {total} total streaming onchain votes
      </p>
    </div>
  );
}
