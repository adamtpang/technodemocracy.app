"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ExternalLink } from "lucide-react";
import type { Party } from "@/lib/mock-data";

interface IVotedCardProps {
  party: Party;
  tokenId: number;
  /** Optional voter address shown small at top */
  voter?: string;
  /** Optional tx hash to link to Basescan */
  txHash?: string;
  /** Slate addresses to show as avatars (defaults to president + cabinet[0..2]) */
  slate?: string[];
  size?: "sm" | "md" | "lg";
}

/**
 * The "I Voted" card, modeled directly on Balaji's mockup. Green gradient,
 * three circular slate avatars, token id badge, and an "I VOTED" star banner.
 *
 * This is the visual identity the rest of the site builds around.
 */
export function IVotedCard({
  party,
  tokenId,
  voter,
  txHash,
  slate,
  size = "md",
}: IVotedCardProps) {
  // Default slate: president + first two cabinet members.
  const effectiveSlate =
    slate ?? [party.president, ...party.cabinet.slice(0, 2).map((c) => c.address)];

  const dims = {
    sm: { width: 200, padTop: 16, padBottom: 14, avatar: 36, banner: 28, label: 14 },
    md: { width: 280, padTop: 24, padBottom: 18, avatar: 56, banner: 36, label: 18 },
    lg: { width: 360, padTop: 32, padBottom: 22, avatar: 72, banner: 44, label: 22 },
  }[size];

  // Build a slightly different shade of the party color for the gradient.
  const accent = party.color;
  const gradient = `linear-gradient(160deg, ${shade(accent, 0.95)} 0%, ${shade(accent, 0.7)} 50%, ${shade(accent, 0.5)} 100%)`;

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg"
      style={{ width: dims.width, background: gradient }}
    >
      {/* Top: tokenId badge */}
      <div
        className="flex items-center justify-between px-4"
        style={{ paddingTop: dims.padTop }}
      >
        <div className="text-white/70 text-[10px] uppercase tracking-widest font-semibold">
          {party.emoji} {party.tagline}
        </div>
        <div
          className="rounded-full bg-white/20 px-2.5 py-0.5 text-white font-mono font-bold backdrop-blur-sm"
          style={{ fontSize: size === "sm" ? 10 : 12 }}
        >
          #{tokenId.toString().padStart(6, "0")}
        </div>
      </div>

      {/* Slate avatars */}
      <div className="flex justify-center items-end gap-2 mt-4 mb-3">
        {effectiveSlate.slice(0, 3).map((addr, i) => (
          <div
            key={addr + i}
            className="rounded-full bg-white shadow-md flex items-center justify-center"
            style={{
              width: i === 1 ? dims.avatar + 8 : dims.avatar,
              height: i === 1 ? dims.avatar + 8 : dims.avatar,
              border: "3px solid white",
            }}
          >
            <Avatar
              className="h-full w-full"
              style={{ background: accent + "30" }}
            >
              <AvatarFallback
                className="text-xs font-bold"
                style={{ color: accent, backgroundColor: shade(accent, 1.2) + "60" }}
              >
                {addr.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>

      {/* Party name */}
      <div
        className="text-center text-white font-bold mb-3 px-3 line-clamp-1"
        style={{ fontSize: dims.label - 2 }}
      >
        {party.name}
      </div>

      {/* I VOTED banner */}
      <div
        className="relative mt-1"
        style={{ marginBottom: dims.padBottom }}
      >
        <div
          className="bg-white/95 mx-2 rounded-xl flex items-center justify-center gap-2 shadow-inner"
          style={{ height: dims.banner * 1.4, paddingInline: 16 }}
        >
          <Star
            className="fill-current"
            style={{
              color: accent,
              width: dims.banner * 0.55,
              height: dims.banner * 0.55,
            }}
          />
          <div
            className="font-extrabold tracking-widest"
            style={{
              color: shade(accent, 0.6),
              fontSize: dims.banner * 0.7,
              letterSpacing: "0.15em",
            }}
          >
            I VOTED
          </div>
          <Star
            className="fill-current"
            style={{
              color: accent,
              width: dims.banner * 0.55,
              height: dims.banner * 0.55,
            }}
          />
        </div>
      </div>

      {/* Voter / tx footer */}
      {(voter || txHash) && (
        <div
          className="px-3 pb-3 -mt-1 flex items-center justify-between text-[9px] text-white/70"
        >
          {voter && (
            <span className="font-mono">
              {voter.slice(0, 6)}…{voter.slice(-4)}
            </span>
          )}
          {txHash && (
            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              tx <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/** Lighten or darken a hex color. ratio < 1 darkens, > 1 lightens. */
function shade(hex: string, ratio: number): string {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  if (!m) return hex;
  const [r, g, b] = m.map((h) => parseInt(h, 16));
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * ratio)));
  return `#${[c(r), c(g), c(b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}
