import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Obi.ai — Onboarding Intelligence",
  description: "Capture les processus métiers, transmets le savoir-faire sans intervention humaine.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <header className="border-b border-slate-800 bg-slate-950">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-slate-100">
              <span className="rounded bg-indigo-600 px-2 py-1 text-sm text-white">Obi</span>
              <span className="text-lg">Onboarding Intelligence</span>
            </Link>
            <nav className="flex gap-6 text-sm text-slate-300">
              <Link href="/recorder" className="hover:text-white">Recorder</Link>
              <Link href="/brains" className="hover:text-white">Brains</Link>
              <Link href="/analytics" className="hover:text-white">Analytics</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
