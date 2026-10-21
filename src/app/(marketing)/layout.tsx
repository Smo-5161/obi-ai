import Link from "next/link";
import type { Metadata } from "next";
import SynapseBackground from "./SynapseBackground";
import LedCursor from "./LedCursor";

export const metadata: Metadata = { title: { absolute: "Obi.ai — Onboarding Intelligence" } };

const nav = [
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/login", label: "Connexion" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <SynapseBackground />
      <LedCursor />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b-2 border-line bg-paper/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-text-strong">
              <span className="rounded-none border-2 border-ink bg-accent px-2 py-1 text-sm font-bold text-background shadow-[2px_2px_0_0_var(--ink)]">Obi</span>
              <span className="text-sm tracking-tight">Onboarding Intelligence</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-muted">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="transition-colors hover:text-accent-bright">
                  {n.label}
                </Link>
              ))}
              <Link
                href="/signup"
                className="btn-cubic border-2 border-accent bg-accent px-4 py-2 font-semibold text-background"
              >
                Essai gratuit
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t-2 border-line bg-paper/95 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-sm text-muted md:grid-cols-4">
            <div>
              <p className="font-bold text-text-strong">Obi.ai</p>
              <p className="mt-2">Onboarding Intelligence. La continuité opérationnelle par la capture des processus métiers.</p>
            </div>
            <div>
              <p className="text-xs">Produit</p>
              <ul className="mt-2 space-y-1">
                <li><Link href="/#fonctionnement" className="hover:text-accent-bright">Fonctionnement</Link></li>
                <li><Link href="/#fonctionnalites" className="hover:text-accent-bright">Fonctionnalités</Link></li>
                <li><Link href="/#tarifs" className="hover:text-accent-bright">Tarifs</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs">Ressources</p>
              <ul className="mt-2 space-y-1">
                <li><Link href="/blog" className="hover:text-accent-bright">Blog</Link></li>
                <li><Link href="/faq" className="hover:text-accent-bright">FAQ</Link></li>
                <li><Link href="/legal/cgu" className="hover:text-accent-bright">CGU</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-accent-bright">Confidentialité</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs">Compte</p>
              <ul className="mt-2 space-y-1">
                <li><Link href="/login" className="hover:text-accent-bright">Connexion</Link></li>
                <li><Link href="/signup" className="hover:text-accent-bright">Inscription</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-line py-4 text-center text-xs text-muted">
            © {new Date().getFullYear()} Obi.ai — Tous droits réservés.
          </div>
        </footer>
      </div>
    </div>
  );
}
