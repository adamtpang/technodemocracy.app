"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Repeat2, Heart, BadgeCheck } from "lucide-react";
import { relativeTime } from "@/lib/utils";
import type { PartyPost } from "@/lib/mock-data";

function formatCount(n: number): string {
  if (n < 1_000) return String(n);
  if (n < 1_000_000) return `${(n / 1_000).toFixed(n < 10_000 ? 1 : 0)}k`.replace(".0k", "k");
  return `${(n / 1_000_000).toFixed(1)}M`.replace(".0M", "M");
}

export function PostCard({ post, partyColor }: { post: PartyPost; partyColor: string }) {
  return (
    <article className="border-b py-3 hover:bg-muted/20 transition-colors px-3 -mx-3 cursor-pointer">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback
            className="text-xs font-bold"
            style={{ backgroundColor: partyColor + "25", color: partyColor }}
          >
            {post.authorName
              .split(" ")
              .map((s) => s[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap text-sm">
            <span className="font-bold">{post.authorName}</span>
            {post.authorVerified && (
              <BadgeCheck
                className="h-4 w-4 fill-current"
                style={{ color: "#3b82f6" }}
              />
            )}
            <span className="text-muted-foreground">@{post.authorHandle}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-xs">
              {relativeTime(post.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
            {post.body}
          </p>
          <div className="flex items-center gap-6 mt-2 text-xs text-muted-foreground">
            <button className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>{formatCount(post.replies)}</span>
            </button>
            <button className="inline-flex items-center gap-1.5 hover:text-green-500 transition-colors">
              <Repeat2 className="h-4 w-4" />
              <span>{formatCount(post.recasts)}</span>
            </button>
            <button className="inline-flex items-center gap-1.5 hover:text-pink-500 transition-colors">
              <Heart className="h-4 w-4" />
              <span>{formatCount(post.likes)}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
