import Link from "next/link";
import BrainVisualization, { type BrainVisualItem } from "@/components/BrainVisualization";

const demoItems: BrainVisualItem[] = [
  { id: "sop-1", kind: "process", title: "Préparer le reporting mensuel", description: "Étapes, contrôles et outils utilisés pour préparer le rapport mensuel." },
  { id: "sop-2", kind: "process", title: "Publier une campagne", description: "Validation du contenu, programmation et contrôle après publication." },
  { id: "rec-1", kind: "session", title: "Session de clôture — 12 juin", description: "Une session de travail de 38 minutes, transformée en procédures réutilisables." },
  { id: "ins-1", kind: "insight", title: "Le suivi se fait le lundi", description: "L’équipe met à jour les indicateurs en début de semaine." },
  { id: "ins-2", kind: "insight", title: "Validation par Camille", description: "Le responsable valide les contenus avant leur diffusion." },
  { id: "dep-1", kind: "dependency", title: "Notion", description: "Outil associé à 4 procédures de l’équipe." },
  { id: "dep-2", kind: "dependency", title: "Camille · Marketing", description: "Contact clé cité dans 3 procédures." },
  { id: "doc-1", kind: "knowledge", title: "Convention de nommage", description: "Les campagnes utilisent le format AAAA-MM · Canal · Sujet." },
  { id: "rec-2", kind: "session", title: "Onboarding d’un nouveau collègue", description: "Les accès, rituels d’équipe et méthodes de travail présentés à l’arrivée." },
  { id: "sop-3", kind: "process", title: "Contrôler les données", description: "Vérifier les champs requis et signaler les valeurs incohérentes." },
  { id: "ins-3", kind: "insight", title: "Reporting partagé", description: "Les chiffres sont centralisés dans un tableau commun." },
];

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

        <BrainVisualization items={demoItems} />

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
