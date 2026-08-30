import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://technodemocracy.app";

export const metadata: Metadata = {
  title: "About Technodemocracy",
  description: "What the Technodemocracy prototype demonstrates, who operates it, and what is not live yet.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-semibold uppercase text-primary">About</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">A prototype for scoped digital government.</h1>
      <div className="mt-8 space-y-6 text-base leading-7 text-muted-foreground">
        <p>
          Technodemocracy is an interactive product prototype operated by Adam Pangelinan. It explores digital political parties whose members can grant narrow, revocable wallet permissions for dues, voting, delegated authority, and bounded enforcement instead of handing an organization unlimited control.
        </p>
        <p>
          The current public site uses demonstration parties, members, treasury balances, votes, and receipts so visitors can inspect the proposed workflow. Its forms and buttons model the experience in browser state; this deployment does not publish completed blockchain transactions or a live governance registry.
        </p>
        <p>
          The repository includes a twelve-contract Solidity design for Base covering party registration, membership, franchise scopes, elections, voting, treasury controls, disputes, attendance, and vote receipts. Those contracts remain prototype software and should be independently reviewed before any real funds, authority, or community decision depends on them.
        </p>
        <p>
          Technodemocracy is inspired by Balaji Srinivasan&apos;s technodemocracy proposal, but this project is an independent implementation experiment. It is not a government, political party, financial service, legal service, or endorsement by Balaji, Base, WalletConnect, or any demonstrated community.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/parties" className="rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Explore the prototype</Link>
        <Link href="/contact" className="rounded-full border px-5 py-2.5 font-semibold">Contact the operator</Link>
      </div>
    </section>
  );
}
