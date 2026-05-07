"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { IVotedCard } from "./i-voted-card";
import {
  Coins, ArrowRight, Sparkles, Check, UserPlus,
} from "lucide-react";
import type { Party } from "@/lib/mock-data";
import { getPartySocial } from "@/lib/mock-data";
import { shortenAddress } from "@/lib/utils";

interface JoinPartyModalProps {
  party: Party;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "follow" | "fund" | "franchise" | "complete";

export function JoinPartyModal({ party, open, onOpenChange }: JoinPartyModalProps) {
  const social = getPartySocial(party.id);
  const slate = social?.slate ?? [
    { address: party.president, name: "President", handle: "president", role: "President" as const },
    ...party.cabinet.slice(0, 2).map((c) => ({
      address: c.address,
      name: c.role,
      handle: c.role.toLowerCase().replace(/\s/g, ""),
      role: "Cabinet" as const,
    })),
  ];

  const [step, setStep] = useState<Step>("follow");
  const [issuedTokenId] = useState(() => Math.floor(Math.random() * 900000) + 100000);

  // The four canonical franchise toggles from Balaji's mockup.
  const [voteSlate, setVoteSlate] = useState(true);
  const [followNorms, setFollowNorms] = useState(true);
  const [allowSlash, setAllowSlash] = useState(false);
  const [nameResolver, setNameResolver] = useState(false);

  const reset = () => {
    setStep("follow");
    setVoteSlate(true);
    setFollowNorms(true);
    setAllowSlash(false);
    setNameResolver(false);
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 300);
  };

  const slateNamesShort = slate
    .slice(0, 3)
    .map((m) => m.name.split(" ")[0])
    .join(", ")
    .replace(/, ([^,]*)$/, ", and $1");

  const slateRoles = slate
    .slice(0, 3)
    .map((m) => m.role)
    .join(", ")
    .replace(/, ([^,]*)$/, ", and $1");

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : close())}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {step === "complete" ? (
          <CompleteScreen
            party={party}
            tokenId={issuedTokenId}
            slate={slate.slice(0, 3).map((s) => s.address)}
            onClose={close}
          />
        ) : (
          <div className="p-6">
            {/* Slate avatars */}
            <div className="flex justify-center -space-x-2 mb-4">
              {slate.slice(0, 4).map((m, i) => (
                <div
                  key={m.address}
                  className="rounded-full border-2 border-background overflow-hidden bg-white"
                  style={{
                    zIndex: 10 - i,
                    width: 48,
                    height: 48,
                  }}
                >
                  <Avatar className="h-full w-full">
                    <AvatarFallback
                      className="text-xs font-bold"
                      style={{ backgroundColor: party.color + "25", color: party.color }}
                    >
                      {m.name
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>

            <DialogTitle className="text-2xl font-bold text-center">
              Vote for the Slate
            </DialogTitle>
            <DialogDescription className="text-center mb-6 text-sm">
              Exercise your digital franchise to vote for{" "}
              <span className="text-foreground font-medium">{slateNamesShort}</span> as{" "}
              {party.name} leaders.
            </DialogDescription>

            {/* Step indicator */}
            <div className="flex items-center justify-between text-xs mb-6 border-b pb-3">
              <StepIndicator
                num={1}
                label="Follow"
                active={step === "follow"}
                done={step !== "follow"}
                color={party.color}
              />
              <StepIndicator
                num={2}
                label="Fund"
                active={step === "fund"}
                done={step === "franchise"}
                color={party.color}
              />
              <StepIndicator
                num={3}
                label="Franchise"
                active={step === "franchise"}
                done={false}
                color={party.color}
              />
            </div>

            {step === "follow" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <UserPlus className="h-4 w-4" />
                  Follow the Slate
                </div>
                <div className="space-y-2">
                  {slate.slice(0, 3).map((m) => (
                    <div
                      key={m.address}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback
                            className="text-xs font-bold"
                            style={{ backgroundColor: party.color + "25", color: party.color }}
                          >
                            {m.name
                              .split(" ")
                              .map((s) => s[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{m.name}</div>
                          <div className="text-xs text-muted-foreground">
                            @{m.handle} · {m.role}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {shortenAddress(m.address)}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => setStep("fund")}
                  style={{ backgroundColor: party.color }}
                >
                  Follow Slate & Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {step === "fund" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Coins className="h-4 w-4" />
                  Fund the Party
                </div>
                <div className="rounded-lg border p-6 text-center">
                  <p className="text-xs text-muted-foreground mb-3">
                    Annual party dues — capital and time commitment is what
                    distinguishes a real party from a mailing list.
                  </p>
                  <div
                    className="text-5xl font-bold"
                    style={{ color: party.color }}
                  >
                    ${party.franchise.duesUSDC}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    USDC, debited annually
                  </div>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => setStep("franchise")}
                  style={{ backgroundColor: party.color }}
                >
                  Approve & Continue <ArrowRight className="h-4 w-4" />
                </Button>
                <button
                  onClick={() => setStep("follow")}
                  className="text-xs text-muted-foreground hover:text-foreground mx-auto block"
                >
                  ← Back
                </button>
              </div>
            )}

            {step === "franchise" && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <FranchiseToggle
                    checked={voteSlate}
                    onChange={setVoteSlate}
                    activeColor={party.color}
                    label={
                      <>
                        Vote for <strong>{slateNamesShort}</strong> as{" "}
                        {slateRoles} of {party.name}
                      </>
                    }
                  />
                  <FranchiseToggle
                    checked={followNorms}
                    onChange={setFollowNorms}
                    activeColor={party.color}
                    label={
                      <>
                        Commit to follow norms and pay annual dues (${
                          party.franchise.duesUSDC
                        }) for party membership
                      </>
                    }
                  />
                  <FranchiseToggle
                    checked={allowSlash}
                    onChange={setAllowSlash}
                    activeColor={party.color}
                    label={
                      <>
                        Allow party leaders to slash $
                        {party.franchise.slashingMaxUSDC} in staked funds if I
                        violate community norms, after giving two warnings
                      </>
                    }
                  />
                  <FranchiseToggle
                    checked={nameResolver}
                    onChange={setNameResolver}
                    activeColor={party.color}
                    label={
                      <>
                        Name the President to be dispute resolver on all
                        matters of governance within the party&apos;s digital
                        and physical properties.
                      </>
                    }
                  />
                </div>

                <Button
                  className="w-full gap-2 mt-4"
                  onClick={() => setStep("complete")}
                  disabled={!voteSlate || !followNorms}
                  style={{ backgroundColor: party.color }}
                >
                  Grant Franchise & Mint &quot;I Voted&quot;{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <button
                  onClick={() => setStep("fund")}
                  className="text-xs text-muted-foreground hover:text-foreground mx-auto block"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({
  num, label, active, done, color,
}: {
  num: number;
  label: string;
  active: boolean;
  done: boolean;
  color: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 ${active ? "" : done ? "opacity-60" : "opacity-40"}`}
    >
      <div
        className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
          done ? "bg-foreground text-background" : "border"
        }`}
        style={
          active
            ? { borderColor: color, color: color, borderWidth: 2 }
            : undefined
        }
      >
        {done ? <Check className="h-3 w-3" /> : num}
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
}

function FranchiseToggle({
  checked,
  onChange,
  label,
  activeColor,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: React.ReactNode;
  activeColor: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <p className="text-sm flex-1 text-foreground/90 leading-relaxed">
        {label}
      </p>
      <div className="shrink-0 mt-0.5">
        <Switch checked={checked} onCheckedChange={onChange} activeColor={activeColor} />
      </div>
    </div>
  );
}

function CompleteScreen({
  party, tokenId, slate, onClose,
}: {
  party: Party;
  tokenId: number;
  slate: string[];
  onClose: () => void;
}) {
  return (
    <div className="p-6 text-center space-y-4">
      <div className="flex justify-center mb-3">
        <Sparkles className="h-8 w-8" style={{ color: party.color }} />
      </div>
      <DialogTitle className="text-xl font-bold">
        Welcome to {party.name}
      </DialogTitle>
      <DialogDescription className="text-sm">
        Your franchise is registered onchain. Your soulbound &quot;I Voted&quot;
        NFT has been minted to your wallet.
      </DialogDescription>
      <div className="flex justify-center py-2">
        <IVotedCard party={party} tokenId={tokenId} slate={slate} size="sm" />
      </div>
      <Button onClick={onClose} className="w-full">
        Enter the Party
      </Button>
    </div>
  );
}
