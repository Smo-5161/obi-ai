import type { BrainVisualItem } from "@/components/BrainVisualization";

export const demoItems: BrainVisualItem[] = [
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
