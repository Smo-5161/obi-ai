import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description:
    "Conditions générales d'utilisation du service Obi.ai — Onboarding Intelligence : accès au service, engagements de l'utilisateur, propriété intellectuelle, responsabilité et résiliation.",
};

const sections = [
  {
    h2: "1. Objet et acceptation",
    p: [
      "Les présentes conditions générales d'utilisation (« CGU ») régissent l'accès et l'utilisation du service Obi.ai (« le Service »), une plateforme de capture des processus métiers et d'accompagnement à l'onboarding. En créant un compte ou en utilisant le Service, vous acceptez les présentes CGU sans réserve.",
      "Le Service est fourni par l'éditeur d'Obi.ai (« l'Éditeur »). L'utilisation du Service à des fins professionnelles implique que vous disposez de l'autorité nécessaire pour engager l'entité que vous représentez.",
    ],
  },
  {
    h2: "2. Description du Service",
    p: [
      "Le Service permet notamment : l'enregistrement de l'activité d'un collaborateur (écran, voix, actions), la transcription et la structuration automatiques de ces enregistrements en procédures opératoires, le masquage automatique de certaines données sensibles, la constitution de bases de connaissances par poste (« Brains »), et un agent conversationnel d'accompagnement des nouveaux collaborateurs.",
      "Les fonctionnalités exactes et les limites quantitatives dépendent du plan d'abonnement souscrit, tel que décrit sur la page tarifaire du Service.",
    ],
  },
  {
    h2: "3. Compte utilisateur",
    p: [
      "L'accès au Service nécessite la création d'un compte. Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de vos identifiants. Vous êtes responsable de toute activité réalisée depuis votre compte.",
      "Vous vous engagez à n'utiliser le Service que dans un but conforme à la loi, notamment à ne pas l'utiliser pour capturer des contenus illicites ou porter atteinte aux droits de tiers, et à respecter les règles de votre organisation et la réglementation applicable en matière de surveillance des salariés.",
    ],
  },
  {
    h2: "4. Engagements spécifiques liés à la capture",
    p: [
      "Le Service repose sur l'enregistrement de l'activité professionnelle des utilisateurs. Avant toute capture impliquant des tiers (collègues, clients, partenaires), vous vous engagez à obtenir les autorisations requises et à informer les personnes concernées conformément à la réglementation applicable.",
      "Le masquage automatique des données sensibles est fourni à titre de mesure de précaution technique. Il ne dispense pas l'utilisateur de son obligation de vigilance : l'Éditeur ne garantit pas la détection de l'intégralité des données sensibles et recommande de ne pas exposer volontairement des secrets lors des enregistrements.",
    ],
  },
  {
    h2: "5. Propriété intellectuelle et licences",
    p: [
      "Vous conservez la propriété des contenus que vous enregistrez et déposez via le Service (« Vos Contenus »). Vous accordez à l'Éditeur une licence non exclusive, mondiale, pour la durée nécessaire à l'hébergement, l'indexation, la structuration et l'affichage de Vos Contenus dans le cadre du Service.",
      "Le Service, ses logiciels, ses modèles d'intelligence artificielle et sa documentation sont protégés par le droit de la propriété intellectuelle. Toute reproduction, adaptation ou redistribution non autorisée est interdite.",
    ],
  },
  {
    h2: "6. Données à caractère personnel",
    p: [
      "Le traitement des données à caractère personnel est décrit dans la Politique de confidentialité, qui fait partie intégrante des présentes CGU. L'Éditeur agit en qualité de responsable de traitement pour les données de compte et de sous-traitant pour Vos Contenus.",
    ],
  },
  {
    h2: "7. Tarifs, facturation et essai gratuit",
    p: [
      "Les plans payants sont facturés par avance, par utilisateur et par mois, sans engagement de durée sauf mention contraire. Sauf disposition légale contraire, les sommes versées ne sont pas remboursables en cas de résiliation en cours de période.",
      "Les essais gratuits donnent accès à certaines fonctionnalités pendant une durée limitée et se transforment en abonnement payant uniquement sur action explicite de l'utilisateur.",
    ],
  },
  {
    h2: "8. Disponibilité et support",
    p: [
      "L'Éditeur s'efforce de maintenir le Service disponible en continu, sous réserve des opérations de maintenance et des aléas techniques. Un engagement de disponibilité contractuel (SLA) peut être conclu dans le cadre du plan Entreprise.",
    ],
  },
  {
    h2: "9. Limitation de responsabilité",
    p: [
      "Le Service est fourni « en l'état ». L'Éditeur ne garantit pas l'exactitude, l'exhaustivité ou la pertinence des réponses générées par l'agent conversationnel ni des procédures dérivées des enregistrements. Vos Contenus relèvent de votre seule responsabilité.",
      "Sauf faute lourde ou dolosive, la responsabilité totale de l'Éditeur au titre des présentes CGU est limitée au montant des sommes versées par vous au cours des douze (12) derniers mois.",
    ],
  },
  {
    h2: "10. Résiliation et suppression des données",
    p: [
      "Vous pouvez résilier votre abonnement à tout moment depuis votre compte. En cas de résiliation, Vos Contenus sont désactivés immédiatement puis supprimés définitivement après une période de trente (30) jours, sauf obligation légale contraire.",
    ],
  },
  {
    h2: "11. Modification des CGU",
    p: [
      "L'Éditeur peut modifier les présentes CGU pour tenir compte de l'évolution du Service ou de la réglementation. Les utilisateurs sont informés des modifications substantielles par courriel au moins trente (30) jours avant leur entrée en vigueur. L'utilisation continue du Service vaut acceptation des nouvelles CGU.",
    ],
  },
  {
    h2: "12. Droit applicable",
    p: [
      "Les présentes CGU sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité ; à défaut, les tribunaux français compétents seront saisis.",
    ],
  },
];

export default function CguPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <div className="border-2 border-line bg-paper-raised p-8 md:p-10 shadow-[4px_4px_0_0_var(--line)]">
      <h1 className="text-3xl font-bold text-text-strong">Conditions générales d&apos;utilisation</h1>
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
