"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

const BENCHMARKS = [
  { label: "Mayor of a small US city", votes: 5_000, color: "#9ca3af" },
  { label: "Iceland presidential election", votes: 100_000, color: "#6366f1" },
  { label: "President of Ireland", votes: 1_000_000, color: "#10b981" },
  { label: "President of Argentina", votes: 14_000_000, color: "#f59e0b" },
  { label: "US presidential winner (2024)", votes: 77_000_000, color: "#ef4444" },
];

interface LegitimacyMeterProps {
  currentVotes: number;
  variant?: "full" | "compact";
}

export function LegitimacyMeter({ currentVotes, variant = "full" }: LegitimacyMeterProps) {
  const next = BENCHMARKS.find((b) => b.votes > currentVotes) ?? BENCHMARKS[BENCHMARKS.length - 1];
  const surpassed = BENCHMARKS.filter((b) => b.votes <= currentVotes);
  const last = surpassed[surpassed.length - 1];

  const max = BENCHMARKS[BENCHMARKS.length - 1].votes;
  const logPct = currentVotes > 0 ? (Math.log10(currentVotes) / Math.log10(max)) * 100 : 0;

  if (variant === "compact") {
    return (
      <div className="rounded-lg border bg-muted/30 p-3 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-muted-foreground">Onchain votes vs. fiat benchmarks</span>
          <span className="font-bold">{currentVotes.toLocaleString()}</span>
        </div>
        <Progress value={logPct} className="h-1.5" />
        <div className="text-[10px] text-muted-foreground mt-1.5">
          {last
            ? `Past: ${last.label}. Next: ${next.label} (${next.votes.toLocaleString()})`
            : `Next: ${next.label} (${next.votes.toLocaleString()})`}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                Democratic Legitimacy
              </span>
            </div>
            <div className="text-4xl font-bold">{currentVotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              cryptographically verifiable onchain votes across all parties
            </p>
          </div>
          {last && (
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Surpassed</div>
              <div className="text-sm font-semibold" style={{ color: last.color }}>{last.label}</div>
              <div className="text-[10px] text-muted-foreground">{last.votes.toLocaleString()} votes</div>
            </div>
          )}
        </div>

        <div className="relative pt-6 pb-12">
          <div className="absolute inset-x-0 top-2 h-1.5 rounded-full bg-muted" />
          <div
            className="absolute top-2 h-1.5 rounded-full"
            style={{
              width: `${logPct}%`,
              background: "linear-gradient(90deg, #9ca3af, #6366f1, #10b981, #f59e0b, #ef4444)",
            }}
          />
          {BENCHMARKS.map((b) => {
            const pct = (Math.log10(b.votes) / Math.log10(max)) * 100;
            const surpassedB = currentVotes >= b.votes;
            return (
              <div key={b.votes} className="absolute top-0 -translate-x-1/2" style={{ left: `${pct}%` }}>
                <div
                  className={`h-3 w-3 rounded-full border-2 ${surpassedB ? "bg-foreground border-foreground" : "bg-background border-muted-foreground/40"}`}
                  style={surpassedB ? { backgroundColor: b.color, borderColor: b.color } : undefined}
                />
                <div
                  className={`text-[9px] mt-1 whitespace-nowrap ${surpassedB ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                  style={{ transform: "translateX(-50%) rotate(-15deg)", transformOrigin: "top left" }}
                >
                  {b.label}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-2 italic text-center">
          &ldquo;If a president of a network state gets more than 70 million
          technodemocratic votes, they have more provable democratic legitimacy
          than the legacy system.&rdquo; — Balaji
        </p>
      </CardContent>
    </Card>
  );
}
