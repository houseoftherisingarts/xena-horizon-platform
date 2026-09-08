// KenBurns — zoom continu et lent sur une image plein cadre. Boucle
// inversée (aller-retour), statique en reduced motion, en pause hors
// champ (IntersectionObserver) pour ne jamais payer le coût GPU d'un
// zoom que personne ne regarde.

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { useCadrage } from '@/lib/cadrages';

export interface KenBurnsProps {
  src: string;
  /** Variantes responsives, ex. `'/img-640.webp 640w, /img-1200.webp 1200w'`. */
  srcSet?: string;
  /** `sizes` CSS assorti à `srcSet`. */
  sizes?: string;
  alt?: string;
  className?: string;
  /** Échelle de départ. */
  from?: number;
  /** Échelle d'arrivée avant le retour. */
  to?: number;
  /** Durée d'un aller, en secondes. */
  duration?: number;
  /** `object-position` CSS (ex. '50% 20%'). */
  position?: string;
  /** 'eager' pour un hero au-dessus du pli (défaut), 'lazy' pour une photo plus bas dans la page. */
  loading?: 'eager' | 'lazy';
  /** `high` pour la photo du hero, sert `fetchpriority` au navigateur. */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Identifiant de cadrage : Laurie peut alors recadrer la photo avec le crayon (lib/cadrages.tsx). */
  cadre?: string;
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  srcSet,
  sizes,
  alt = '',
  className = '',
  from = 1.06,
  to = 1.16,
  duration = 22,
  position,
  loading = 'eager',
  fetchPriority,
  cadre,
}) => {
  const reduce = useReducedMotion();
  const cadrage = useCadrage(cadre ?? '', position);
  // Le zoom de Laurie passe par la propriété CSS `scale`, indépendante du `transform` que framer anime :
  // les deux se multiplient, la boucle garde son amplitude autour du point focal.
  const zoom = cadrage.cadre.z;
  const controls = useAnimation();
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          controls.start({ scale: to, transition: { duration, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' } });
        } else {
          controls.stop();
        }
      },
      { threshold: 0 }
    );
    observateur.observe(el);
    return () => observateur.disconnect();
  }, [reduce, controls, to, duration]);

  useEffect(() => {
    ref.current?.style.setProperty('scale', zoom === 1 ? '' : String(zoom));
  }, [zoom]);

  return (
    <motion.img
      ref={ref}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      loading={loading}
      fetchPriority={fetchPriority}
      className={`h-full w-full object-cover ${className}`}
      data-cadre={cadre}
      data-cadre-base={cadrage['data-cadre-base']}
      style={{ objectPosition: cadrage.style.objectPosition, transformOrigin: cadrage.style.transformOrigin }}
      initial={reduce ? false : { scale: from }}
      animate={reduce ? undefined : controls}
    />
  );
};

export default KenBurns;
