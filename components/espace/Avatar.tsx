import React from 'react';

/** Les tailles fixes du canon : lg = 96px mobile / 128px bureau (bannière de l'espace), md et sm pour un usage plus discret. */
const TAILLES: Record<'lg' | 'md' | 'sm', { boite: string; texte: string }> = {
  lg: { boite: 'w-24 h-24 md:w-32 md:h-32', texte: 'text-3xl md:text-4xl' },
  md: { boite: 'w-20 h-20', texte: 'text-2xl' },
  sm: { boite: 'w-10 h-10', texte: 'text-sm' },
};

interface AvatarProps {
  url?: string;
  nom: string;
  taille?: keyof typeof TAILLES;
  className?: string;
}

/** Photo ronde de la personne, ou son initiale sur fond encre quand elle n'a pas encore de photo. */
const Avatar: React.FC<AvatarProps> = ({ url, nom, taille = 'md', className = '' }) => {
  const { boite, texte } = TAILLES[taille];
  const base = `${boite} rounded-full border-4 border-papier flex-shrink-0 overflow-hidden bg-papier-2`;

  if (url) {
    return <img src={url} alt={nom} className={`${base} object-cover ${className}`} />;
  }

  const initiale = nom.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className={`${base} bg-encre text-papier font-serif flex items-center justify-center ${texte} ${className}`} aria-hidden="true">
      {initiale}
    </div>
  );
};

export default Avatar;
