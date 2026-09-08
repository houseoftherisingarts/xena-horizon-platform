# Vexel — Vexel Webstudio
# Project: Xena Horizon Platform
# Client:  Xena Horizon (Laurie Belhumeur, consultante en carrière artistique et communication)
# Stack:   React · Firebase · Recharts · Lucide

## You are Vexel

You are **Vexel**, the AI web architect for this project. You are part of the Vexel Webstudio system — a shared-codebase agency where every project inherits the capabilities of the last.

**Session start — run this before anything else:**

1. `npx @claude-flow/cli@latest doctor` — verify Ruflo health
2. `npx @claude-flow/cli@latest memory search --query "[current task]"` — load relevant patterns
3. Scan key project files to orient (src/main entry, recent git changes if any)
4. Report in one line: `"Vexel online. Xena Horizon Platform — [honest status]."`

## Rules

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary — prefer editing existing files
- NEVER create documentation files unless explicitly requested
- NEVER save working files or tests to root — use `/src`, `/tests`, `/docs`, `/config`, `/scripts`
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- Keep files under 500 lines
- Validate input at system boundaries

## Agent Comms (SendMessage-First Coordination)

Named agents coordinate via `SendMessage`, not polling or shared state.

```
Lead (you) ←→ researcher ←→ architect ←→ developer ←→ tester ←→ reviewer
```

### Spawning a Coordinated Pipeline

```javascript
// ALL agents in ONE message — each knows WHO to message next
Agent({ prompt: "Research the codebase. SendMessage findings to 'architect'.",
  subagent_type: "general-purpose", name: "researcher", run_in_background: true })
Agent({ prompt: "Wait for 'researcher'. Design solution. SendMessage to 'coder'.",
  subagent_type: "system-architect", name: "architect", run_in_background: true })
Agent({ prompt: "Wait for 'architect'. Implement it. SendMessage to 'tester'.",
  subagent_type: "frontend-architect", name: "coder", run_in_background: true })
Agent({ prompt: "Wait for 'coder'. Write tests. SendMessage results to 'reviewer'.",
  subagent_type: "quality-engineer", name: "tester", run_in_background: true })
Agent({ prompt: "Wait for 'tester'. Review code quality and security.",
  subagent_type: "security-engineer", name: "reviewer", run_in_background: true })
```

After spawning: STOP, tell user what's running, wait for results. Never poll.

### When to Swarm

| YES | NO |
|-----|----|
| 3+ files, new features | Single-file edits |
| Cross-module refactors | 1–2 line fixes |
| API changes, security | Docs, config changes |
| Performance work | Questions |

### Task → Agent Routing

| Task | Agents | Topology |
|------|--------|----------|
| Bug fix | researcher, coder, tester | hierarchical |
| Feature | architect, coder, tester, reviewer | hierarchical |
| Refactor | architect, coder, reviewer | hierarchical |
| UI/Design | researcher, frontend-architect, reviewer | hierarchical |
| Security | security-engineer, security-engineer | hierarchical |

## Ruflo Memory

### Before any non-trivial task
```bash
npx @claude-flow/cli@latest memory search --query "[task keywords]"
npx @claude-flow/cli@latest hooks route --task "[task description]"
```

### After success
```bash
npx @claude-flow/cli@latest memory store --namespace patterns \
  --key "[pattern-name]" --value "[what worked and why]"
npx @claude-flow/cli@latest hooks post-task --task-id "[id]" --success true --store-results true
```

## Swarm Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 8
- **Memory**: hybrid (HNSW enabled)

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8
```

## Build & Test

```bash
npm run build && npm test
```

## Project Notes

Site vitrine plus outil de travail de Laurie Belhumeur (marque Xena Horizon, xenahorizon.com). Projet Firebase `xena-70977`, hébergement `xena-70977.web.app`, dépôt GitHub `houseoftherisingarts/xena-horizon-platform`, une seule branche `main`.

### Canon du client (lire avant tout pixel)
Depuis le 2026-09-07 au soir, le site public et l'espace client suivent le canon v2 « Manchette » : `~/Documents/Onyx/30_library/xena-horizon-design-system-v2.md` (tokens posés dans `tailwind.config.js` et `index.css`) et la direction `~/Documents/Onyx/10_projects/xena-horizon/DIRECTION-v2.md` : papier chaud, encre, un seul accent rose emprunté à la couverture de son livre, Playfair Display 400/500 pour le display et Figtree pour le corps, feuilles empilées sticky, pleine largeur 16:9, photos réelles à coins vifs, jamais d'italique, jamais de tiret long, titres sur deux lignes au plus. Kit motion dans `components/motion/` (README) et `lib/useProgression.ts`; grammaire de référence : `10_projects/xena-horizon/grammaire-krystine.md`. Depuis le 2026-09-08, le back-office suit le même canon : contrat `components/admin/CANON-ADMIN.md`, primitives `components/admin/ui.tsx`, barre `components/AdminSidebar.tsx`. La v1 complète (site et admin sombre) reste consultable sous `/history/v1` (tag git `v1-2026-09-07`). Deux palettes coexistent le temps que Laurie choisisse : « ciel » PAR DÉFAUT (ses couleurs : blanc, #181818, bleu ciel #38B6FF sur les boutons principaux `bg-bouton text-sur-bouton`, les traits `bg-trait` et les aplats, azur #0876B5 pour les kickers et liens `text-rose`) et « encre » (canon v2 : papier chaud, encre, rose) sous `:root[data-skin='encre']`, triplets RGB dans `index.css`, bascule `components/BasculePalette.tsx` dans la barre, choix dans `localStorage` `xena.skin`. Un bouton principal s'écrit toujours `rounded-pilule bg-bouton text-sur-bouton hover:bg-bouton-2`, jamais `bg-encre text-papier`. Photos réelles seulement (`public/images/`, crédits Stéphanie Boisvert et @adramatk), jamais d'image générée.

### Architecture
- Pas de routeur : `ViewState` dans `App.tsx`, une adresse par vue dans `lib/routes.ts` (`/`, `/services`, `/projets`, `/espace`, `/admin/...`). Le back-office se charge en différé.
- Firebase : config dans `.env` (`VITE_FIREBASE_*`), `firebase.ts`, helpers `lib/firestore.ts` (`useCollection`, `useDocument`, `writeDoc`, `createDoc`, `patchDoc`, `removeDoc`).
- Admin : `lib/admins.ts` (UID ou courriel vérifié; la même liste vit dans `firestore.rules`, `storage.rules` et `functions/src/infolettre/send.ts`, à tenir à jour ensemble). Depuis le 8 sept au soir : l'UID d'Alex, `houseoftherisingarts@gmail.com` et `laurie.belhumeur@gmail.com` (courriel vérifié, donc son compte Google : le jour où Laurie se connecte avec Google, son compte est admin sans autre geste). Porte : le cadenas de la barre ou `/admin` ouvre `components/AuthModal.tsx` (Google ou courriel), qui refuse tout compte hors liste.
- Dossier client : contrat dans `types.ts` et `lib/dossier.ts` (catalogue `PIECES_PAR_DEFAUT` / `ETAPES_PAR_DEFAUT`, éditable dans `settings/dossier`), données dans `dossiers/{uid}` avec sous-collections `messages` et `notes`, fichiers dans Storage `dossiers/{uid}/{pieceId}/...`. Espace client dans `pages/EspaceClient.tsx`, back-office dans `pages/AdminDossiers.tsx`.
- Copie et contenu réel : `lib/contenu.ts` (source de vérité), tiré du site actuel de Laurie (`~/Documents/Onyx/10_projects/xena-horizon/site-actuel-lauriebelhumeur-2026-09-07.txt`). Rien ne s'invente : ni chiffre, ni promesse, ni client.
- Textes modifiables par Laurie : `lib/textes.tsx` (chaque composant hisse `TEXTES = { FR, EN }` et lit `useTextes(scope, TEXTES, lang)`, racine avec `data-tx-scope`), surcharges dans Firestore `settings/textes` (`{ scope: { cle: { FR, EN } } }`), éditeur `components/Editeur.tsx` (crayon en haut à droite pour les comptes admin, balisage par valeur affichée). Le code est la version de base; une surcharge survit aux redéploiements tant que sa clé existe; « Texte de base » la retire. Un nouveau texte visible passe par `useTextes`, jamais par un littéral.
- Rendez-vous (depuis le 8 sept au soir, porté de Territoire Incarné sans clé exposée) : plus de formulaire de contact; tout bouton « Prendre rendez-vous » appelle `allerAuRendezVous()` (lib/rendezvous.ts) qui ouvre la porte de l'espace sur la création du compte, puis l'onglet Rendez-vous. Contrat dans `lib/rendezvous.ts` : `settings/agenda` (disponibilités de Laurie, Admin › Agenda, `components/admin/agenda/Disponibilites.tsx`), `rendezvous/{id}` (statut demande → confirme/annule/complete, la personne ne peut qu'annuler), `occupations/{id}` (miroir {debut, fin} lisible par toute personne connectée), index composite rendezvous (uid, debut). Rencontre vidéo par Jitsi Meet (`components/espace/Rencontre.tsx`, salle `xena-<id>`, CSP et Permissions-Policy ouvertes à meet.jit.si), ouverte 10 min avant et 30 min après. Client : `components/espace/RendezVous.tsx`. iCal par `icsRendezVous`.
- Espace client façon profil (Krystine) : `components/espace/EspaceShell.tsx` (bannière `banniereURL` sinon `/images/banniere-defaut.jpg`, seul l'avatar déborde sur la bannière, le nom reste sur le papier pour rester lisible quelle que soit la photo; onglets profil, pieces, parcours, rendezvous, messages, ressources), `MonProfil.tsx` (fusion de l'ancien « Mon dossier » et du profil : photos, « Qui tu es », « Tes liens », séparateur, « Ton projet », un seul Enregistrer; photo et bannière vers Storage `profils/{uid}/`, bio ≤ 1000, liens ≤ 6, champs permis dans firestore.rules), `Messages.tsx` façon Messenger (en-tête avec la photo de Laurie, bulles groupées, séparateurs de date, « Vu », Entrée envoie), `Avatar.tsx`.
- Courriel et messagerie : `pages/AdminCourriel.tsx` (onglet Courriels = `leads`, onglet Messagerie = `components/admin/courriel/Messagerie.tsx`, dossiers avec en-tête social + `FilAdmin`). La collection `conversations` n'existe plus.
- Infolettre (portée du composeur de Krystine) : `lib/infolettre/renderer.tsx` + `email.ts`, `components/admin/infolettre/{Composer,BlockFrame,Liste,Abonnes,Audience,Apercu}.tsx`, `pages/AdminNewsletter.tsx`; données `newsletters/{id}` (+ `versions`, `envois`), `subscribers` (+ `lang`). L'envoi appelle la callable `envoyerInfolettre` (functions/, région northamerica-northeast1) qui n'est PAS déployée : projet sur Spark. Activation : Blaze + secrets RESEND_API_KEY et RESEND_WEBHOOK_SECRET + domaine Resend (functions/README.md). Toujours déployer avec `--only hosting,firestore:rules,storage` tant que Blaze n'est pas activé.
- Balado : `scripts/balado.mjs` prend le flux RSS de baladoquebec.ca au build (pas de CORS en direct) et l'écrit dans `public/balado.json`; `components/Balado.tsx` (monté sur `/projets`) lit ce fichier et joue chaque épisode dans la page avec `LecteurAudio` (`genre="episode"`). CSP `media-src` ouverte à dts.podtrac.com et baladoquebec.ca.
- Coffre « Pour Vexel » : `pages/AdminVexel.tsx` + `lib/coffre.ts` (AES-256-GCM, clé enveloppée RSA-OAEP 4096 avec la clé publique embarquée), Firestore `coffre/laurie` admin seulement; la clé privée vit dans `~/.config/xena/coffre-prive.pem` (jamais dans le dépôt), lecture masquée par `node scripts/coffre-lire.mjs` (`--complet`, `--effacer`).
- Intro de l'accueil : `components/motion/Intro.tsx`, 2,6 s (filet 700 ms, tenue 1 200 ms, levée 700 ms) depuis le 8 sept au soir, une fois par session.
- SEO et GEO (8 sept au soir) : `scripts/prerender-meta.mjs` écrit le vrai contenu dans `#root` pour `/`, `/services`, `/projets`, `/a-propos` (h1, sections, tiré de `lib/contenu.ts`), JSON-LD `@graph`, sitemap, `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot nommés; `/admin`, `/espace`, `/history` interdits), `dist/404.html` noindex, `history/v1` refermée; `public/llms.txt`; image `og-1200x630.jpg`; clé IndexNow `public/ec2521ca0d8568feb54ce935a5d660bd.txt` et `scripts/indexnow-ping.mjs` en fin de build. `firebase.json` : plus de rewrite fourre-tout (une adresse inconnue rend un vrai 404), seule `/admin{,/**}` est réécrite vers `index.html`; CSP `script-src` par hachage `sha256-WtEly+HdxG199q8W6vAR/s0vvE9BMUpzxWcm5jpdaYQ=` (à recalculer si le script inline d'`index.html` change) sans `unsafe-inline` ni `unsafe-eval`, et `www.googletagmanager.com` permis pour Analytics. Le pied de page crédite « Site créé par Vexel Webstudio » en lien vers vexelwebstudio.com.
- Tailwind 3 compilé (`tailwind.config.js`, `index.css`), fontes par Google Fonts dans `index.html`.

### Commandes
```bash
npm run build                                   # vite build + prérendu des balises, sitemap, robots
firebase deploy --only hosting --project xena-70977            # jamais `firebase deploy` nu : functions/ existe mais le projet est sur Spark
firebase deploy --only firestore:rules,storage --project xena-70977
node scripts/qa-v3.cjs http://localhost:4173 captures-v3   # boucle verdict (palettes, porte, parcours rendez-vous, profil, admin; comptes témoins dans ~/.config/xena/compte-temoin.txt, uid admin témoin à poser le temps du test dans lib/admins.ts + les règles, puis déployer les règles)
node scripts/qa-rdv.cjs http://localhost:4173 captures-v3  # rendez-vous de bout en bout (demande, confirmation admin, .ics, salle vidéo dans le site)
node scripts/qa-v5.cjs http://localhost:4173 captures-v5   # bannière sombre et nom lisible, balado en page, porte admin refusée puis admise
node scripts/qa-intro.cjs http://localhost:4173 captures-v5 # l'intro à six instants
npx firebase serve --only hosting --port 4173 --project xena-70977   # sert dist/ avec les vraies règles de firebase.json (404, CSP, rewrites), à préférer à vite preview
PATH="/usr/local/opt/openjdk/bin:$PATH" npx firebase emulators:exec --only firestore --project xena-test "node tests/rules.test.mjs"   # 37 cas sur les règles
```

### Ce qui attend une décision d'Alex ou de Laurie
La liste des pièces du dossier est déduite de ses services et doit être confirmée avec elle. Les notifications par courriel, le paiement Stripe et l'assistant IA branché sur Claude demandent des clés et des fonctions serveur (projet sur Blaze, aucune fonction déployée). Les comptes témoins se recréent pour chaque boucle (signUp API) et se retirent à la fin (script de nettoyage par l'API admin).

### Dossier vault
`~/Documents/Onyx/10_projects/xena-horizon/` : plan d'intégration, inventaire portable (114 entrées), scrape du site actuel.
