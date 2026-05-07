"use client";

import { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { getPartyById } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewProposalPage() {
  const params = useParams();
  const router = useRouter();
  const partyId = Number(params.id);
  const party = getPartyById(partyId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(7);
  const [submitting, setSubmitting] = useState(false);

  if (!party) notFound();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => router.push(`/parties/${partyId}`), 1200);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href={`/parties/${partyId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {party.name}
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{party.emoji}</span>
          <span className="text-sm text-muted-foreground">{party.name}</span>
        </div>
        <h1 className="text-3xl font-bold">New Proposal</h1>
        <p className="text-muted-foreground mt-2">
          Submit a binding proposal to {party.name}. The vote streams onchain
          the moment members start casting.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Proposal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <input
                id="title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fund quarterly convening"
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description" required rows={6} value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this proposal do? What does it cost? What is the expected outcome?"
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div>
              <Label htmlFor="duration">Voting window (days)</Label>
              <input
                id="duration" type="number" required min={1} max={30} value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default: 7 days. Streaming votes lock at the end of the window.
              </p>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">Submitting</strong> triggers an onchain transaction. You must hold the franchise of {party.name}.
              </p>
            </div>
            <Button
              type="submit" disabled={submitting} className="w-full gap-2"
              style={{ backgroundColor: party.color }}
            >
              {submitting ? (
                <><Sparkles className="h-4 w-4 animate-pulse" />Registering onchain...</>
              ) : "Submit Proposal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
