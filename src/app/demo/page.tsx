import Link from "next/link";
import { demoItems } from "@/lib/demo-brain";



export default function DemoPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <Link href="/" className="demo-brand"><span>O</span> Omi</Link>
        <div className="demo-header__right">
          <span className="demo-account">COMPTE DÉMO · LECTURE SEULE</span>
          <Link href="/login" className="demo-login-link">Connexion</Link>
        </div>
      </header>

      <div className="demo-content">
        <section className="demo-intro">
          <p className="demo-eyebrow">ESPACE DE DÉMONSTRATION</p>
          <h1>Bonjour, compte démo.</h1>
          <p>Explorez comment Omi transforme le savoir-faire quotidien en une mémoire partagée et consultable.</p>
        </section>

        <section className="demo-metrics" aria-label="Résumé du compte démo">
          <article><span>Brains</span><strong>3</strong><small>postes documentés</small></article>
          <article><span>Procédures</span><strong>18</strong><small>étapes réutilisables</small></article>
          <article><span>Connaissances</span><strong>42</strong><small>éléments reliés</small></article>
        </section>

        <section className="demo-brain-header">
          <div>
            <p className="demo-eyebrow">BRAIN · ÉQUIPE MARKETING</p>
            <h2>Marketing &amp; communication</h2>
            <p>Les méthodes, outils et repères de l’équipe réunis dans un seul espace.</p>
          </div>
          <span className="demo-coverage"><i /> Couverture 86%</span>
        </section>

        <section className="demo-map-entry">
          <div>
            <p className="demo-eyebrow">CARTE DU BRAIN</p>
            <h2>Une mémoire, reliée.</h2>
            <p>Parcourez les procédures, sessions et repères de l’équipe sur une carte interactive.</p>
          </div>
          <Link href="/demo/brain">Explorer le Brain <span aria-hidden="true">↗</span></Link>
        </section>

        <section className="demo-sample-data">
          <div className="demo-sample-data__heading">
            <div><p className="demo-eyebrow">APERÇU</p><h2>Quelques éléments du Brain</h2></div>
            <span>Échantillon de démonstration</span>
          </div>
          <div className="demo-sample-grid">
            {demoItems.slice(0, 4).map((item) => (
              <article key={item.id}>
                <span>{item.kind === "process" ? "PROCÉDURE" : item.kind === "session" ? "SESSION" : item.kind === "insight" ? "REPÈRE" : "CONNAISSANCE"}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="demo-footer">
          <p>Les données affichées sont fictives. La démo ne se connecte pas à votre espace ni à votre compte.</p>
          <Link href="/login">Se connecter à Omi <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
    </main>
  );
}
