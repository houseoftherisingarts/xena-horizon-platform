// L'aperçu exact du courriel : le même moteur qui produit le HTML copié (lib/infolettre/renderer)
// rend la page dans une iframe isolée. Un seul moteur, jamais deux rendus qui pourraient diverger.
// Deux largeurs au choix : bureau (la largeur réelle du courriel, 600px) et téléphone (375px, la
// largeur où la plupart des messageries mobiles l'affichent).
import React, { useMemo, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import type { Language } from '../../../types';
import type { BandeauInfolettre, NewsletterBlock } from '../../../lib/infolettre/renderer';
import { renderEmailHtml } from '../../../lib/infolettre/email';
import { piedCourriel } from '../../../lib/infolettre/gabarits';
import { useTextes } from '../../../lib/textes';

const TEXTES = {
  FR: { titre: 'Le courriel tel qu’il partira', bureau: 'Bureau', telephone: 'Téléphone' },
  EN: { titre: 'The email as it will be sent', bureau: 'Desktop', telephone: 'Phone' },
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
  const [vue, setVue] = useState<'bureau' | 'telephone'>('bureau');
  const html = useMemo(
    () => renderEmailHtml(blocs, { subject: sujet || '', preheader, unsubscribeUrl: '#', postalAddress: piedCourriel, fond, bandeau }),
    [blocs, sujet, preheader, fond, bandeau]
  );
  const largeur = vue === 'telephone' ? 375 : 640;
  return (
    <div data-tx-scope="adminInfolettre_apercu" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="kicker text-gris">{t.titre}</p>
        <div className="inline-flex rounded-pilule border border-filet p-0.5">
          <button type="button" onClick={() => setVue('bureau')} aria-label={t.bureau} title={t.bureau}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pilule text-xs font-semibold transition-colors ${vue === 'bureau' ? 'bg-bouton text-sur-bouton' : 'text-gris hover:text-encre'}`}>
            <Monitor className="w-3.5 h-3.5" aria-hidden="true" /> {t.bureau}
          </button>
          <button type="button" onClick={() => setVue('telephone')} aria-label={t.telephone} title={t.telephone}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pilule text-xs font-semibold transition-colors ${vue === 'telephone' ? 'bg-bouton text-sur-bouton' : 'text-gris hover:text-encre'}`}>
            <Smartphone className="w-3.5 h-3.5" aria-hidden="true" /> {t.telephone}
          </button>
        </div>
      </div>
      <div className="rounded-champ overflow-hidden border border-filet bg-papier-2 flex justify-center">
        <iframe title={t.titre} srcDoc={html} sandbox="" style={{ width: largeur, maxWidth: '100%', height, border: 0, display: 'block', background: '#fff' }} />
      </div>
    </div>
  );
};

export default Apercu;
