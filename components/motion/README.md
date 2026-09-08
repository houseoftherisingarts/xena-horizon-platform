# Kit motion Xena v2

Grammaire portée de Krystine (`~/Documents/Onyx/10_projects/xena-horizon/grammaire-krystine.md`),
palette-agnostique : les couleurs passent par `var(--xh-…, repli)` ou `currentColor`,
jamais en dur. Un client qui définit ses tokens `--xh-papier`, `--xh-encre`,
`--xh-filet`, `--xh-lumiere`, `--xh-lumiere-secondaire`, `--xh-vignette`, `--xh-ombre`
prend la main sur le rendu sans toucher au code.

## `lib/useProgression.ts`
- `useProgression(ref, fin = 0.45): MotionValue<number>` — 0 quand le haut du bloc
  entre par le bas, 1 quand son centre atteint `fin` de l'écran. Drop-in `useTransform`.
- `usePinProgress(ref): MotionValue<number>` — pour un conteneur épinglé plus haut que
  l'écran : 0 quand son haut touche le haut de l'écran, 1 quand son bas touche le bas.

## `components/motion/`
- `<Feuille z className coinsClassName ombreClassName premiere>` — section sticky
  empilée ; `premiere` retire coins et ombre.
- `<Reveal delay y=36 amount=0.25 once as="div" className>` — fade-up au scroll, once.
- `<RevealStagger stagger=0.09>` — cascade ses enfants directs.
- `<Parallax speed=0.18 className>` — translateY selon le scroll global.
- `<KenBurns src alt className from=1.06 to=1.16 duration=22 position>` — zoom lent aller-retour.
- `<Atmosphere light="76% 14%" strength=1 grain vignette className>` — halo + grain + vignette CSS.
- `<Seam from height=110>` — couture entre deux fonds (`from` en haut de la section, `relative`).
- `<TexteRevele texte as="h1" className par="mot"|"lettre" delay>` — révélation par mot/lettre,
  respecte `\n`, accessible (`aria-label` + spans `aria-hidden`).
- `<KickerFocus texte className fin=0.45>` — kicker qui se met au point (blur 18→0).
- `<MasqueRadial enfant|children className fin=0.42 depart=8 arrivee=55>` — masque radial piloté au scroll.
- `<Portail>` — `createPortal` vers `document.body` après hydratation ; toute fenêtre superposée passe par là.
- `<DefilementDoux>` + `useLenis()` — fournisseur Lenis (`lerp .1`, `wheelMultiplier 1`),
  désactivé en reduced motion ou pointeur tactile.
- `<Intro onComplete marque="Xena Horizon" signature="par Laurie Belhumeur" dureeMs=1100>` —
  GATE 0 : filet, marque lettre par lettre, tenue, rideau qui se lève. Une fois par session.

## Usage
```tsx
import { Feuille, Reveal, Atmosphere } from './components/motion';

<Feuille z={2}>
  <Atmosphere />
  <Reveal><h2>…</h2></Reveal>
</Feuille>
```

Tout respecte `prefers-reduced-motion` avec un rendu statique séparé (jamais des durées à zéro).
Easing maison : `[0.16, 0.8, 0.24, 1]` (entrées) et `[0.22, 1, 0.36, 1]` (rideaux/levées).
