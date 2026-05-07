"use client";

import { useState } from "react";
import { IDEOLOGY_AXES, parties } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { IdeologyChart } from "@/components/parties/ideology-chart";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function JoinQuizPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(IDEOLOGY_AXES.map((a) => [a.key, 5]))
  );
  const [showResult, setShowResult] = useState(false);

  const currentAxis = IDEOLOGY_AXES[step];
  const isLast = step === IDEOLOGY_AXES.length - 1;

  const handleChange = (value: number[]) => {
    setScores((prev) => ({ ...prev, [currentAxis.key]: value[0] }));
  };

  const handleNext = () => {
    if (isLast) setShowResult(true);
    else setStep((s) => s + 1);
  };

  const bestMatch = parties.reduce(
    (best, party) => {
      const distance = Math.sqrt(
        Object.entries(scores).reduce((sum, [key, val]) => {
          const partyVal = party.ideologyScores[key] || 5;
          return sum + (val - partyVal) ** 2;
        }, 0)
      );
      if (!best || distance < best.distance) return { party, distance };
      return best;
    },
    null as { party: (typeof parties)[0]; distance: number } | null
  );

  if (showResult && bestMatch) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="text-center mb-8">
          <Sparkles className="h-8 w-8 mx-auto mb-4" style={{ color: bestMatch.party.color }} />
          <h1 className="text-3xl font-bold mb-2">Your Party</h1>
          <p className="text-muted-foreground">Based on your ideology, your closest match is:</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <span className="text-4xl">{bestMatch.party.emoji}</span>
              <h2 className="text-2xl font-bold mt-3">{bestMatch.party.name}</h2>
              <p className="text-muted-foreground mt-2 text-sm">{bestMatch.party.description}</p>
            </div>

            <div className="flex justify-center gap-8">
              <div>
                <p className="text-xs text-muted-foreground text-center mb-2">Your ideology</p>
                <IdeologyChart scores={scores} color="#6366f1" size="sm" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground text-center mb-2">{bestMatch.party.name}</p>
                <IdeologyChart scores={bestMatch.party.ideologyScores} color={bestMatch.party.color} size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href={`/parties/${bestMatch.party.id}`}>
            <Button size="lg" style={{ backgroundColor: bestMatch.party.color }}>
              Join {bestMatch.party.name}
            </Button>
          </Link>
          <Link href="/parties">
            <Button size="lg" variant="outline">Browse All Parties</Button>
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Don&apos;t see what you&apos;re looking for?{" "}
          <Link href="/parties/new" className="text-foreground hover:underline">
            Start your own party.
          </Link>
        </p>

        <button
          onClick={() => {
            setShowResult(false);
            setStep(0);
            setScores(Object.fromEntries(IDEOLOGY_AXES.map((a) => [a.key, 5])));
          }}
          className="text-sm text-muted-foreground hover:text-foreground mt-6 block mx-auto"
        >
          Retake quiz
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Your Party</h1>
        <p className="text-muted-foreground mt-2">
          Five questions to find the digital party closest to your ideology.
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        {IDEOLOGY_AXES.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentAxis.label}
            <span className="text-muted-foreground font-normal text-sm ml-2">
              ({step + 1}/{IDEOLOGY_AXES.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentAxis.lowLabel}</span>
              <span>{currentAxis.highLabel}</span>
            </div>
            <Slider
              value={[scores[currentAxis.key]]}
              onValueChange={handleChange}
              max={10} min={1} step={1}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-2xl font-bold">{scores[currentAxis.key]}</span>
              <span className="text-muted-foreground text-sm"> / 10</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="gap-2">
              <ArrowLeft className="h-4 w-4" />Back
            </Button>
            <Button onClick={handleNext} className="gap-2">
              {isLast ? "See Results" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
