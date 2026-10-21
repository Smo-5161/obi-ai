import Link from "next/link";
import { site } from "@/lib/site";

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

const steps = [
  {
    title: "1. Le collaborateur enregistre son activité",
    text: "L'enregistreur capture l'écran, les commentaires vocaux et les actions (clics, saisies, applications, URLs) pendant l'exécution des tâches quotidiennes. Aucune rédaction manuelle de procédures.",
  },
  {
    title: "2. Obi structure la connaissance",
    text: "Chaque enregistrement est transcrit, découpé en procédures opératoires standard (SOP), nettoyé des données sensibles (emails, mots de passe, tokens, IBAN) et indexé dans une base vectorielle dédiée au poste.",
  },
  {
    title: "3. Le successeur est accompagné pas à pas",
    text: "L'agent conversationnel Obi répond aux questions du nouvel arrivant en s'appuyant sur la connaissance exacte du prédécesseur : démarches détaillées, outils, contacts clés, et le « pourquoi » des actions.",
  },
];

const features = [
  {
    title: "Capture multi-modale",
    text: "Écran, voix et actions enregistrés simultanément. Transcription automatique haute précision et détection des applications utilisées.",
  },
  {
    title: "Job Brain vectoriel",
    text: "Une base de connaissances par fiche de poste : SOP structurées, graphe d'outils et de contacts clés, recherche sémantique.",
  },
  {
    title: "Masquage automatique des données sensibles",
    text: "Les PII, identifiants et données financières sont détectés et masqués avant toute indexation, dès la capture.",
  },
  {
    title: "Copilote d'onboarding",
    text: "Guidage pas à pas avec références aux extraits sources. Le nouvel arrivant progresse sans mobiliser les équipes en place.",
  },
  {
    title: "Dashboard de transition",
    text: "Taux de couverture du poste, vitesse d'onboarding et analyse des points de blocage récurrents, pour les managers et les RH.",
  },
  {
    title: "Zéro intervention humaine",
    text: "La transmission ne dépend plus de la disponibilité du prédécesseur : la connaissance est capturée en continu, disponible immédiatement.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "0",
    period: "/mois",
    description: "Pour découvrir Obi sur un poste isolé.",
    features: ["1 Brain", "5 heures d'enregistrement / mois", "Masquage des données sensibles", "Support communautaire"],
    cta: { label: "Commencer gratuitement", href: "/signup" },
    highlight: false,
  },
  {
    name: "Team",
    price: "29",
    period: "/utilisateur /mois",
    description: "Pour les équipes qui transmettent des postes régulièrement.",
    features: [
      "Brains illimités",
      "Enregistrement illimité",
      "Copilote d'onboarding (chat)",
      "Dashboard de transition",
      "Graphe d'outils et contacts",
      "Support prioritaire",
    ],
    cta: { label: "Essai gratuit 14 jours", href: "/signup" },
    highlight: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    description: "Pour les organisations avec exigences de conformité.",
    features: [
      "Tout le plan Team",
      "SSO / SAML",
      "Hébergement régional dédié",
      "Engagement contractuel (SLA)",
      "Accompagnement au déploiement",
    ],
    cta: { label: "Nous contacter", href: "mailto:contact@obi-ai.app" },
    highlight: false,
  },
];

const metrics = [
  { value: "-60 %", label: "de temps d'autonomie sur une tâche complexe" },
  { value: "-90 %", label: "de temps passé par les équipes à former" },
  { value: "100 %", label: "du savoir-faire capturé avant le départ" },
];

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="reveal mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="inline-block border-2 border-line bg-paper px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
          Onboarding Intelligence
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-text-strong md:text-5xl">
          Transmettez le savoir-faire, pas seulement le poste.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground">
          Obi.ai capture les processus métiers de vos collaborateurs, construit une base de
          connaissances vectorielle par fiche de poste, et accompagne le nouvel arrivant
          pas à pas. La transmission ne dépend plus de la disponibilité de chacun.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="btn-cubic border-2 border-ink bg-accent px-6 py-3 font-semibold text-paper"
          >
            Démarrer l&apos;essai gratuit
          </Link>
          <Link
            href="/#fonctionnement"
            className="btn-cubic border-2 border-accent bg-paper-raised px-6 py-3 font-semibold text-text-strong"
          >
            Voir comment ça marche
          </Link>
        </div>
      </section>

      <section className="reveal border-y-2 border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.value} className="text-center">
              <p className="text-3xl font-bold text-accent-bright">{m.value}</p>
              <p className="mt-2 text-sm text-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fonctionnement" className="reveal mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-text-strong">Comment ça marche</h2>
        <p className="mt-3 max-w-2xl text-foreground">
          Trois étapes, aucune rédaction manuelle de documentation. La connaissance se
          capture pendant le travail, se structure automatiquement, et se transmet à la demande.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.title} className="widget reveal-child border-2 border-line bg-paper-raised p-6">
              <h3 className="font-bold text-text-strong">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="fonctionnalites" className="reveal border-y-2 border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-strong">Fonctionnalités</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="widget reveal-child border-2 border-line bg-paper-raised p-6">
                <h3 className="font-bold text-text-strong">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifs" className="reveal mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-text-strong">Tarifs</h2>
        <p className="mt-3 max-w-2xl text-foreground">
          Commencez gratuitement, évoluez quand la transmission devient systématique dans
          votre organisation. Sans engagement.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`widget border-2 bg-paper p-8 ${
                p.highlight ? "border-ink shadow-[6px_6px_0_0_var(--accent)]" : "border-line"
              }`}
            >
              {p.highlight && (
                <p className="mb-3 inline-block border-2 border-accent bg-accent px-2 py-0.5 text-xs font-bold text-background">
                  Le plus choisi
                </p>
              )}
              <h3 className="text-lg font-bold text-text-strong">{p.name}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold text-accent-bright">{p.price}</span>
                <span className="text-sm text-muted">{p.period ? " " + p.period : ""}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{p.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-muted">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span aria-hidden className="font-bold text-accent">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.cta.href}
                className={`btn-cubic mt-6 block border-2 px-4 py-2.5 text-center font-semibold ${
                  p.highlight
                    ? "border-ink bg-ink text-paper"
                    : "border-ink bg-paper text-ink"
                }`}
              >
                {p.cta.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal border-t-2 border-line bg-ink">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center text-paper">
          <h2 className="text-3xl font-bold tracking-tight text-paper">
            Le savoir-faire de vos équipes ne doit pas partir avec eux.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-paper/90">
            Déployez Obi.ai avant le prochain changement de poste, et transformez chaque
            départ en transmission structurée.
          </p>
          <Link
            href="/signup"
            className="btn-cubic mt-8 inline-block border-2 border-paper bg-paper px-6 py-3 font-semibold text-ink shadow-[3px_3px_0_0_var(--accent)]"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
