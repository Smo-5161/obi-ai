# Omi.ai — Onboarding Mentor Intelligence

Plateforme de BI dédiée à l'onboarding : capture des processus métiers d'un collaborateur
(outboarder), construction d'un « Brain » vectoriel par fiche de poste, et accompagnement
pas à pas du nouvel arrivant (inboarder) par l'agent Omi.

## Stack

- **Next.js 16 (App Router)** + Tailwind CSS 4
- **API Mistral** : `mistral-embed` (RAG vectoriel), chat (structuration des SOP + copilote)
- **Store JSON persistant** (`.omi-data/db.json`) — remplaçable par Supabase (Postgres + pgvector)
- **Zod** pour la validation des payloads d'ingestion

## Démarrage

```bash
pnpm install
cp .env.example .env.local   # renseigner MISTRAL_API_KEY (optionnel : fallbacks heuristiques sinon)
pnpm dev
```

Sans clé Mistral, l'application fonctionne en mode déterministe :
embeddings locaux (hashing), découpage heuristique des SOP, réponses RAG basées sur la similarité.

## Flux

1. **Recorder** (`/recorder`) — capture simulée écran + voix : transcription → découpage en SOP
   (LLM ou heuristique) → masquage PII (emails, mots de passe, tokens, IBAN, cartes) → indexation vectorielle.
2. **Brains** (`/brains`) — base de connaissances par poste, graphe d'outils et contacts clés,
   chat Omi Companion avec citations des extraits du prédécesseur.
3. **Analytics** (`/analytics`) — Omi Coverage Score, Onboarding Velocity, points de blocage
   (questions récurrentes), données sensibles masquées.

## API

| Méthode | Route | Description |
|---|---|---|
| GET/POST | `/api/brains` | Lister / créer un Brain |
| GET | `/api/brains/[id]` | Brain + SOPs + graphe + couverture |
| GET/POST/PUT | `/api/recordings` | Lister / ingérer un enregistrement / marquer une SOP maîtrisée |
| POST | `/api/chat` | Poser une question à Omi (RAG) |
| GET | `/api/analytics` | Rapport BI par Brain |
| POST | `/api/seed` | Jeu de démonstration (Brain "Contrôleur de Gestion") |

## Migration Supabase

Le store (`src/lib/store.ts`) et les embeddings (`src/lib/mistral.ts`) sont isolés pour
brancher Supabase (Postgres + pgvector + Auth + Storage) sans toucher au pipeline métier.

## Déploiement

L'application est déployée sur Vercel : **https://omi-ai.vercel.app**

Variables d'environnement de production (Vercel → Settings → Environment Variables) :

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique anon Supabase |
| `MISTRAL_API_KEY` | (optionnel) active le mode LLM complet |
| `NEXT_PUBLIC_SITE_URL` | (optionnel) URL canonique, défaut : l'URL Vercel |

Après chaque `git push` sur `main`, Vercel redéploie automatiquement.
