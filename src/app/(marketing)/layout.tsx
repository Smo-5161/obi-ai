import Link from "next/link";
import type { Metadata } from "next";
import SynapseBackground from "./SynapseBackground";

export const metadata: Metadata = { title: { absolute: "Obi.ai — Onboarding Intelligence" } };

const nav = [
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/faq", label: "FAQ" },
  { href: "/login", label: "Connexion" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-ink">
      <SynapseBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b-2 border-line bg-paper">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="border-2 border-ink bg-accent px-2 py-1 text-sm text-paper shadow-[3px_3px_0_0_var(--ink)]">
                Obi
              </span>
              <span className="text-lg tracking-tight">Onboarding Intelligence</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-muted">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="transition-colors hover:text-accent">
                  {n.label}
                </Link>
              ))}
              <Link
                href="/signup"
                className="btn-cubic border-2 border-ink bg-ink px-4 py-2 font-semibold text-paper"
              >
                Essai gratuit
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t-2 border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-sm text-muted md:grid-cols-4">
            <div>
              <p className="font-bold text-ink">Obi.ai</p>
              <p className="mt-2">Onboarding Intelligence. La continuité opérationnelle par la capture des processus métiers.</p>
            </div>
            <div>
              <p className="font-bold text-ink">Produit</p>
              <ul className="mt-2 space-y-1">
                <li><Link href="/#fonctionnement" className="hover:text-accent">Fonctionnement</Link></li>
                <li><Link href="/#fonctionnalites" className="hover:text-accent">Fonctionnalités</Link></li>
                <li><Link href="/#tarifs" className="hover:text-accent">Tarifs</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-ink">Ressources</p>
              <ul className="mt-2 space-y-1">
                <li><Link href="/faq" className="hover:text-accent">FAQ</Link></li>
                <li><Link href="/legal/cgu" className="hover:text-accent">CGU</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-accent">Confidentialité</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-ink">Compte</p>
              <ul className="mt-2 space-y-1">
                <li><Link href="/login" className="hover:text-accent">Connexion</Link></li>
                <li><Link href="/signup" className="hover:text-accent">Inscription</Link></li>
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
