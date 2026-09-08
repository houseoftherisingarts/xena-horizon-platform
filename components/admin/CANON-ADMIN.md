# Canon du back-office v2 (Xena Horizon, septembre 2026)

Le back-office porte le même canon que le site public et l'espace client (`~/Documents/Onyx/30_library/xena-horizon-design-system-v2.md`) : papier, encre, un seul accent (le jeton `rose`, qui devient bleu ciel sous la palette « ciel »), Playfair Display pour les titres, Figtree pour tout le reste. Il remplace l'ancien admin sombre (slate, cyan, verre, dégradés), consultable sous `/history/v1/admin`.

## Jetons (classes Tailwind)

- Fonds : `bg-papier` (page), `bg-papier-2` (panneaux, barre latérale, champs). Jamais `bg-slate-*`, `bg-white/*`, `bg-black/*`.
- Texte : `text-encre` (courant, titres), `text-gris` (second rang, étiquettes), `text-rose` (accent, liens actifs, kickers). Jamais `text-white`, `text-slate-*`, `text-cyan-*`, `text-emerald-*`.
- Filets : `border-filet`. Coins : `rounded-champ` (6 px) sur panneaux, champs et tableaux; `rounded-pilule` sur boutons et badges. Jamais `rounded-[12px]`, `rounded-[20px]`, `rounded-xl`.
- Ombres : aucune sur les panneaux; `shadow-panneau` seulement sur un élément flottant (tiroir, fenêtre modale).
- Interdits absolus : `backdrop-blur` (sauf la barre mobile), `bg-iridescent`, `text-iridescent`, `shadow-iridescent*`, `GlassCard`, `GLASS_*`, `ACTION_BUTTON_CLASSES`, tout dégradé, tout `animate-pulse` décoratif, l'italique, le tiret long.

## Primitives (`components/admin/ui.tsx`)

- `<EnTete kicker titre lede actions>` : le haut de chaque page (kicker rose, h1 Playfair `text-h2`, lede grise, boutons à droite).
- `<Panneau titre? actions? className?>` : le bloc de contenu (`bg-papier-2 border border-filet rounded-champ p-6`). Jamais de panneau dans un panneau.
- `<Bouton variante="primaire|secondaire|discret|danger" icone? ...props>` : pilule encre / pilule à filet / texte gris / texte rose.
- `<Champ label ...inputProps>`, `<Zone label ...textareaProps>`, `<Selection label ...selectProps>` : étiquette au-dessus, champ à filet, focus rose.
- `<Etiquette tone="neutre|accent|encre">` : badge pilule.
- `<Chiffre valeur libelle>` : une statistique (valeur en Playfair, libellé en kicker gris).
- `<Vide titre texte? action?>` : l'état vide, en une phrase, jamais une illustration.
- `<Tableau colonnes lignes>` n'existe pas : écrire un `<table>` avec `divide-y divide-filet`, en-têtes en `kicker text-gris`, cellules `py-3 text-sm text-encre`, et le conteneur en `overflow-x-auto`.

## Composition

- Page : `px-6 md:px-10 py-10 space-y-8`, largeur pleine (jamais `max-w-*` centré avec des marges mortes).
- Grilles de statistiques : `grid gap-4 sm:grid-cols-2 xl:grid-cols-4`, chaque case en `Chiffre` dans un `Panneau`.
- Graphiques Recharts : encre pour les traits, `rose` pour l'accent, `filet` pour la grille, aucune couleur inventée (les hex : encre `#1A1A1E`, rose `#A8104A`, filet `#DDD7CD`, gris `#5E5850`).
- Titres : h1 de page en Playfair 500 (`font-serif text-h2`), sous-titres de panneau en `font-sans font-semibold text-encre`. Jamais `font-bold` sur du Playfair.
- Boutons d'icône : 44 px, `text-gris hover:text-encre`, `aria-label`.
- Formulaires : étiquette au-dessus du champ, jamais un texte fantôme seul.
- Mobile : tout reste lisible à 390 px, tableaux dans `overflow-x-auto`, aucune barre de défilement horizontale de page.

## Barre latérale (`components/AdminSidebar.tsx`)

- Le crayon (`components/Editeur.tsx`, en haut à droite de toutes les pages pour un compte admin) est la seule porte vers l'édition des textes : la barre n'a plus d'entrée « Textes du site », il n'y a rien à dédoubler.
- Desktop seulement : une flèche en bas de la barre replie le menu en rail de 64 px (icônes seules, info-bulle au survol et au focus), state mémorisé dans `localStorage` (`xena.admin.menu`), transition 220 ms `ease-maison`. Le contenu (`App.tsx`, `<main>`) suit la même largeur et la même transition. Sur téléphone, la barre reste le tiroir plein qu'elle a toujours été.

## Contenu

- Aucun chiffre, aucune phrase, aucun client, aucun événement inventé : les métriques viennent des collections Firestore (`dossiers`, `leads`, `clients`, `products`, `documents`, `gallery`, `newsletters`) ou ne s'affichent pas. Un module sans donnée réelle montre un `Vide` honnête.
- Les libellés restent bilingues (`t = { FR, EN }[lang]`) et gardent le vouvoiement existant du back-office.
- Les fonctions existantes (lecture, écriture, export, impression) ne changent pas : c'est un rhabillage, pas une refonte des données.
