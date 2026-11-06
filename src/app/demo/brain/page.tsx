import Link from "next/link";
import BrainVisualization from "@/components/BrainVisualization";
import { demoItems } from "@/lib/demo-brain";

export default function DemoBrainPage() {
  return (
    <main className="demo-shell demo-brain-page">
      <header className="demo-header">
        <Link href="/" className="demo-brand"><span>O</span> Omi</Link>
        <div className="demo-header__right">
          <span className="demo-account">COMPTE DÉMO · LECTURE SEULE</span>
          <Link href="/login" className="demo-login-link">Connexion</Link>
        </div>
      </header>
      <div className="demo-content">
        <Link href="/demo" className="demo-back-link">← Retour au tableau de bord démo</Link>
        <section className="demo-brain-header demo-brain-page__heading">
          <div>
            <p className="demo-eyebrow">BRAIN · ÉQUIPE MARKETING</p>
            <h1>Marketing &amp; communication</h1>
            <p>Carte interactive des procédures, sessions, repères et dépendances de l’équipe.</p>
          </div>
          <span className="demo-coverage"><i /> Couverture 86%</span>
        </section>
        <BrainVisualization items={demoItems} />
        <footer className="demo-footer">
          <p>La démo est en lecture seule et n’accède à aucun compte ni aux données réelles.</p>
          <Link href="/login">Se connecter à Omi <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
    </main>
  );
}
