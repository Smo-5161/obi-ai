import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Obi.ai — Onboarding Intelligence" } };

const nav = [
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/faq", label: "FAQ" },
  { href: "/login", label: "Connexion" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="rounded bg-slate-900 px-2 py-1 text-sm text-white">Obi</span>
            <span className="text-lg text-slate-900">Onboarding Intelligence</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-600">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-slate-900">
                {n.label}
              </Link>
            ))}
            <Link
              href="/signup"
              className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
            >
              Essai gratuit
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-sm text-slate-600 md:grid-cols-4">
          <div>
            <p className="font-semibold text-slate-900">Obi.ai</p>
            <p className="mt-2">Onboarding Intelligence. La continuité opérationnelle par la capture des processus métiers.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Produit</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/#fonctionnement" className="hover:text-slate-900">Fonctionnement</Link></li>
              <li><Link href="/#fonctionnalites" className="hover:text-slate-900">Fonctionnalités</Link></li>
              <li><Link href="/#tarifs" className="hover:text-slate-900">Tarifs</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Ressources</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/faq" className="hover:text-slate-900">FAQ</Link></li>
              <li><Link href="/legal/cgu" className="hover:text-slate-900">CGU</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-slate-900">Confidentialité</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Compte</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/login" className="hover:text-slate-900">Connexion</Link></li>
              <li><Link href="/signup" className="hover:text-slate-900">Inscription</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Obi.ai — Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
