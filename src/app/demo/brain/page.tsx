import Link from "next/link";
import BrainVisualization from "@/components/BrainVisualization";
import { demoItems } from "@/lib/demo-brain";

export default function DemoBrainPage() {
  return (
    <div className="brain-manager demo-brain-manager">
      <aside className="brain-manager__sidebar">
        <div className="brain-manager__sidebar-top">
          <Link href="/demo" className="brain-manager__back">← Retour à la démo</Link>
          <Link href="/" className="brain-manager__brand" aria-label="Omi, accueil">
            <span className="brain-manager__brand-mark">O</span><span>Omi</span>
          </Link>
        </div>

        <section className="brain-manager__identity" aria-label="Brain de démonstration">
          <p className="brain-manager__eyebrow">COMPTE DÉMO · LECTURE SEULE</p>
          <h1>Marketing &amp; communication</h1>
          <p>Carte des procédures, sessions, repères et dépendances de l’équipe.</p>
        </section>

        <nav className="brain-manager__nav" aria-label="Navigation du Brain de démonstration">
          <a className="is-active" aria-current="page" href="#brain-map">
            <span className="brain-manager__nav-icon" aria-hidden="true">◎</span><span>Carte du Brain</span><strong>{demoItems.length}</strong>
          </a>
          <Link href="/login">
            <span className="brain-manager__nav-icon" aria-hidden="true">◇</span><span>Gérer les informations</span><strong>↗</strong>
          </Link>
        </nav>

        <details className="brain-manager__settings" open>
          <summary><span aria-hidden="true">⚙</span> Paramètres du Brain</summary>
          <dl>
            <div><dt>Équipe</dt><dd>Marketing</dd></div>
            <div><dt>Couverture</dt><dd>86%</dd></div>
            <div><dt>Éléments liés</dt><dd>{demoItems.length}</dd></div>
          </dl>
          <div className="brain-manager__duties">
            <span>Contexte</span>
            <ul><li>Procédures de campagne</li><li>Reporting d’équipe</li><li>Transmission des méthodes</li></ul>
          </div>
        </details>

        <div className="brain-manager__sidebar-footer"><span />Données fictives de démonstration</div>
      </aside>

      <main className="brain-manager__content" aria-label="Carte du Brain de démonstration">
        <div id="brain-map" className="brain-manager__map-view">
          <BrainVisualization items={demoItems} />
        </div>
        <div className="demo-manager__notice">
          <span>La démo n’accède pas aux données réelles.</span>
          <Link href="/login">Connectez-vous pour gérer un Brain ↗</Link>
        </div>
      </main>
    </div>
  );
}
