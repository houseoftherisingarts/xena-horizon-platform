# Le chargement, 8 septembre 2026 (soir)

Plainte d'Alex : « quand je charge le site, ça fait un flash de certaines lettres et après ça
devient beau, et des fois ça ne se charge pas du tout ». Deux symptômes, deux causes racines
distinctes, traitées séparément ci-dessous. Vérifications au bas du document.

## 1. Le flash de lettres

**Cause vérifiée.** Les deux polices (Playfair Display, Figtree) venaient de Google Fonts par
`<link>` dans `index.html`. Le navigateur affiche d'abord une police de secours générique
(métriques différentes de Playfair/Figtree), puis bascule quand le fichier distant arrive : le
texte change de taille apparente au même instant, visible à l'œil comme un « saut ». Deux
fournisseurs séparés (`fonts.googleapis.com` pour le CSS, `fonts.gstatic.com` pour les fichiers)
ajoutaient en plus deux DNS/TLS avant même de commencer à télécharger la police.

**Correction.**
- Fontes téléchargées et hébergées dans `public/fonts/` : deux fichiers variables au format woff2,
  subset `latin` uniquement (capturé depuis le endpoint `css2` de Google Fonts avec un user-agent
  moderne). Le subset `latin` de ces deux fontes couvre déjà tous les accents français
  (U+0000-00FF, plus `œ`/`Œ` en U+0152-0153) : pas besoin de `latin-ext`.
  - `figtree-latin-variable.woff2` : axe `wght` 300-900, servi avec `font-weight: 300 600` (ce que
    le site utilise réellement).
  - `playfair-display-latin-variable.woff2` : axe `wght` 400-900, servi avec `font-weight: 400 500`.
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` sur ces deux fichiers dans
  `index.html`, avant tout le reste : le navigateur commence à les télécharger avant même d'avoir
  fini de parser le CSS.
- `<link rel="preconnect">` vers Google et le `<link rel="stylesheet">` de `fonts.googleapis.com`
  retirés d'`index.html` : plus rien ne part vers Google au chargement.
- `font-display: swap` conservé (le texte reste lisible tout de suite, dans la police de secours,
  au lieu d'un texte invisible le temps du téléchargement).
- **Polices de secours aux métriques ajustées** (`@font-face` avec `ascent-override`,
  `descent-override`, `line-gap-override`, `size-adjust`, en tête d'`index.css`) : la police système
  qui s'affiche pendant le téléchargement (Arial pour Figtree, Georgia pour Playfair Display) est
  étirée pour occuper exactement le même encombrement, ligne par ligne et caractère par caractère,
  que la police finale. La bascule ne déplace plus rien à l'écran : c'est ce qui supprime le saut,
  pas seulement le flash de couleur/style.

**Calcul des métriques.** Les deux fichiers de police n'ont pas de métriques publiées quelque part
: elles se lisent dans les tables `OS/2` et `hhea` du fichier lui-même. Lu avec `fontTools`
(bibliothèque Python, déjà sur cette machine, aucune dépendance ajoutée au projet) :

| | ascent (hhea) | descent (hhea) | lineGap (hhea) | unitsPerEm | xAvgCharWidth (OS/2) |
|---|---|---|---|---|---|
| Figtree | 950 | -250 | 0 | 1000 | 530 |
| Playfair Display | 1082 | -251 | 0 | 1000 | 579 |
| Arial (repli sans-serif) | 1854 | -434 | 67 | 2048 | 904 |
| Georgia (repli serif) | 1878 | -449 | 0 | 2048 | 901 |

Formule (celle qu'utilisent Next.js et Capsize pour ce même problème) :
`size-adjust = xAvgCharWidth(police) / xAvgCharWidth(repli)`, puis
`ascent/descent/lineGap-override = valeur(police) / (unitsPerEm(police) × size-adjust)`.

- Figtree → Arial : `size-adjust 58,63 %` · `ascent-override 162,04 %` · `descent-override 42,64 %`
  · `line-gap-override 0 %`.
- Playfair Display → Georgia : `size-adjust 64,26 %` · `ascent-override 168,37 %` ·
  `descent-override 39,06 %` · `line-gap-override 0 %`.

Ces polices de repli (`Figtree Repli`, `Playfair Display Repli`) sont insérées dans les piles
`font-family` juste après la police principale, dans `index.css` (déclaration du `body` et de la
règle `h1, h2, h3, .font-serif`), plus une règle `.font-sans` ajoutée pour que l'utilitaire Tailwind
du même nom porte aussi le repli sans toucher à `tailwind.config.js` (fichier partagé, hors
périmètre de cette session).

**CSP resserrée en conséquence** (`firebase.json`) : `style-src` perd `fonts.googleapis.com`,
`font-src` devient `'self'` seul. Plus rien ne vient de Google pour les polices, la politique le dit
maintenant explicitement.

## 2. « Des fois, ça ne se charge pas du tout »

Six causes possibles passées en revue, chacune vérifiée ou écartée avec sa preuve :

**(a) Fragment de build disparu après un déploiement — cause réelle, corrigée.**
`App.tsx` charge dix-sept pages avec `React.lazy()`. Un onglet resté ouvert depuis avant un
déploiement (ou un lien direct vers une page admin mise en cache par le navigateur) demande un
fichier dont le nom a changé (Vite les nomme avec un hash de contenu, ex.
`AdminDashboard-C-dcF6F6.js`) : la requête rend 404, la promesse d'`import()` rejette, et sans
frontière d'erreur React démonte tout l'arbre : page blanche, sans recours pour le visiteur.
Corrigé par deux filets complémentaires, posés dans `index.tsx` :
1. Un écouteur sur `vite:preloadError` (évènement que Vite déclenche lui-même à cet échec précis)
   recharge la page une seule fois (drapeau `sessionStorage`, pour ne pas boucler si le problème
   vient d'ailleurs, par exemple hors ligne).
2. `components/ErreurRacine.tsx`, une frontière d'erreur React (`componentDidCatch`) autour de
   `<App />` : si un rechargement ne suffit pas, ou que l'erreur vient d'ailleurs, le visiteur voit
   un état propre avec un bouton « Recharger » au lieu d'un vide.

**(b) L'intro reste voilée si `onComplete` ne se déclenche jamais — cause plausible, filet ajouté.**
`pages/PublicHome.tsx` bloque le défilement (`overflow: hidden` sur `<html>`) tant que l'intro
joue, et ne le relâche que dans le nettoyage de son effet, déclenché par `onComplete`. Deux façons
que ça reste bloqué : un onglet mis en arrière-plan retarde les `setTimeout` (throttling du
navigateur) sans garantie de reprise immédiate au retour au premier plan ; ou une erreur ailleurs
dans l'arbre React démonte le composant avant que son nettoyage n'ait eu la chance de tourner (ce
qui rejoint la cause (a) : `ErreurRacine.componentDidCatch` lève ce verrou explicitement).
Corrigé dans `components/motion/Intro.tsx` : un filet sur `visibilitychange`, qui lève le rideau dès
le retour au premier plan si le délai était déjà écoulé pendant que l'onglet était cachée, sans
attendre que le `setTimeout` d'origine reprenne.

**(c) L'hydratation de `#root` après le prérendu — écartée.** `scripts/prerender-meta.mjs` écrit du
HTML statique dans `dist/<route>/index.html` pour les crawlers ; `index.tsx` appelle
`createRoot(root).render(...)`, qui REMPLACE ce contenu au montage (jamais d'`hydrateRoot`), donc
aucun décalage d'hydratation possible : soit React monte et remplace tout, soit il plante et
`ErreurRacine` prend le relais (cause a). Rien à corriger ici au-delà de (a).

**(d) En-têtes de cache — vérifiée, déjà correcte.** `firebase.json` : la règle `"**"` pose
`Cache-Control: no-cache, no-store, must-revalidate` sur tout, puis une règle plus bas restreint
`Cache-Control: public, max-age=31536000, immutable` aux fichiers `js|css|woff2|woff|ttf|svg|png|
jpg|jpeg|webp|gif`. Sur Firebase Hosting, quand deux règles touchent la même clé d'en-tête pour un
même fichier, la dernière qui matche l'emporte : `index.html` (aucune extension listée) reste
`no-cache`, les fragments hachés (js/css/**woff2**) sont `immutable`. C'était déjà correct avant
cette session ; aucun changement nécessaire.

**(e) Erreurs console au chargement à froid** — mesurées par `scripts/qa-chargement.cjs`, volet A,
contexte Playwright neuf (cache vide) par page, sur les cinq routes publiques. Résultat dans
`captures-chargement/rapport.json`.

**(f) Service worker** — écarté : `grep -r` sur le dépôt (hors `node_modules`) ne trouve aucun
fichier `sw.js` ni enregistrement `serviceWorker.register`. Rien à corriger.

## Vérifications

**`tsc --noEmit` propre** sur le dépôt et sur `functions/` : zéro erreur dans les deux cas.

**Volet A (chargement à froid, cinq routes publiques).** Zéro erreur console et zéro erreur page
sur les cinq routes. LCP entre 140 ms et 1 384 ms (`/espace`, le plus lourd : porte de connexion
avec ses champs). CLS à 0 sur `/` et `/services`; 0,3 sur `/projets` et `/a-propos`; 0,108 sur
`/espace`. **Cause du 0,3 trouvée et isolée** (mesurée avec un `PerformanceObserver` qui journalise
la source du saut) : `Parallax` (`components/motion/Parallax.tsx`), présent sur ces deux pages
seulement (ni `/` ni `/services` ne l'utilisent), fait bouger le pied de page de quelques dizaines
de millisecondes après le premier rendu. Le saut ne se voit à l'œil sur aucune des captures
1440/390 des cinq pages (regardées une par une, voir liste plus bas) : c'est un score qui bouge,
pas un défaut visible. `Parallax.tsx` appartient au kit `components/motion/`, partagé par d'autres
pages et d'autres chantiers en cours dans le même arbre de travail : hors des fichiers de cette
mission, non touché, signalé ici pour le prochain passage dessus.

**Volet B (flash de police, trois instants, 1440 et 390).** Première version du script cassée :
elle ralentissait TOUT le réseau (proche d'un Slow 4G, tout le HTML/CSS/JS compris), si bien que la
page restait entièrement blanche aux trois instants et qu'aucune capture ne montrait jamais la
police bascule elle-même. Corrigé dans `scripts/qa-chargement.cjs` : seuls les deux fichiers de
police sont désormais retardés (400 ms), le reste du chargement va à sa vitesse réelle. Résultat
après correction : à 150 ms les polices ne sont pas encore prêtes (`document.fonts.status:
'loading'`), à 400 ms et 1 500 ms elles sont chargées (`'loaded'`, `check()` vrai pour Figtree et
Playfair Display). Les trois captures 1440 et les trois captures 390 montrent le mot « Xena » (puis
« Xena Horizon ») exactement à la même position et à la même taille du début à la fin : aucun saut
visible pendant la bascule police de repli → police réelle, sur les deux tailles d'écran. La texture
floue visible sur les captures à 150 et 400 ms est le rideau de l'intro qui se lève (`Intro.tsx`),
pas un artefact de police.

**Volet C (fragment de build disparu).** Avec le fragment `AdminDashboard-*.js` bloqué : 3
navigations détectées (chargement initial, `pushState` vers `/admin`, rechargement automatique
déclenché par `vite:preloadError`), puis, le fragment restant bloqué après le rechargement,
`ErreurRacine` prend le relais : écran centré, un seul bouton, aucune boucle. Capturé dans
`fragment-disparu-apres.png`, regardé : texte en anglais parce que Playwright fixe la langue du
navigateur à `en-US` par défaut (un vrai visiteur francophone voit la version française du même
écran, cf. `ErreurRacine.tsx`).

**Captures regardées** (`captures-verif/xena2-C-chargement/`), une par une, à l'œil, grille RÈGLE
-5 : `flash-1440-150/400/1500ms.png`, `flash-390-150/400/1500ms.png`, `froid-accueil-1440/390.png`,
`froid-services-1440/390.png`, `froid-projets-1440.png`, `froid-a-propos-1440/390.png`,
`froid-espace-1440.png`, `fragment-disparu-apres.png`. Aucune faute trouvée sur la grille (pleine
largeur, rien qui cache un titre, titres sur deux lignes au plus, un seul bouton par écran, texte
lisible).
