import Link from "next/link";
import { site } from "@/lib/site";
import { posts } from "@/lib/blog";
import BrainDemo from "./sections/BrainDemo";
import SynapseBackground from "./SynapseBackground";
import "./landing.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
      description: site.description,
    },
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: site.description,
      offers: {
        "@type": "Offer",
        price: "29",
        priceCurrency: "EUR",
        description: "Plan Team — par utilisateur et par mois",
      },
    },
  ],
};

const plans = [
  {
    name: "Starter",
    price: "0",
    period: "/mois",
    description: "Pour découvrir Omi sur un poste isolé.",
    features: ["1 Brain", "5 heures d’enregistrement / mois", "Masquage des données sensibles", "Support communautaire"],
    label: "POUR DÉCOUVRIR",
    href: "/signup",
    cta: "Commencer gratuitement",
  },
  {
    name: "Team",
    price: "29",
    period: "/utilisateur /mois",
    description: "Pour les équipes qui transmettent des postes régulièrement.",
    features: ["Brains et enregistrements illimités", "Copilote d’onboarding", "Dashboard de transition", "Graphe d’outils et contacts", "Support prioritaire"],
    label: "POUR LES ÉQUIPES",
    featured: true,
    href: "/signup",
    cta: "Essai gratuit 14 jours",
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    description: "Pour les organisations avec exigences de conformité.",
    features: ["Tout le plan Team", "SSO / SAML", "Hébergement régional dédié", "Accompagnement au déploiement"],
    label: "SUR MESURE",
    href: "mailto:contact@omi-ai.app",
    cta: "Parler à notre équipe",
  },
];

export default function LandingPage() {
  const latest = posts.slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="landing-page">
        <section className="landing-hero">
          <SynapseBackground />
          <p className="landing-eyebrow"><span /> LA MÉMOIRE DE VOTRE SAVOIR-FAIRE</p>
          <h1>Le savoir-faire de vos équipes reste dans l’entreprise.</h1>
          <p className="landing-hero__copy">
            Chaque méthode, chaque geste et chaque décision deviennent une mémoire claire, prête à transmettre.
          </p>
          <div className="landing-actions">
            <Link href="/signup" className="landing-button landing-button--dark">Démarrer gratuitement <span aria-hidden>↗</span></Link>
            <Link href="#demo" className="landing-button landing-button--text">Explorer la démo</Link>
          </div>

          <div className="landing-product" aria-label="Aperçu de l’espace de travail Omi">
            <div className="landing-product__topbar">
              <div className="landing-product__brand"><span>O</span><strong>omi</strong></div>
              <div className="landing-product__search">⌕ <span>Rechercher une méthode ou une procédure…</span></div>
              <div className="landing-product__profile">C</div>
            </div>
            <div className="landing-product__layout">
              <aside className="landing-product__sidebar">
                <p className="landing-product__section-label">ESPACE DE TRAVAIL</p>
                <div className="landing-product__nav landing-product__nav--active"><span>◈</span> Brain Finance</div>
                <div className="landing-product__nav"><span>⌕</span> Recherche</div>
                <div className="landing-product__nav"><span>◷</span> Captures</div>
                <p className="landing-product__section-label landing-product__section-label--spaced">PROCÉDURES RÉCENTES</p>
                <div className="landing-product__recent">Reporting mensuel</div>
                <div className="landing-product__recent">Suivi des budgets</div>
                <div className="landing-product__recent">Clôture trimestrielle</div>
                <div className="landing-product__sidebar-note"><i /> Brain synchronisé</div>
              </aside>
              <div className="landing-product__main">
                <div className="landing-product__heading">
                  <div><p className="landing-product__section-label">BRAIN FINANCE</p><h2>Bonjour, Camille</h2></div>
                  <span className="landing-product__updated"><i /> À jour</span>
                </div>
                <div className="landing-product__stats">
                  <div><small>PROCÉDURES</small><strong>38</strong><span>connaissances structurées</span></div>
                  <div><small>OUTILS</small><strong>12</strong><span>utilisés par l’équipe</span></div>
                  <div><small>CAPTURES</small><strong>24</strong><span>sessions documentées</span></div>
                </div>
                <div className="landing-product__question">
                  <div className="landing-product__question-mark">↳</div>
                  <div><small>QUESTION FRÉQUENTE</small><strong>Comment préparer le reporting mensuel ?</strong><span>Réponse fondée sur 4 étapes documentées</span></div>
                  <b aria-hidden>↗</b>
                </div>
                <div className="landing-product__answer">
                  <div className="landing-product__answer-top"><span>OMI COMPANION</span><small>Réponse vérifiée · 3 sources</small></div>
                  <p>Ouvrez le tableau de bord, exécutez la requête de clôture, puis exportez les résultats dans le modèle de reporting.</p>
                  <div className="landing-product__source">Source · Reporting mensuel sur Supabase <span>02:14 → 04:30</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="landing-proofline"><span>CAPTURER LE TRAVAIL</span><i /> <span>STRUCTURER LES MÉTHODES</span><i /> <span>TRANSMETTRE LE SAVOIR</span></div>
        </section>

        <section className="landing-partner-marquee" aria-label="Marques de démonstration, noms temporaires à remplacer">
          <p className="landing-partner-marquee__label">MARQUES DE DÉMONSTRATION · À REMPLACER</p>
          <div className="landing-partner-marquee__viewport">
            <div className="landing-partner-marquee__track" aria-hidden="true">
              <div className="landing-partner-marquee__group">
                <span className="landing-partner-logo landing-partner-logo--noro"><i />ATELIER NORO</span>
                <span className="landing-partner-logo landing-partner-logo--nord"><i />NORD STUDIO</span>
                <span className="landing-partner-logo landing-partner-logo--forme"><i />FORME LAB</span>
                <span className="landing-partner-logo landing-partner-logo--morrow"><i />Morrow Works</span>
                <span className="landing-partner-logo landing-partner-logo--folio"><i />FOLIO BUREAU</span>
                <span className="landing-partner-logo landing-partner-logo--rive"><i />RIVE & CO.</span>
              </div>
              <div className="landing-partner-marquee__group">
                <span className="landing-partner-logo landing-partner-logo--noro"><i />ATELIER NORO</span>
                <span className="landing-partner-logo landing-partner-logo--nord"><i />NORD STUDIO</span>
                <span className="landing-partner-logo landing-partner-logo--forme"><i />FORME LAB</span>
                <span className="landing-partner-logo landing-partner-logo--morrow"><i />Morrow Works</span>
                <span className="landing-partner-logo landing-partner-logo--folio"><i />FOLIO BUREAU</span>
                <span className="landing-partner-logo landing-partner-logo--rive"><i />RIVE & CO.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-overview" id="product">
          <div className="landing-section__intro">
            <p className="landing-eyebrow"><span /> UNE MÉMOIRE QUI SE CONSTRUIT AU QUOTIDIEN</p>
            <h2>Le travail continue. La connaissance reste.</h2>
            <p>Omi garde le contexte des postes et aide chaque personne à reprendre le fil avec confiance.</p>
          </div>
          <div className="landing-pillars">
            <article className="landing-pillar-card">
              <div className="landing-pillar-card__symbol landing-pillar-card__symbol--capture" aria-hidden="true">
                <svg viewBox="0 0 96 96" className="landing-wireframe landing-wireframe--capture"><g className="landing-wireframe__shape">
                    <path d="M22 24 66 17 74 62 30 69 22 24Z M22 24 30 30l44-7M30 30v39" />
                    <path d="M39 38h25M39 45h21M39 52h15" />
                    <circle cx="64" cy="31" r="3" />
                    <path d="m54 65 4-17 14 14-8 1 4 7-4 2-4-7Z" />
                    <circle cx="22" cy="24" r="2.2" /><circle cx="66" cy="17" r="2.2" />
                    <circle cx="74" cy="62" r="2.2" /><circle cx="30" cy="69" r="2.2" />
                  </g></svg>
              </div>
              <p className="landing-number">01</p>
              <h3>Le travail est capturé</h3>
              <p>Les méthodes se documentent pendant que les équipes réalisent leurs tâches, sans rédaction manuelle de procédures.</p>
              <span className="landing-pillar-card__arrow" aria-hidden="true">↗</span>
            </article>
            <article className="landing-pillar-card">
              <div className="landing-pillar-card__symbol landing-pillar-card__symbol--structure" aria-hidden="true">
                <svg viewBox="0 0 96 96" className="landing-wireframe landing-wireframe--structure"><g className="landing-wireframe__shape">
                    <path d="M35 11h21l9 7v21H35Z M56 11v7h9M40 23h18M40 29h13" />
                    <path d="M47 39v10m0 0L26 60m21-11L68 60" />
                    <path d="m17 60 9-5 9 5-9 5-9-5Zm0 0v11l9 5 9-5V60m3 0 9-5 9 5-9 5-9-5Zm0 0v11l9 5 9-5V60m3 0 9-5 9 5-9 5-9-5Zm0 0v11l9 5 9-5V60" />
                    <circle cx="47" cy="39" r="2.4" /><circle cx="26" cy="60" r="2.4" />
                    <circle cx="47" cy="60" r="2.4" /><circle cx="68" cy="60" r="2.4" />
                  </g></svg>
              </div>
              <p className="landing-number">02</p>
              <h3>La connaissance est structurée</h3>
              <p>Les sessions deviennent des étapes claires, reliées à leur contexte et organisées dans le Brain du poste.</p>
              <span className="landing-pillar-card__arrow" aria-hidden="true">↗</span>
            </article>
            <article className="landing-pillar-card">
              <div className="landing-pillar-card__symbol landing-pillar-card__symbol--verify" aria-hidden="true">
                <svg viewBox="0 0 96 96" className="landing-wireframe landing-wireframe--verify"><g className="landing-wireframe__shape">
                    <path d="m25 21 30-7 12 7v39l-30 7-12-7V21Zm30-7v10l12-3M33 29h24M33 36h20M33 43h14" />
                    <path d="m39 54 8-2m-8 8 6-1" />
                    <circle cx="64" cy="66" r="13" />
                    <path d="m58 66 5 5 10-12" />
                    <circle cx="25" cy="21" r="2.2" /><circle cx="55" cy="14" r="2.2" />
                    <circle cx="67" cy="21" r="2.2" /><circle cx="67" cy="60" r="2.2" />
                  </g></svg>
              </div>
              <p className="landing-number">03</p>
              <h3>Les réponses restent vérifiables</h3>
              <p>Chaque réponse renvoie aux étapes et aux sources enregistrées pour retrouver le bon détail.</p>
              <span className="landing-pillar-card__arrow" aria-hidden="true">↗</span>
            </article>
          </div>
        </section>

        <section className="landing-section landing-demo" id="demo">
          <div className="landing-demo__heading">
            <div><p className="landing-eyebrow"><span /> ESSAYEZ OMI</p><h2>Une réponse utile, avec son contexte.</h2></div>
            <p>Posez une question sur les procédures de démonstration et explorez les étapes qui la fondent.</p>
          </div>
          <div className="landing-demo__frame"><BrainDemo /></div>
        </section>

        <section className="landing-process" id="fonctionnement">
          <div className="landing-process__inner">
            <p className="landing-eyebrow"><span /> DE LA CAPTURE À LA TRANSMISSION</p>
            <h2>Une passation qui se fait au fil du travail.</h2>
            <div className="landing-process__steps">
              <article className="landing-process-card">
                <div className="landing-process-card__symbol" aria-hidden="true">
                  <svg viewBox="0 0 96 96" className="landing-wireframe landing-wireframe--capture">
                    <g className="landing-wireframe__shape">
                      <path d="M22 24h52v48H22zM28 31h40v32H28z" />
                      <path d="m22 36-9-7v38l9-7m52-24 9-7v38l-9-7M33 40h30m-30 8h18m-18 8h25" />
                      <circle cx="58" cy="48" r="5" />
                      <circle cx="22" cy="24" r="2.2" /><circle cx="74" cy="24" r="2.2" />
                      <circle cx="22" cy="72" r="2.2" /><circle cx="74" cy="72" r="2.2" />
                    </g>
                  </svg>
                </div>
                <p className="landing-process-card__number">01</p>
                <h3>Enregistrer</h3>
                <p>Les captures documentent l’écran, les actions et les explications pendant les tâches quotidiennes.</p>
              </article>
              <article className="landing-process-card">
                <div className="landing-process-card__symbol landing-process-card__symbol--organize" aria-hidden="true">
                  <svg viewBox="0 0 96 96" className="landing-wireframe landing-wireframe--organize">
                    <g className="landing-wireframe__shape">
                      <path d="M29 15h29l12 12v54H29zM58 15v14h12M37 40h24M37 49h24M37 58h16M37 67h20" />
                      <path d="m37 40 5 4 8-8m-13 22 5 4 8-8m-13 22 5 4 8-8" />
                      <circle cx="29" cy="15" r="2.2" /><circle cx="58" cy="15" r="2.2" />
                      <circle cx="70" cy="27" r="2.2" /><circle cx="70" cy="81" r="2.2" />
                    </g>
                  </svg>
                </div>
                <p className="landing-process-card__number">02</p>
                <h3>Organiser</h3>
                <p>Omi transforme les sessions en procédures et masque les données sensibles avant l’indexation.</p>
              </article>
              <article className="landing-process-card">
                <div className="landing-process-card__symbol landing-process-card__symbol--transmit" aria-hidden="true">
                  <svg viewBox="0 0 96 96" className="landing-wireframe landing-wireframe--transmit">
                    <g className="landing-wireframe__shape">
                      <circle cx="19" cy="48" r="7" />
                      <circle cx="74" cy="25" r="7" />
                      <circle cx="74" cy="71" r="7" />
                      <path d="M26 45 43 38 65 28M26 51l17 7 22 10M42 38v20m9-24v28m9-32v36" />
                      <path d="m60 24 9 2-4 8m-5 38 9-2-4-8M42 38l9 20 9-24" />
                    </g>
                  </svg>
                </div>
                <p className="landing-process-card__number">03</p>
                <h3>Transmettre</h3>
                <p>Le successeur retrouve les méthodes, les outils et les raisons derrière les étapes du poste.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section landing-pricing" id="tarifs">
          <div className="landing-section__intro">
            <p className="landing-eyebrow"><span /> DES TARIFS SIMPLES</p>
            <h2>Une mémoire utile à chaque étape.</h2>
            <p>Commencez sur un poste, puis ouvrez Omi à l’ensemble de vos équipes.</p>
          </div>
          <div className="landing-plans">
            {plans.map((plan) => (
              <article className={plan.featured ? "landing-plan landing-plan--featured" : "landing-plan"} key={plan.name}>
                <p className="landing-plan__label">{plan.label}</p>
                <h3>{plan.name}</h3>
                <p className="landing-plan__price">{plan.price}<small>{plan.period}</small></p>
                <p className="landing-plan__description">{plan.description}</p>
                <ul>{plan.features.map((feature) => <li key={feature}><span aria-hidden>✓</span>{feature}</li>)}</ul>
                <Link href={plan.href} className={plan.featured ? "landing-plan__cta landing-plan__cta--dark" : "landing-plan__cta"}>{plan.cta}<span aria-hidden>↗</span></Link>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section landing-journal">
          <div className="landing-journal__heading">
            <div><p className="landing-eyebrow"><span /> NOTES & GUIDES</p><h2>Des idées pour mieux transmettre.</h2></div>
            <Link href="/blog">Tous les articles <span aria-hidden>↗</span></Link>
          </div>
          <div className="landing-articles">
            {latest.map((post) => (
              <article key={post.slug}>
                <p className="landing-article__category">{post.category}</p>
                <h3><Link href={"/blog/" + post.slug}>{post.title}</Link></h3>
                <p className="landing-article__description">{post.description}</p>
                <span>{post.readingMinutes} min de lecture <b aria-hidden>↗</b></span>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-cta">
          <SynapseBackground />
          <p className="landing-eyebrow"><span /> OMI.AI</p>
          <h2>Ce que votre équipe sait mérite de rester.</h2>
          <p>Préservez les méthodes qui font avancer vos opérations et rendez-les accessibles à toute l’équipe.</p>
          <Link href="/signup" className="landing-button landing-button--light">Créer un compte gratuit <span aria-hidden>↗</span></Link>
        </section>
      </div>
    </>
  );
}
