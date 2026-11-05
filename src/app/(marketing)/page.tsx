import Link from "next/link";
import { site } from "@/lib/site";
import SectionTransition from "./SectionTransition";
import { HeroSection } from "./sections/sections";
import BrainDemo from "./sections/BrainDemo";
import { posts } from "@/lib/blog";

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

export default function LandingPage() {
  const latest = posts.slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SectionTransition />
      <div className="omi-home">
        <HeroSection />

        <section className="omi-home__pillars" data-section>
          <div className="omi-home__container">
            <div className="omi-home__section-intro">
              <p className="omi-home__eyebrow st-item">LA MÉMOIRE DE VOTRE SAVOIR-FAIRE</p>
              <h2 className="st-item">Le savoir-faire reste accessible, même quand les équipes changent.</h2>
            </div>
            <div className="omi-home__pillar-grid">
              <article className="omi-home__pillar st-item"><span className="omi-home__index">01</span><h3>Capturer le travail réel</h3><p>Les gestes, les outils et les décisions deviennent une mémoire vivante, sans rédaction manuelle de procédures.</p></article>
              <article className="omi-home__pillar st-item"><span className="omi-home__index">02</span><h3>Structurer ce qui compte</h3><p>Omi transforme les sessions en procédures claires, organisées par poste et nettoyées des données sensibles.</p></article>
              <article className="omi-home__pillar st-item"><span className="omi-home__index">03</span><h3>Retrouver les bonnes réponses</h3><p>Le nouvel arrivant interroge la mémoire du poste et retrouve les étapes avec leurs sources.</p></article>
            </div>
          </div>
        </section>

        <section className="omi-home__demo" id="demo" data-section>
          <div className="omi-home__container">
            <div className="omi-home__demo-heading">
              <div><p className="omi-home__eyebrow st-item">EXPLOREZ LE BRAIN</p><h2 className="st-item">Une mémoire qui sait répondre.</h2><p className="st-item">Essayez une conversation avec Omi à partir des procédures de démonstration.</p></div>
              <span className="omi-home__live-label"><i /> Démo interactive</span>
            </div>
            <div className="omi-home__demo-frame st-item"><BrainDemo /></div>
          </div>
        </section>

        <section className="omi-home__workflow" id="fonctionnement" data-section>
          <div className="omi-home__container">
            <div className="omi-home__section-intro"><p className="omi-home__eyebrow st-item">DE LA CAPTURE À L’AUTONOMIE</p><h2 className="st-item">La transmission se construit pendant le travail.</h2></div>
            <div className="omi-home__steps">
              <article className="omi-home__step st-item"><span>01</span><h3>Le travail est capturé</h3><p>Écran, commentaires et actions documentent les tâches quotidiennes pendant qu’elles sont réalisées.</p></article>
              <article className="omi-home__step st-item"><span>02</span><h3>La connaissance est structurée</h3><p>Omi transcrit, découpe les sessions en SOP, masque les données sensibles et les classe dans le Brain du poste.</p></article>
              <article className="omi-home__step st-item"><span>03</span><h3>Le successeur avance seul</h3><p>Il pose ses questions à Omi et suit des démarches détaillées, appuyées par les sources du prédécesseur.</p></article>
            </div>
          </div>
        </section>

        <section className="omi-home__features" data-section>
          <div className="omi-home__container omi-home__feature-layout">
            <div className="omi-home__feature-copy"><p className="omi-home__eyebrow st-item">CONÇU POUR LE QUOTIDIEN</p><h2 className="st-item">Tout le contexte d’un poste. Au même endroit.</h2><p className="st-item">Des pratiques tacites aux outils utilisés : Omi rassemble les détails qui permettent à quelqu’un de reprendre le travail sans repartir de zéro.</p><Link href="/signup" className="omi-home__text-link st-item">Découvrir Omi <span aria-hidden>↗</span></Link></div>
            <div className="omi-home__feature-list">
              <div className="omi-home__feature-row st-item"><span>01</span><div><h3>Procédures détaillées</h3><p>Des étapes concrètes, reliées à leur enregistrement source.</p></div><b>↗</b></div>
              <div className="omi-home__feature-row st-item"><span>02</span><div><h3>Données sensibles masquées</h3><p>Les informations personnelles sont retirées avant l’indexation.</p></div><b>↗</b></div>
              <div className="omi-home__feature-row st-item"><span>03</span><div><h3>Connaissance qui s’enrichit</h3><p>Les nouvelles captures mettent à jour le Brain au fil du temps.</p></div><b>↗</b></div>
            </div>
          </div>
        </section>

        <section className="omi-home__video" data-section>
          <div className="omi-home__container">
            <div className="omi-home__video-heading"><div><p className="omi-home__eyebrow st-item">EN UNE MINUTE</p><h2 className="st-item">Voyez Omi en action.</h2></div><p className="st-item">De la capture d’un processus à sa transmission, étape par étape.</p></div>
            <div className="omi-home__video-frame st-item"><video controls preload="metadata" poster="/video-poster.svg" aria-label="Présentation d’Omi"><source src="/presentation.mp4" type="video/mp4" />Votre navigateur ne supporte pas la vidéo.</video></div>
          </div>
        </section>

        <section className="omi-home__pricing" id="tarifs" data-section>
          <div className="omi-home__container">
            <div className="omi-home__section-intro"><p className="omi-home__eyebrow st-item">TARIFS</p><h2 className="st-item">Commencez simplement. Évoluez avec vos besoins.</h2><p className="st-item">Sans engagement, avec un essai gratuit pour le plan Team.</p></div>
            <div className="omi-home__plans">
              <article className="omi-home__plan st-item"><p className="omi-home__plan-label">POUR DÉCOUVRIR</p><h3>Starter</h3><p className="omi-home__price">0 <small>/mois</small></p><p>Pour un poste isolé et une première mémoire de travail.</p><ul><li>1 Brain</li><li>5 heures d’enregistrement / mois</li><li>Masquage des données sensibles</li><li>Support communautaire</li></ul><Link href="/signup">Commencer gratuitement <span aria-hidden>↗</span></Link></article>
              <article className="omi-home__plan omi-home__plan--featured st-item"><p className="omi-home__plan-label">POUR LES ÉQUIPES</p><h3>Team <span>Le plus choisi</span></h3><p className="omi-home__price">29 <small>/utilisateur /mois</small></p><p>Pour les équipes qui transmettent des postes régulièrement.</p><ul><li>Brains et enregistrements illimités</li><li>Copilote d’onboarding</li><li>Dashboard de transition</li><li>Graphe d’outils et contacts</li><li>Support prioritaire</li></ul><Link href="/signup">Essai gratuit 14 jours <span aria-hidden>↗</span></Link></article>
              <article className="omi-home__plan st-item"><p className="omi-home__plan-label">SUR MESURE</p><h3>Entreprise</h3><p className="omi-home__price">Sur devis</p><p>Pour les organisations avec exigences de conformité.</p><ul><li>Tout le plan Team</li><li>SSO / SAML</li><li>Hébergement régional dédié</li><li>Accompagnement au déploiement</li></ul><a href="mailto:contact@omi-ai.app">Parler à notre équipe <span aria-hidden>↗</span></a></article>
            </div>
          </div>
        </section>

        <section className="omi-home__journal" data-section>
          <div className="omi-home__container">
            <div className="omi-home__journal-heading"><div><p className="omi-home__eyebrow st-item">NOTES & GUIDES</p><h2 className="st-item">Pour mieux transmettre.</h2></div><Link href="/blog" className="st-item">Tous les articles <span aria-hidden>↗</span></Link></div>
            <div className="omi-home__journal-grid">
              {latest.map((post) => <article className="omi-home__post st-item" key={post.slug}><p>{post.category}</p><h3><Link href={"/blog/" + post.slug}>{post.title}</Link></h3><p>{post.description}</p><span>{post.readingMinutes} min de lecture <span aria-hidden>↗</span></span></article>)}
            </div>
          </div>
        </section>

        <section className="omi-home__closing" data-section>
          <div className="omi-home__container"><p className="omi-home__eyebrow st-item">OMI.AI</p><h2 className="st-item">Le savoir-faire de vos équipes mérite de rester.</h2><p className="st-item">Faites de chaque départ une continuité, et de chaque prise de poste un nouveau départ.</p><Link className="st-item" href="/signup">Créer un compte gratuit <span aria-hidden>↗</span></Link></div>
        </section>
      </div>
    </>
  );
}
