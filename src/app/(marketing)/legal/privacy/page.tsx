import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité d'Obi.ai : données collectées, finalités, base légale, durées de conservation, sous-traitants et exercice de vos droits.",
};

const sections = [
  {
    h2: "1. Responsable du traitement",
    p: [
      "Obi.ai (l'Éditeur) traite des données à caractère personnel dans le cadre du Service. Pour toute question relative à vos données, vous pouvez contacter l'Éditeur à l'adresse contact@obi-ai.app.",
    ],
  },
  {
    h2: "2. Données collectées",
    p: [
      "Données de compte : adresse électronique, nom, informations de facturation.",
      "Données de contenu : enregistrements d'écran, transcriptions, logs d'actions, procédures structurées et conversations avec l'agent d'onboarding.",
      "Données techniques : journaux de connexion, informations d'appareil et indicateurs d'usage nécessaires à la sécurité et au fonctionnement du Service.",
    ],
  },
  {
    h2: "3. Finalités et bases légales",
    p: [
      "Fourniture du Service (exécution du contrat) : hébergement, indexation et restitution de vos contenus, fonctionnement de l'agent conversationnel.",
      "Sécurité et lutte contre la fraude (intérêt légitime) : authentification, journalisation, détection des usages anormaux.",
      "Facturation et obligations comptables (obligation légale).",
    ],
  },
  {
    h2: "4. Données sensibles et mesure de précaution",
    p: [
      "Le Service met en œuvre un masquage automatique de certaines catégories de données sensibles (identifiants, coordonnées bancaires, secrets) avant indexation. Ce traitement automatique est une mesure de précaution et non une garantie absolue : il appartient à l'utilisateur de veiller à ne pas exposer de secrets pendant les enregistrements et d'obtenir les autorisations des personnes susceptibles d'apparaître dans les captures.",
    ],
  },
  {
    h2: "5. Durées de conservation",
    p: [
      "Les contenus sont conservés pendant la durée de l'abonnement, puis supprimés dans un délai de trente (30) jours après résiliation, sauf obligation légale contraire. Les journaux techniques sont conservés douze (12) mois maximum.",
    ],
  },
  {
    h2: "6. Sous-traitants et hébergement",
    p: [
      "L'Éditeur recourt à des sous-traitants techniques pour l'hébergement (infrastructure cloud située dans l'Union européenne) et les modèles d'intelligence artificielle. Ces prestataires sont liés par des clauses de confidentialité et de protection des données conformes au RGPD.",
    ],
  },
  {
    h2: "7. Vos droits",
    p: [
      "Conformément au RGPD, vous disposez de droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité sur vos données. Vous pouvez exercer ces droits à l'adresse contact@obi-ai.app. Vous pouvez également introduire une réclamation auprès de la CNIL.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <div className="border-2 border-line bg-paper-raised p-8 md:p-10 shadow-[4px_4px_0_0_var(--line)]">
      <h1 className="text-3xl font-bold text-text-strong">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-muted">Dernière mise à jour : 1er janvier 2025</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.h2}>
            <h2 className="text-lg font-semibold text-text-strong">{s.h2}</h2>
            {s.p.map((para, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed text-foreground">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
          </div>
    </article>
  );
}
