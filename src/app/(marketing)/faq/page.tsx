import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes",
  description:
    "Questions fréquentes sur Obi.ai : capture des processus métiers, sécurité des données sensibles, fonctionnement de la base de connaissances et de l'agent d'onboarding.",
};

const faqs = [
  {
    q: "Obi.ai remplace-t-il la formation humaine ?",
    a: "Obi.ai ne remplace pas la relation humaine : il élimine la partie répétitive et chronophage de la transmission, c'est-à-dire l'explication des procédures opérationnelles. Le prédécesseur n'a plus à répéter ni à rédiger ; le nouvel arrivant pose ses questions à tout moment. Les échanges humains peuvent alors se concentrer sur le contexte stratégique et relationnel.",
  },
  {
    q: "Comment sont protégées les données sensibles capturées ?",
    a: "Chaque enregistrement passe par un module de détection et de masquage automatique avant toute indexation : emails, mots de passe, tokens d'API, IBAN, numéros de carte et adresses IP sont remplacés par des balises neutres. Les données ne sont jamais stockées en clair dans la base de connaissances.",
  },
  {
    q: "Faut-il enregistrer tous les process en avance ?",
    a: "Non. La capture fonctionne en continu : le collaborateur enregistre ses tâches quand il les exécute, au fil des semaines. Plus le Brain est alimenté, plus le taux de couverture du poste est élevé, mais l'agent est utile dès le premier enregistrement.",
  },
  {
    q: "Que se passe-t-il si Obi ne connaît pas la réponse ?",
    a: "L'agent l'indique clairement et signale le sujet manquant. Ces questions non résolues remontent dans le dashboard sous forme de points de blocage, ce qui indique précisément quel processus il reste à enregistrer.",
  },
  {
    q: "Qui a accès aux enregistrements d'un poste ?",
    a: "L'accès aux Brains est restreint aux comptes autorisés de votre organisation. Les managers et RH disposent d'une vue analytics sur la progression de la transmission, sans accès aux contenus bruts des enregistrements si vous le configurez ainsi.",
  },
  {
    q: "Combien de temps faut-il pour que la transmission soit opérationnelle ?",
    a: "Dès le premier enregistrement, l'agent peut répondre aux questions sur ce processus. En pratique, quelques semaines de capture régulière suffisent à couvrir l'essentiel d'une fiche de poste, contre plusieurs semaines de compagnonnage humain classique.",
  },
  {
    q: "Obi.ai fonctionne-t-il avec nos outils existants ?",
    a: "Oui. La capture est indépendante des applications : tout ce qui s'affiche à l'écran et se commente vocalement est capturable. Le graphe de dépendances recense automatiquement les outils (SaaS, bases de données, messageries) utilisés dans chaque processus.",
  },
  {
    q: "Puis-je essayer Obi.ai gratuitement ?",
    a: "Oui. Le plan Starter permet de créer un Brain et d'enregistrer jusqu'à 5 heures de processus par mois, sans carte bancaire. Le plan Team est proposé avec 14 jours d'essai gratuit.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="border-2 border-line bg-paper-raised p-8 md:p-10 shadow-[4px_4px_0_0_var(--line)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold text-text-strong">Questions fréquentes</h1>
      <p className="mt-3 text-foreground">
        Tout ce qu&apos;il faut savoir sur la transmission de savoir-faire avec Obi.ai.
      </p>
      <div className="mt-10 divide-y divide-line">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="cursor-pointer list-none font-medium text-text-strong marker:hidden">
              {f.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{f.a}</p>
          </details>
        ))}
      </div>
      </div>
      <p className="mt-10 text-sm text-foreground">
        Une autre question ?{" "}
        <Link href="mailto:contact@obi-ai.app" className="font-medium text-accent underline hover:text-accent-bright">
          Écrivez-nous
        </Link>{" "}
        ou consultez les{" "}
        <Link href="/legal/cgu" className="font-medium text-accent underline hover:text-accent-bright">
          conditions générales
        </Link>
        .
      </p>
    </div>
  );
}
