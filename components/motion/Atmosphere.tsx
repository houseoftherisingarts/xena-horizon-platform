// Atmosphere — transforme un panneau plat en matière éclairée : un halo
// directionnel, une vignette et un grain de film. Pur CSS, zéro image,
// zéro coût de repaint. Couleurs par variables `--xh-*` (surchargeables),
// jamais en dur : `strength` module l'intensité via `opacity`, pas la
// couleur elle-même.

import React from 'react';

const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export interface AtmosphereProps {
  /** Position du halo principal, en `'x% y%'`. */
  light?: string;
  /** Intensité globale des halos, 0 à 1. */
  strength?: number;
  grain?: boolean;
  vignette?: boolean;
  className?: string;
}

export const Atmosphere: React.FC<AtmosphereProps> = ({
  light = '76% 14%',
  strength = 1,
  grain = true,
  vignette = true,
  className = '',
}) => (
  <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
    {strength > 0 && (
      <>
        <div
          className="absolute inset-0"
          style={{
            opacity: strength,
            background: `radial-gradient(58% 46% at ${light}, var(--xh-lumiere, rgba(255,255,255,0.16)), transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: strength,
            background: `radial-gradient(72% 58% at 20% 96%, var(--xh-lumiere-secondaire, rgba(255,255,255,0.1)), transparent 72%)`,
          }}
        />
      </>
    )}
    {vignette && (
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 92% at 50% 40%, transparent 56%, var(--xh-vignette, rgba(0,0,0,0.5)) 100%)',
        }}
      />
    )}
    {grain && (
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{ backgroundImage: GRAIN_URI, backgroundSize: '160px 160px', mixBlendMode: 'overlay' }}
      />
    )}
  </div>
);

export default Atmosphere;
