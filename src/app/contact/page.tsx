import type { Metadata } from "next";

const SITE_URL = "https://technodemocracy.app";

export const metadata: Metadata = {
  title: "Contact Technodemocracy",
  description: "Contact Adam Pangelinan about the Technodemocracy prototype, source code, or privacy requests.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-semibold uppercase text-primary">Contact</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Contact the project operator.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        Adam Pangelinan operates Technodemocracy and handles product feedback, source-code questions, security reports, and requests about data or wallet interactions. Use Adam&apos;s published contact page so the current support channel stays in one place.
      </p>
      <a
        href="https://adampang.com/contact"
        className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
      >
        Open Adam&apos;s contact page
      </a>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">
        Do not include a wallet seed phrase, private key, password, or other authentication secret in a support message. Technodemocracy support will never need those credentials.
      </p>
    </section>
  );
}
