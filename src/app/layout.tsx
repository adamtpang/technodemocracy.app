import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostHogProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Technodemocracy — magical internet votes",
  description:
    "From the financial crisis of 2008 to the political crisis of 2024. Join a digital party. Grant a binding franchise. Vote onchain.",
  openGraph: {
    title: "Technodemocracy",
    description: "Magical internet votes. Join a digital party. Vote onchain.",
    url: "https://technodemocracy.app",
    siteName: "Technodemocracy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technodemocracy — magical internet votes",
    description:
      "Join a digital party. Grant a binding franchise. Vote onchain.",
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
