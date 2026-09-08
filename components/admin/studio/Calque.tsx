// Le rendu visuel d'un calque, sans aucune logique de geste : la toile éditable et les vignettes
// de gabarits appellent ce même composant, à des tailles différentes, pour qu'un gabarit rendu en
// petit soit un vrai aperçu et pas une image à part.
import React from 'react';
import type { Calque as TCalque } from '../../../lib/studio/types';

const POLICE_CSS: Record<'serif' | 'sans', string> = {
  serif: "'Playfair Display', Georgia, serif",
  sans: "Figtree, 'Avenir Next', sans-serif",
};

export const CalqueRendu: React.FC<{ calque: TCalque; hauteurAffichee: number }> = ({ calque, hauteurAffichee }) => {
  if (calque.type === 'texte') {
    const taille = (calque.taillePct / 100) * hauteurAffichee;
    return (
      <div
        className="w-full h-full flex overflow-hidden select-none"
        style={{
          alignItems: 'center',
          justifyContent: calque.align === 'left' ? 'flex-start' : calque.align === 'right' ? 'flex-end' : 'center',
        }}
      >
        <p
          style={{
            fontFamily: POLICE_CSS[calque.police],
            fontSize: `${Math.max(taille, 1)}px`,
            fontWeight: calque.graisse,
            color: calque.couleur,
            textAlign: calque.align,
            lineHeight: 1.2,
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textShadow: calque.ombre ? '0 2px 10px rgba(0,0,0,0.55)' : 'none',
          }}
        >
          {calque.texte}
        </p>
      </div>
    );
  }

  if (calque.type === 'image') {
    return (
      <img
        src={calque.src}
        alt=""
        className="w-full h-full object-cover select-none pointer-events-none"
        style={{ filter: calque.nb ? 'grayscale(100%)' : 'none' }}
        draggable={false}
      />
    );
  }

  // forme
  const estLigne = calque.forme === 'ligne';
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: calque.filet ? 'transparent' : calque.couleur,
        border: calque.filet ? `2px solid ${calque.couleur}` : 'none',
        opacity: calque.opacitePct / 100,
        borderRadius: calque.forme === 'cercle' ? '9999px' : estLigne ? '9999px' : '4px',
      }}
    />
  );
};
