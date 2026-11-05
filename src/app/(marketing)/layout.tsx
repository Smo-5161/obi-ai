import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Omi.ai — Onboarding Mentor Intelligence" } };

const nav = [
  { href: "/#product", label: "Produit" },
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="design-shell marketing-shell">
      <header className="marketing-header">
        <div className="marketing-header__inner">
          <Link href="/" className="marketing-wordmark" aria-label="Omi.ai, accueil">
            <span className="marketing-wordmark__mark">O</span><span>omi</span>
          </Link>
          <nav className="marketing-nav" aria-label="Navigation principale">
            {nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
          <div className="marketing-header__actions">
            <Link href="/login" className="marketing-login">Connexion</Link>
            <Link href="/signup" className="marketing-header__cta">Essai gratuit <span aria-hidden>↗</span></Link>
          </div>
        </div>
      </header>
      <main className="marketing-main">{children}</main>
      <footer className="marketing-footer">
        <div className="marketing-footer__main">
          <div className="marketing-footer__brand">
            <Link href="/" className="marketing-wordmark"><span className="marketing-wordmark__mark">O</span><span>omi</span></Link>
            <p>La mémoire opérationnelle de vos équipes, accessible et prête à transmettre.</p>
          </div>
          <div>
            <p className="marketing-footer__heading">Produit</p>
            <Link href="/#product">Produit</Link><Link href="/#fonctionnement">Fonctionnement</Link><Link href="/#tarifs">Tarifs</Link>
          </div>
          <div>
            <p className="marketing-footer__heading">Ressources</p>
            <Link href="/blog">Blog</Link><Link href="/faq">FAQ</Link><Link href="/legal/cgu">Conditions d’utilisation</Link><Link href="/legal/privacy">Confidentialité</Link>
          </div>
          <div>
            <p className="marketing-footer__heading">Compte</p>
            <Link href="/login">Connexion</Link><Link href="/signup">Inscription</Link>
          </div>
        </div>
        <div className="marketing-footer__bottom"><span>© {new Date().getFullYear()} Omi.ai</span><span>Conçu pour préserver le savoir-faire des équipes.</span></div>
      </footer>
    </div>
  );
}
