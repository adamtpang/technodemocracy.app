import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://technodemocracy.app";

export const metadata: Metadata = {
  title: "Technodemocracy Privacy",
  description: "How the Technodemocracy prototype handles wallet, analytics, form, and hosting data.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-semibold uppercase text-primary">Privacy</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated August 30, 2026</p>
      <div className="mt-8 space-y-7 text-base leading-7 text-muted-foreground">
        <p>
          Technodemocracy is operated by Adam Pangelinan. The public deployment is an interactive prototype, and the party directory, member profiles, treasuries, votes, and receipts shown on the site are demonstration data rather than records submitted by those named communities.
        </p>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Wallet connections</h2>
          <p className="mt-2">
            The site uses RainbowKit, wagmi, WalletConnect, and public Base network endpoints to offer wallet connection. Connecting can disclose your public wallet address, selected network, and connection metadata to those providers. Technodemocracy never needs your seed phrase or private key, and the current prototype does not write connected wallet details to an application database.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Prototype inputs</h2>
          <p className="mt-2">
            Party creation, proposal, quiz, voting, and franchise controls currently run in browser memory against local demonstration data. The public prototype does not persist those entries to an application database or submit them as blockchain transactions, although wallet software may retain its own connection state under its policies.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Analytics and hosting</h2>
          <p className="mt-2">
            Vercel hosts the site and receives ordinary request data such as IP address, browser details, route, and timing information. When a PostHog project key is configured, the site also sends page-use events and the site hostname to the configured PostHog service; the integration is configured to create person profiles only for identified users.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Questions and requests</h2>
          <p className="mt-2">
            To ask about this policy, report an unexpected data flow, or request action on information you believe the operator controls, use the <Link href="/contact" className="text-primary underline underline-offset-4">contact page</Link>. WalletConnect, wallet vendors, Base RPC providers, Vercel, and PostHog handle their own service data under their respective policies.
          </p>
        </section>
      </div>
    </section>
  );
}
