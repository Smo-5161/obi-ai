import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Omi.ai — Onboarding Mentor Intelligence : transmettez le savoir-faire opérationnel",
    template: "%s | Omi.ai",
  },
  description: site.description,
  keywords: [
    "onboarding",
    "transmission de savoir-faire",
    "base de connaissances entreprise",
    "SOP automatisées",
    "procédures opérationnelles",
    "RAG",
    "intelligence artificielle RH",
    "continuité opérationnelle",
    "gestion des connaissances",
  ],
  authors: [{ name: site.legalName }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title: "Omi.ai — Onboarding Mentor Intelligence",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Omi.ai — Onboarding Mentor Intelligence",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={dmSans.variable}>{children}</body>
    </html>
  );
}
