"use client";

import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface VoteButtonsProps {
  onVote: (support: boolean) => void;
  disabled?: boolean;
  hasVoted?: boolean;
  userVote?: boolean;
}

export function VoteButtons({ onVote, disabled, hasVoted, userVote }: VoteButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        size="lg"
        variant={hasVoted && userVote === true ? "default" : "outline"}
        disabled={disabled || hasVoted}
        onClick={() => onVote(true)}
        className="gap-2"
      >
        <ThumbsUp className="h-4 w-4" />
        Yes
      </Button>
      <Button
        size="lg"
        variant={hasVoted && userVote === false ? "destructive" : "outline"}
        disabled={disabled || hasVoted}
        onClick={() => onVote(false)}
        className="gap-2"
      >
        <ThumbsDown className="h-4 w-4" />
        No
      </Button>
    </div>
  );
}
