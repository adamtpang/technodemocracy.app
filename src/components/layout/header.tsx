"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Users, UserCircle, Compass, Plus, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-14 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold tracking-tight"
          >
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/90 to-primary/60 shadow-[0_0_20px_-4px_hsl(224_100%_60%/0.6)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-white"
                strokeWidth={3}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12 L10 17 L19 7" />
              </svg>
            </span>
            <span>Technodemocracy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <NavLink href="/parties" icon={<Users className="h-4 w-4" />}>
              Parties
            </NavLink>
            <NavLink href="/feed" icon={<Sparkles className="h-4 w-4" />}>
              Feed
            </NavLink>
            <NavLink href="/parties/new" icon={<Plus className="h-4 w-4" />}>
              Start Party
            </NavLink>
            <NavLink
              href="/join-quiz"
              icon={<Compass className="h-4 w-4" />}
            >
              Find Yours
            </NavLink>
            <NavLink href="/profile" icon={<UserCircle className="h-4 w-4" />}>
              Profile
            </NavLink>
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

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
