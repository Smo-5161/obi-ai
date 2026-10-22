export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  category: string;
  content: { type: "p" | "h2" | "list"; text: string }[];
}

export const posts: BlogPost[] = [
  {
    slug: "transmettre-savoir-faire-depart-collaborateur",
    title: "Transmettre le savoir-faire avant un départ : la méthode complète",
    description:
      "Un collaborateur sur trois part avec un savoir-faire irremplaçable. Voici la méthode pour capturer, structurer et transmettre les processus métiers avant le jour du départ.",
    date: "2025-01-15",
    readingMinutes: 6,
    category: "Transmission",
    content: [
      { type: "p", text: "Le départ d'un collaborateur expérimenté coûte bien plus que le recrutement de son remplaçant. Ce qui part, c'est un savoir-faire contextuel : les raccourcis connus, les contacts implicites, les exceptions aux règles officielles, le « pourquoi » des processus — ce que les wikis d'entreprise ne contiennent jamais." },
      { type: "h2", text: "Pourquoi 80 % du savoir-faire ne s'écrit pas" },
      { type: "p", text: "Quand on demande à un expert de documenter son poste, il décrit le chemin nominal : les étapes officielles. Mais l'expertise réside dans les variations : que faire quand la source de données est en retard, quel contact débloquer en priorité, quelles étapes peuvent être sautées en fin de mois. Ce savoir tacite ne se transmet qu'en travaillant côte à côte — d'où le compagnonnage, et son coût de plusieurs semaines." },
      { type: "h2", text: "Capturer pendant le travail, pas après" },
      { type: "p", text: "La documentation rétrospective échoue car elle concurrence le travail. La capture continue inverse la logique : le collaborateur enregistre son activité pendant qu'il l'exécute, sans production de contenu supplémentaire. Chaque session d'écran devient une trace exploitable." },
      { type: "list", text: "Enregistrement pendant l'exécution réelle des tâches\nCommentaires vocaux qui capturent le raisonnement, pas seulement les gestes\nStructure automatique en procédures opératoires (SOP) sans rédaction manuelle" },
      { type: "h2", text: "Structurer pour transmettre" },
      { type: "p", text: "Une transcription brute reste indigeste pour un nouveau venu. La valeur naît de la structuration : découpage en étapes, identification des outils et contacts, fréquence de la tâche, et liens entre les processus. Une base vectorielle permet ensuite à l'agent d'onboarding de répondre à la question réelle du successeur — « comment je fais le reporting mensuel sur Supabase » — en citant les extraits exacts où le prédécesseur explique la démarche et son contexte." },
      { type: "p", text: "La transmission du savoir-faire n'est pas un projet de documentation : c'est un système. Plus tôt la capture commence, plus la couverture du poste est élevée — et plus le départ devient une transition maîtrisée plutôt qu'une perte sèche." },
    ],
  },
  {
    slug: "onboarding-velocite-mesurer-transmission",
    title: "Onboarding velocity : mesurer la vitesse de prise de poste",
    description:
      "Comment quantifier la vitesse à laquelle un nouvel arrivant devient autonome, et quels indicateurs suivent vraiment la qualité de la transmission.",
    date: "2025-01-08",
    readingMinutes: 5,
    category: "Onboarding",
    content: [
      { type: "p", text: "Le temps d'onboarding se mesure traditionnellement en semaines jusqu'à « l'autonomie ». Mais cette mesure binaire cache la réalité : un nouvel arrivant est autonome tâche par tâche, pas globalement. La métrique utile est le temps-to-autonomy par processus : combien de jours avant qu'il puisse exécuter le reporting mensuel seul ? Avant qu'il sache gérer l'exception de fin de trimestre ?" },
      { type: "h2", text: "Trois indicateurs qui comptent" },
      { type: "list", text: "Taux de couverture : pourcentage des tâches récurrentes du poste capturées dans la base de connaissances\nOnboarding velocity : progression du nouvel arrivant sur les processus documentés\nPoints de blocage : questions récurrentes, qui révèlent les trous de la transmission" },
      { type: "h2", text: "Les points de blocage, or de la transmission" },
      { type: "p", text: "Quand un nouvel arrivant pose trois fois la même question, ce n'est pas un problème de compréhension : c'est un processus non capturé. Les questions récurrentes adressées à l'agent d'onboarding cartographient exactement ce qui manque — et donc quoi enregistrer en priorité. La transmission devient itérative : on identifie le trou, on le comble, la couverture monte." },
      { type: "p", text: "Managers et RH gagnent une visibilité inédite : plus besoin de demander « comment ça se passe ? » — le dashboard montre la progression réelle, processus par processus, et les blocages restants." },
    ],
  },
  {
    slug: "bases-connaissances-vectorielles-entreprise",
    title: "Bases de connaissances vectorielles : le RAG expliqué simplement",
    description:
      "Comment fonctionne une base de connaissances vectorielle, pourquoi elle change la recherche d'information en entreprise, et ce qu'elle apporte à la transmission de savoir-faire.",
    date: "2024-12-18",
    readingMinutes: 7,
    category: "Technologie",
    content: [
      { type: "p", text: "La recherche classique trouve des mots : demandez « comment clôturer le trimestre » et elle renverra les documents contenant ces mots. Une base vectorielle trouve du sens : elle renvoie aussi le document qui explique « la procédure de fin de période comptable », même sans les mots exacts de votre question." },
      { type: "h2", text: "Des mots aux vecteurs" },
      { type: "p", text: "Chaque fragment de texte est transformé en vecteur — une liste de nombres qui encode son sens. Deux textes qui parlent du même sujet ont des vecteurs proches, même s'ils n'utilisent aucun mot commun. La recherche devient une comparaison de direction entre la question et le corpus : on mesure la similarité, on renvoie les extraits les plus pertinents." },
      { type: "h2", text: "Pourquoi ça change la transmission de savoir" },
      { type: "p", text: "Le savoir tacite d'un poste est fragmentaire : des transcriptions orales, des captures d'écran, des étapes de procédure. Une base relationnelle classique ne sait pas chercher dedans. Une base vectorielle indexe chaque fragment — une phrase du prédécesseur devient retrouvable par le sens qu'elle porte. L'agent conversationnel peut alors répondre en citant l'extrait exact, avec son timestamp vidéo." },
      { type: "h2", text: "La confidentialité reste maîtrisée" },
      { type: "p", text: "Toutes les données ingérées passent par un masquage automatique des informations sensibles avant indexation : identifiants, données financières, coordonnées. Seul le savoir-faire est conservé — jamais les secrets." },
      { type: "p", text: "Le résultat : la connaissance de l'entreprise cesse d'être un wikis morts et devient une mémoire interrogable, citant ses sources à chaque réponse." },
    ],
  },
];
