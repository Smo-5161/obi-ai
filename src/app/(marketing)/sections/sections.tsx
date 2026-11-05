import Link from "next/link";
import CountUp from "./CountUp";
import SynapseBackground from "../SynapseBackground";

export function HeroSection() {
  return (
    <section data-section className="landing-hero relative w-full overflow-hidden">
      <SynapseBackground />
      <div className="landing-hero__layout relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-6">
        <div className="landing-hero__intro">
          <p className="landing-eyebrow st-item"><span className="landing-eyebrow-mark">O</span> L&apos;intelligence qui garde vos méthodes vivantes</p>
          <h1 className="st-item mt-7 max-w-2xl">
            Transmettez le <span className="landing-highlight">savoir-faire</span>, pas seulement le poste.
          </h1>
          <p
            data-typewriter="Vos processus deviennent une mémoire vivante. Votre successeur la questionne, elle répond."
            className="st-item mt-6 max-w-xl text-lg leading-relaxed"
          >
            Vos processus deviennent une mémoire vivante. Votre successeur la questionne,
            elle répond.
          </p>
          <div className="st-item landing-hero__actions mt-8 flex flex-wrap items-center gap-3">
            <Link href="/signup" className="landing-action landing-action--primary">
              Démarrer l&apos;essai gratuit <span aria-hidden>↗</span>
            </Link>
            <Link href="/#fonctionnement" className="landing-action landing-action--secondary">
              Découvrir Omi
            </Link>
          </div>
          <p className="landing-caption st-item mt-6">Capture automatique <span>·</span> Mémoire structurée <span>·</span> Réponses sourcées</p>
        </div>

        <div className="landing-product-window st-item" aria-label="Aperçu de la mémoire Omi">
          <div className="landing-window-bar">
            <div className="landing-window-brand"><span className="landing-window-mark">O</span><strong>Omi</strong></div>
            <span className="landing-window-location">Brain / Finance / Procédures</span>
            <span className="landing-window-status"><i /> À jour</span>
          </div>
          <div className="landing-window-main">
            <aside className="landing-window-sidebar">
              <p className="landing-overline">ESPACE DE TRAVAIL</p>
              <div className="landing-sidebar-active"><span>◈</span> Finance</div>
              <div><span>⌕</span> Recherche</div>
              <div><span>◷</span> Captures</div>
              <div className="landing-sidebar-divider" />
              <p className="landing-overline">PROCÉDURES RÉCENTES</p>
              <small>Reporting mensuel</small>
              <small>Suivi des budgets</small>
            </aside>
            <div className="landing-window-content">
              <div className="landing-window-heading">
                <div><p className="landing-overline">PROCÉDURE · FINANCE</p><h2>Reporting mensuel sur Supabase</h2></div>
                <span>•••</span>
              </div>
              <div className="landing-procedure-row"><b>01</b><div><strong>Ouvrir le dashboard Supabase</strong><small>Accéder au projet Finance</small></div><em>✓</em></div>
              <div className="landing-procedure-row"><b>02</b><div><strong>Exécuter la requête SQL</strong><small>Snippet closing_v3 · monthly_reporting</small></div><em>✓</em></div>
              <div className="landing-procedure-row"><b>03</b><div><strong>Exporter le résultat en CSV</strong><small>Ajouter les données au rapport mensuel</small></div><em>✓</em></div>
              <div className="landing-assistant-answer"><span>O</span><p><strong>Omi Companion</strong><br />Voici les étapes enregistrées pour ce processus, avec leur source.</p></div>
              <div className="landing-window-foot"><span>Source vérifiée</span><span>Reporting mensuel · 4 étapes</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "1. Le collaborateur enregistre son activité",
    text: "L'enregistreur capture l'écran, les commentaires vocaux et les actions (clics, saisies, applications, URLs) pendant l'exécution des tâches quotidiennes. Aucune rédaction manuelle de procédures.",
  },
  {
    title: "2. Omi structure la connaissance",
    text: "Chaque enregistrement est transcrit, découpé en procédures opératoires standard (SOP), nettoyé des données sensibles (emails, mots de passe, tokens, IBAN) et indexé dans une base vectorielle dédiée au poste.",
  },
  {
    title: "3. Le successeur est accompagné pas à pas",
    text: "L'agent conversationnel Omi répond aux questions du nouvel arrivant en s'appuyant sur la connaissance exacte du prédécesseur : démarches détaillées, outils, contacts clés, et le « pourquoi » des actions.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="fonctionnement" data-section className="landing-flow landing-steps w-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <h2 className="st-item mt-1 text-2xl leading-relaxed tracking-tight text-text-strong">Comment ça marche</h2>
        <p
          data-typewriter="Trois étapes, aucune rédaction manuelle de documentation. La connaissance se capture pendant le travail, se structure automatiquement, et se transmet à la demande."
          className="st-item mt-3 min-h-12 max-w-2xl text-foreground"
        >
          Trois étapes, aucune rédaction manuelle de documentation. La connaissance se
          capture pendant le travail, se structure automatiquement, et se transmet à la demande.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <article
              key={s.title}
              className="step-card st-item widget border-2 border-line bg-background p-6"
            >
              <h3 className="text-base leading-relaxed text-text-strong">{s.title}</h3>
              <div className="step-card__body">
                <p className="text-sm leading-relaxed text-foreground">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MetricsSection() {
  const metrics = [
    { value: 60, prefix: "-", suffix: " %", label: "de temps d'autonomie sur une tâche complexe" },
    { value: 90, prefix: "-", suffix: " %", label: "de temps passé par les équipes à former" },
    { value: 100, prefix: "", suffix: " %", label: "du savoir-faire capturé avant le départ" },
  ];
  return (
    <section data-section className="landing-proof landing-metrics w-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {metrics.map((m) => (
            <div
              key={m.value}
              className="st-item widget border-2 border-line bg-paper-raised p-6 text-center shadow-[4px_4px_0_0_var(--line)]"
            >
              <p className="text-3xl font-bold text-accent-bright">
                <CountUp target={m.value} prefix={m.prefix} suffix={m.suffix} />
              </p>
              <p className="mt-2 text-sm text-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Starter",
    price: "0",
    period: "/mois",
    description: "Pour découvrir Omi sur un poste isolé.",
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
    cta: { label: "Nous contacter", href: "mailto:contact@omi-ai.app" },
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="tarifs" data-section className="landing-plans landing-pricing w-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <h2 className="st-item mt-1 text-2xl leading-relaxed tracking-tight text-text-strong">Tarifs</h2>
        <p
          data-typewriter="Commencez gratuitement, évoluez quand la transmission devient systématique dans votre organisation. Sans engagement."
          className="st-item mt-3 min-h-12 max-w-2xl text-foreground"
        >
          Commencez gratuitement, évoluez quand la transmission devient systématique dans
          votre organisation. Sans engagement.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`st-item widget border-2 bg-paper-raised p-6 ${
                p.highlight ? "border-ink shadow-[6px_6px_0_0_var(--accent)]" : "border-line"
              }`}
            >
              {p.highlight && (
                <p className="mb-3 inline-block border-2 border-accent bg-accent px-2 py-0.5 text-xs font-bold text-background">
                  Le plus choisi
                </p>
              )}
              <h3 className="text-base leading-relaxed text-text-strong">{p.name}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold text-accent-bright">{p.price}</span>
                <span className="text-sm text-muted">{p.period ? " " + p.period : ""}</span>
              </p>
              <p className="mt-2 text-sm text-foreground">{p.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-foreground">
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
                    ? "border-accent bg-accent text-background"
                    : "border-line bg-paper text-text-strong"
                }`}
              >
                {p.cta.label}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section data-section className="landing-final landing-final-cta w-full bg-ink">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center text-paper">
        <h2
          data-typewriter="Le savoir-faire de vos équipes ne doit pas partir avec eux."
          className="st-item mx-auto min-h-16 max-w-3xl text-2xl leading-relaxed tracking-tight text-paper"
        >
          Le savoir-faire de vos équipes ne doit pas partir avec eux.
        </h2>
        <p
          data-typewriter="Déployez Omi.ai avant le prochain changement de poste, et transformez chaque départ en transmission structurée."
          className="st-item mx-auto mt-3 min-h-12 max-w-2xl text-paper/90"
        >
          Déployez Omi.ai avant le prochain changement de poste, et transformez chaque
          départ en transmission structurée.
        </p>
        <Link
          href="/signup"
          className="st-item btn-cubic mx-auto mt-8 inline-block border-2 border-paper bg-paper px-6 py-3 font-semibold text-ink shadow-[3px_3px_0_0_var(--accent)]"
        >
          Créer un compte gratuit
        </Link>
      </div>
    </section>
  );
}
