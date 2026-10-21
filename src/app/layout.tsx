import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Obi.ai — Onboarding Intelligence : transmettez le savoir-faire opérationnel",
    template: "%s | Obi.ai",
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
    title: "Obi.ai — Onboarding Intelligence",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Obi.ai — Onboarding Intelligence",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
