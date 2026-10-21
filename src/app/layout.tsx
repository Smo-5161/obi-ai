import type { Metadata } from "next";
import { Space_Grotesk, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

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
      <body className={`${spaceGrotesk.className} ${pressStart2P.variable}`}>{children}</body>
    </html>
  );
}
