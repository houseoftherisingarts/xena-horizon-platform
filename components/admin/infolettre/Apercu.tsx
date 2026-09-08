// L'aperçu exact du courriel : le même moteur qui produit le HTML copié (lib/infolettre/renderer)
// rend la page dans une iframe isolée. Un seul moteur, jamais deux rendus qui pourraient diverger.
import React, { useMemo } from 'react';
import type { Language } from '../../../types';
import { renderEmailHtml, type BandeauInfolettre, type NewsletterBlock } from '../../../lib/infolettre/renderer';
import { useTextes } from '../../../lib/textes';

const TEXTES = {
  FR: { titre: 'Le courriel tel qu’il partira' },
  EN: { titre: 'The email as it will be sent' },
};

const Apercu: React.FC<{
  blocs: NewsletterBlock[];
  sujet: string;
  preheader?: string;
  fond?: string;
  bandeau?: BandeauInfolettre;
  lang: Language;
  height?: number;
}> = ({ blocs, sujet, preheader, fond, bandeau, lang, height = 760 }) => {
  const t = useTextes('adminInfolettre_apercu', TEXTES, lang);
  const html = useMemo(
    () => renderEmailHtml(blocs, { subject: sujet || '', preheader, unsubscribeUrl: '#', postalAddress: '', fond, bandeau }),
    [blocs, sujet, preheader, fond, bandeau]
  );
  return (
    <div data-tx-scope="adminInfolettre_apercu" className="space-y-3">
      <p className="kicker text-gris">{t.titre}</p>
      <div className="rounded-champ overflow-hidden border border-filet bg-papier-2">
        <iframe title={t.titre} srcDoc={html} sandbox="" style={{ width: '100%', height, border: 0, display: 'block' }} />
      </div>
    </div>
  );
};

export default Apercu;
