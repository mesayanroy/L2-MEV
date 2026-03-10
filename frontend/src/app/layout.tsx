import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "L2-MEV Shield — Solana MEV Protection",
  description:
    "Protect your Solana DeFi trades from sandwich attacks, frontrunning and backrunning. Free CLI + API.",
  openGraph: {
    title: "L2-MEV Shield",
    description: "Solana MEV Protection Infrastructure",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-dark-bg text-slate-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
