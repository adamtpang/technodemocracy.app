"use client";

import { PostCard } from "./post-card";
import type { PartyPost } from "@/lib/mock-data";

export function PostFeed({
  posts,
  partyColor,
}: {
  posts: PartyPost[];
  partyColor: string;
}) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        No posts yet. Be the first to cast.
      </div>
    );
  }
  return (
    <div className="divide-y">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} partyColor={partyColor} />
      ))}
    </div>
  );
}
