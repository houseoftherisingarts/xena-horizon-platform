// Filet racine : si React plante avant que la moindre vue ne s'affiche (fragment de build qui
// n'existe plus après un déploiement, erreur JS imprévue), le visiteur voyait une page blanche
// figée, sans recours. Cette frontière capte l'erreur et rend un état propre avec un geste pour
// s'en sortir. React n'offre pas d'équivalent en hook : une frontière d'erreur reste une classe.
import React from 'react';

interface EtatErreur {
  aPlante: boolean;
}

export class ErreurRacine extends React.Component<React.PropsWithChildren, EtatErreur> {
  // ponytail: le dépôt n'a pas @types/react (React 19 sans types), la classe de base est donc
  // typée any et ne déclare pas props; on le déclare ici plutôt que d'installer les types partout.
  declare readonly props: Readonly<{ children?: React.ReactNode }>;
  state: EtatErreur = { aPlante: false };

  static getDerivedStateFromError(): EtatErreur {
    return { aPlante: true };
  }

  componentDidCatch(erreur: unknown) {
    // Un plantage en cours de rendu peut laisser le défilement verrouillé (l'intro le bloque le
    // temps de jouer, cf components/motion/Intro.tsx) sans que l'effet de nettoyage n'ait eu la
    // chance de tourner : on lève ce verrou nous-mêmes, sinon la page de recours reste figée elle aussi.
    document.documentElement.style.overflow = '';
    // eslint-disable-next-line no-console
    console.error('[ErreurRacine]', erreur);
  }

  render() {
    if (!this.state.aPlante) return this.props.children;
    const fr = !navigator.language || navigator.language.toLowerCase().startsWith('fr');
    return (
      <div className="min-h-screen flex items-center justify-center bg-papier text-encre px-6">
        <div className="text-center max-w-sm">
          <p className="font-serif text-h3 mb-3">
            {fr ? "Le chargement a échoué." : 'Loading failed.'}
          </p>
          <p className="text-corps text-gris mb-6">
            {fr
              ? 'Une nouvelle version du site est sûrement en ligne.'
              : 'A newer version of the site is likely live.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-pilule bg-bouton text-sur-bouton hover:bg-bouton-2 px-6 py-3 text-petit font-medium transition-colors"
          >
            {fr ? 'Recharger' : 'Reload'}
          </button>
        </div>
      </div>
    );
  }
}

export default ErreurRacine;
