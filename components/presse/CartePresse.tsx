import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cadrageDe, dit, urlPhoto, LOGO_PRESSE, QR_PRESSE, type CartePresse as Carte } from '../../lib/presse-contenu';
import type { Language } from '../../types';

// ─── Les cartes de la salle de presse, rendues dans le navigateur ───────────────────────────────
// Une carte fait exactement 1920 × 1080 : la page la montre à l'échelle, et le bouton Télécharger
// capture ce même DOM par html-to-image. Un seul gabarit, donc l'écran et le fichier livré ne
// peuvent pas diverger, et un mot corrigé dans l'admin se voit à la seconde suivante.
//
// La mise en page est celle d'une manchette, pas d'une affiche : le texte tient sur le papier, la
// photo occupe son panneau à côté. Les photos de Laurie sont pour la plupart en portrait (deux
// tiers de large pour trois de haut), et un cadre 16:9 plein écran n'en aurait gardé qu'une mince
// bande horizontale; un panneau de 46 % rend un cadre presque carré, où le portrait respire.
//
// Les couleurs sont écrites en dur plutôt que prises aux jetons du site : la carte est un fichier
// qui part chez un journaliste, elle ne doit pas changer selon la palette ni le mode nuit du
// visiteur. Ce sont les couleurs de Laurie, celles de la palette « ciel ».

const W = 1920;
const H = 1080;

const C = {
  papier: '#ffffff',
  papier2: '#f1f7fc',
  encre: '#181818',
  encre2: '#404040',
  azur: '#0876b5',
  ciel: '#38b6ff',
};

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "Figtree, 'Avenir Next', Avenir, system-ui, sans-serif";
const KICKER: React.CSSProperties = { fontFamily: SANS, fontSize: 17, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.24em', color: C.azur };

/**
 * La photo dans son panneau : `object-position` pour le point focal, `scale` pour le zoom.
 * Avec `contenir`, elle se montre entière au lieu de remplir le cadre, ce qu'il faut aux visuels
 * qui portent leur propre lettrage, parce qu'un panneau en portrait leur coupait le titre.
 */
export const PhotoCadree: React.FC<{ src: string; x: number; y: number; z: number; contenir?: boolean }> = ({ src, x, y, z, contenir }) => (
  <img
    src={src}
    alt=""
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: contenir ? 'contain' : 'cover',
      objectPosition: contenir ? 'center' : `${x}% ${y}%`,
      transform: contenir ? undefined : `scale(${z})`,
      transformOrigin: `${x}% ${y}%`,
    }}
  />
);

/**
 * Rapetisse le titre (pas de 3 px, plancher 44) tant qu'il dépasse deux lignes. La règle des deux
 * lignes tient donc même sur un titre que Laurie rallonge dans l'admin, sans qu'elle ait à compter.
 */
function useTitreCourt(depart: number, cle: unknown) {
  const titre = useRef<HTMLHeadingElement>(null);
  const [taille, setTaille] = useState(depart);
  const repartir = () => setTaille(depart);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(repartir, [cle, depart]);
  useLayoutEffect(() => {
    const t = titre.current;
    if (t && t.offsetHeight > taille * 1.04 * 2 + 2 && taille > 44) setTaille((v) => v - 3);
  }, [taille, cle]);
  // Les polices arrivent parfois après le premier rendu : on remesure une fois qu'elles sont prêtes.
  useEffect(() => {
    let vivant = true;
    document.fonts?.ready.then(() => vivant && repartir());
    return () => {
      vivant = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { titre, taille };
}

interface Props {
  carte: Carte;
  lang: Language;
  /** Le site et les coordonnées, au bas du panneau de texte. */
  pied: { site: string; courriel: string };
  /** Le code QR de la salle de presse, dans le coin du panneau photo. */
  qr?: boolean;
}

export const VisuelCarte = React.forwardRef<HTMLDivElement, Props>(({ carte, lang, pied, qr = false }, ref) => {
  const aj = useTitreCourt(96, `${dit(carte.titre, lang)}|${carte.largeur ?? 46}`);
  const cad = cadrageDe(carte);
  const large = carte.largeur ?? 46;
  const aDroite = carte.cote === 'droite';

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: W,
        height: H,
        overflow: 'hidden',
        background: C.papier,
        color: C.encre,
        fontFamily: SANS,
        display: 'flex',
        flexDirection: aDroite ? 'row' : 'row-reverse',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* Le panneau de texte : tout vit sur le papier, jamais posé sur la photo. */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '96px 84px 84px 104px', minWidth: 0 }}>
        <p style={KICKER}>{dit(carte.kicker, lang)}</p>
        <h1
          ref={aj.titre}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: aj.taille,
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            color: C.encre,
            margin: '30px 0 0',
          }}
        >
          {dit(carte.titre, lang)}
        </h1>
        <span style={{ width: 88, height: 3, background: C.ciel, margin: '38px 0 32px' }} />
        <p style={{ fontSize: 27, lineHeight: 1.55, color: C.encre2, maxWidth: '46ch', textWrap: 'pretty' }}>{dit(carte.corps, lang)}</p>
        <p style={{ ...KICKER, marginTop: 40, letterSpacing: '0.18em', fontSize: 16 }}>{dit(carte.meta, lang)}</p>

        <div style={{ marginTop: 'auto', paddingTop: 56, display: 'flex', alignItems: 'center', gap: 22, borderTop: `1px solid ${C.papier2}` }}>
          <img src={LOGO_PRESSE} alt="" style={{ height: 56, width: 56, objectFit: 'contain' }} />
          <div>
            <p style={{ fontFamily: SERIF, fontSize: 25, color: C.encre, lineHeight: 1.1 }}>Xena Horizon</p>
            <p style={{ fontSize: 16, color: C.encre2, marginTop: 6 }}>
              {pied.site} · {pied.courriel}
            </p>
          </div>
          {/* Le folio se lit : en bleu plutôt qu'en gris très pâle, un journaliste sait de quelle carte il parle. */}
          <p style={{ marginLeft: 'auto', fontFamily: SERIF, fontSize: 44, color: C.azur, lineHeight: 1 }}>{carte.n}</p>
        </div>
      </div>

      {/* Le panneau photo : coins vifs, aucun texte dessus, aucun voile. */}
      <div style={{ position: 'relative', width: `${large}%`, flexShrink: 0, overflow: 'hidden', background: C.papier2 }}>
        <PhotoCadree src={urlPhoto(carte.photo)} x={cad.x} y={cad.y} z={cad.z} contenir={carte.contenir} />
        {qr && (
          <div style={{ position: 'absolute', left: aDroite ? 'auto' : 40, right: aDroite ? 40 : 'auto', bottom: 40, background: C.papier, padding: '16px 16px 10px', textAlign: 'center' }}>
            <img src={QR_PRESSE} alt="" style={{ width: 124, height: 124, display: 'block', imageRendering: 'pixelated' }} />
            <p style={{ fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.encre, marginTop: 8 }}>{pied.site}</p>
          </div>
        )}
      </div>
    </div>
  );
});
VisuelCarte.displayName = 'VisuelCarte';

/**
 * Le cadre à l'échelle : la carte fait toujours 1920 × 1080 en vrai, et se réduit par `scale` pour
 * tenir dans la page. Mesurer le parent plutôt que deviner évite qu'un aperçu mente sur la mise en
 * page, puisque c'est le rendu exact du fichier qui sera livré.
 */
export const CadreEchelle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const boite = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.2);
  useLayoutEffect(() => {
    const el = boite.current;
    if (!el) return;
    const mesurer = () => setK(el.clientWidth / W);
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={boite} className={className} style={{ width: '100%', aspectRatio: `${W} / ${H}`, overflow: 'hidden' }}>
      <div style={{ width: W, height: H, transform: `scale(${k})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  );
};

export { W, H };
