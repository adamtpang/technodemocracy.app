import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostHogProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://technodemocracy.app";

const organizationJsonLd = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Technodemocracy",
  url: SITE_URL,
  sameAs: ["https://github.com/adamtpang/technodemocracy.app"],
};

const websiteJsonLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Technodemocracy",
  description:
    "An interactive prototype for scoped digital parties, wallet consent, and verifiable voting workflows on Base.",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [organizationJsonLd, websiteJsonLd],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Technodemocracy — magical internet votes",
  description:
    "Explore a prototype for scoped digital parties, wallet consent, and verifiable voting workflows on Base.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Technodemocracy",
    description: "A prototype for scoped digital parties and verifiable voting workflows on Base.",
    url: SITE_URL,
    siteName: "Technodemocracy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technodemocracy — magical internet votes",
    description:
      "Explore scoped digital parties and verifiable voting workflows on Base.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B5CFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PostHogProvider>
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Providers>
        </PostHogProvider>
      </body>
    </html>
  );
}
