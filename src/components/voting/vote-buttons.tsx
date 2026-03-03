"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

interface VoteButtonsProps {
  onVote: (support: boolean) => void;
  disabled?: boolean;
  hasVoted?: boolean;
  userVote?: boolean;
}

export function VoteButtons({
  onVote,
  disabled = false,
  hasVoted = false,
  userVote,
}: VoteButtonsProps) {
  const [loading, setLoading] = useState<"yes" | "no" | null>(null);

  const handleVote = async (support: boolean) => {
    setLoading(support ? "yes" : "no");
    // Simulate tx delay
    await new Promise((r) => setTimeout(r, 1500));
    onVote(support);
    setLoading(null);
  };

  if (hasVoted) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
            userVote
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {userVote ? (
            <ThumbsUp className="h-4 w-4" />
          ) : (
            <ThumbsDown className="h-4 w-4" />
          )}
          You voted {userVote ? "Yes" : "No"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={() => handleVote(true)}
        disabled={disabled || loading !== null}
        className="gap-2 bg-green-600 hover:bg-green-700"
      >
        {loading === "yes" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsUp className="h-4 w-4" />
        )}
        Vote Yes
      </Button>
      <Button
        onClick={() => handleVote(false)}
        disabled={disabled || loading !== null}
        variant="destructive"
        className="gap-2"
      >
        {loading === "no" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsDown className="h-4 w-4" />
        )}
        Vote No
      </Button>
    </div>
  );
}
