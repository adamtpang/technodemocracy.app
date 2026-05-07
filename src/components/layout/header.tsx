"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Vote, Users, UserCircle, Compass, Plus, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Vote className="h-5 w-5" />
            <span>Technodemocracy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/parties" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Users className="h-4 w-4" />
              Parties
            </Link>
            <Link href="/feed" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Sparkles className="h-4 w-4" />
              Feed
            </Link>
            <Link href="/parties/new" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-4 w-4" />
              Start Party
            </Link>
            <Link href="/join-quiz" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Compass className="h-4 w-4" />
              Find Yours
            </Link>
            <Link href="/profile" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <UserCircle className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
      </div>
    </header>
  );
}
