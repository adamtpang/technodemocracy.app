interface VoteProgressProps {
  yesVotes: number;
  noVotes: number;
}

export function VoteProgress({ yesVotes, noVotes }: VoteProgressProps) {
  const total = yesVotes + noVotes;
  const yesPercent = total > 0 ? (yesVotes / total) * 100 : 50;
  const noPercent = total > 0 ? (noVotes / total) * 100 : 50;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span>Yes: {yesVotes} ({total > 0 ? yesPercent.toFixed(0) : 0}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>No: {noVotes} ({total > 0 ? noPercent.toFixed(0) : 0}%)</span>
          <div className="h-3 w-3 rounded-full bg-red-500" />
        </div>
      </div>
      <div className="h-4 w-full rounded-full overflow-hidden bg-red-500/20 flex">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${yesPercent}%` }}
        />
        <div
          className="h-full bg-red-500 transition-all duration-500"
          style={{ width: `${noPercent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {total} total votes
      </p>
    </div>
  );
}
