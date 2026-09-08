# Studio social 2026 : ce que les meilleurs outils font, ce que Laurie reçoit

Recherche menée le 8 septembre 2026 (WebSearch, plusieurs angles) avant de refaire `pages/SocialCreator.tsx`.

## Ce que Canva, Adobe Express, Kittl, Later, Buffer, Planable, Postiz et Typefully ont en commun

- **Une bibliothèque de gabarits qui reste modifiable calque par calque**, jamais une image figée qu'on ne fait que recolorer. Kittl vend justement ça contre Canva : des gabarits d'origine, construits par de vrais designers, où chaque élément se retouche. ([kittl.com](https://www.kittl.com/compare/kittl-vs-canva))
- **Un kit de marque toujours à portée** (logo, couleurs, polices), qu'Adobe Express offre même gratuitement là où Canva le verrouille derrière un abonnement. ([aitooldiscovery.com](https://www.aitooldiscovery.com/guides/canva-alternatives))
- **Des guides d'alignement magnétiques** : lignes pointillées au centre du canevas et entre calques, apparition automatique pendant le déplacement, accroche sur les bords, les centres et les tiers de la page. C'est le standard depuis Canva jusqu'aux outils pro comme Canvas Envision. ([befunky.com](https://www.befunky.com/learn/snap-lines/), [help.canvasgfx.com](https://help.canvasgfx.com/en/canvas-x-draw/user_guide/Content/e_Drawing/Smart_Snaps.htm))
- **Des poignées de redimensionnement visibles sur l'élément sélectionné**, avec un retour visuel pendant le geste, pas seulement une bordure statique.
- **Un aperçu en maquette d'appareil** avant publication : les designers qui présentent leurs posts dans une vraie scène de téléphone gagnent en crédibilité, et c'est devenu la norme 2026 plutôt que l'exception. ([manypixels.co](https://www.manypixels.co/blog/social-media-design/trends), [mockupline.com](https://mockupline.com/2026-instagram-design-trends/))
- **Un ratio par réseau assumé dans l'interface** (carré, portrait 4:5, story 9:16, format large LinkedIn), pas un seul format générique qu'on étire.
- **La légende et les mots-clics juste à côté du visuel**, pas dans un outil séparé : Typefully et Planable gagnent leur place précisément là-dessus, aperçu du texte au même endroit que le rendu. ([postiz.com](https://postiz.com/compare/later/typefully))
- **Un export en un geste**, résolution native au format choisi.

## Ce que le studio de Laurie reçoit

- Trois colonnes : gabarits et formats à gauche, toile éditable au centre (calques déplaçables et redimensionnables, guides centre + tiers, magnétisme), propriétés du calque sélectionné à droite (police Playfair ou Figtree, taille, graisse, couleur de sa palette, ombre douce, image, forme, kit de marque).
- Aperçu en maquette de téléphone pour le format story, parce que c'est ce format qu'elle publie tel quel sur son propre appareil.
- Six gabarits construits avec ses vraies photos (`public/images/laurie-portrait-*.jpg`) et son logo (`public/images/logo-laurie.png`), rendus par le même moteur de calques que la toile : citation, annonce de rendez-vous, nouvel épisode de balado (lit `public/balado.json`), témoignage (le vrai témoignage d'Alexis Sénécal, `lib/contenu.ts`), conseil en trois lignes, couverture de carrousel.
- Raccourcis clavier (flèches pour déplacer, Supprimer, Ctrl/Cmd+D pour dupliquer), parce qu'une session de création rapide en dépend autant que la souris.
- Export PNG à la résolution native du format (via `html-to-image`, le DOM réel rasterisé au bon ratio de pixels) et copie de la légende en un clic.

## Ce que le studio n'aura pas, et pourquoi

- **Pas de génération IA branchée en direct.** La clé Nano Banana ne peut pas vivre dans le navigateur (voir CLAUDE.md, projet sur Spark) ; le bouton reste la promesse déjà en place dans le code, pas une nouvelle fonction serveur qu'on ne peut pas déployer aujourd'hui.
- **Pas de calendrier de publication ni de file d'approbation façon Buffer ou Planable.** Le studio produit un visuel, il ne remplace pas l'agenda de Laurie ni son outil de publication.
- **Pas de programmation multi-réseaux ni de connexion aux comptes sociaux** (Later, Postiz) : Laurie télécharge l'image et publie elle-même, ce qui correspond à son usage réel.
- **Pas de collaboration temps réel ni de commentaires** (Planable) : un seul poste, une seule utilisatrice, ce serait de la structure sans personne pour s'en servir.
- **Pas de rotation de calque.** Le brief demande le déplacement, le redimensionnement et l'alignement ; la rotation n'a été ni demandée ni observée comme un besoin des six gabarits.

## Sources lues

- [Kittl vs Canva](https://www.kittl.com/compare/kittl-vs-canva)
- [Canva Alternatives — AI Tool Discovery](https://www.aitooldiscovery.com/guides/canva-alternatives)
- [Postiz — Later vs Typefully](https://postiz.com/compare/later/typefully)
- [BeFunky — Snap Lines](https://www.befunky.com/learn/snap-lines/)
- [Canvas X Draw — Smart Snaps](https://help.canvasgfx.com/en/canvas-x-draw/user_guide/Content/e_Drawing/Smart_Snaps.htm)
- [ManyPixels — Social media design trends 2026](https://www.manypixels.co/blog/social-media-design/trends)
- [Mockup Line — 2026 Instagram design trends](https://mockupline.com/2026-instagram-design-trends/)
