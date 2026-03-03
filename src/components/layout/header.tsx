"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Home, Users, UserCircle, Compass } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-xl">&#x1F3DB;</span>
            <span>Houses</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link
              href="/houses"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4" />
              Houses
            </Link>
            <Link
              href="/join-quiz"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Compass className="h-4 w-4" />
              Find Your House
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <UserCircle className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </div>
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="avatar"
        />
      </div>
    </header>
  );
}
