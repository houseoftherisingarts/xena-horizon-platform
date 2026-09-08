// Qui reçoit l'infolettre : tout le monde, une ou plusieurs listes (étiquettes), ou des personnes
// choisies une à une. La liste de Xena est petite : on lit `subscribers` directement, sans fonction
// serveur.
import React, { useMemo, useState } from 'react';
import type { Language } from '../../../types';
import type { Subscriber } from '../../../types';
import { useCollection } from '../../../lib/firestore';
import type { NewsletterAudience } from '../../../lib/infolettre/renderer';
import { useTextes } from '../../../lib/textes';

const TEXTES = {
  FR: {
    titre: 'Destinataires',
    personnes: 'personne',
    tous: 'Tout le monde',
    tags: 'Certaines listes',
    choix: 'Des personnes',
    langueTitre: 'Langue des destinataires',
    langueAuto: 'Celle de la lettre',
    fr: 'Français',
    en: 'Anglais',
    toutes: 'Toutes',
    aucuneListe: 'Aucune liste pour le moment.',
    chercher: 'Chercher une personne (deux lettres au moins)…',
    retirer: 'Retirer',
  },
  EN: {
    titre: 'Recipients',
    personnes: 'person',
    tous: 'Everyone',
    tags: 'Some lists',
    choix: 'Chosen people',
    langueTitre: 'Recipients’ language',
    langueAuto: 'Same as the letter',
    fr: 'French',
    en: 'English',
    toutes: 'All',
    aucuneListe: 'No list yet.',
    chercher: 'Search a person (two letters minimum)…',
    retirer: 'Remove',
  },
};

const chip = (on: boolean) =>
  `px-3 py-1.5 rounded-pilule text-xs font-semibold border transition-colors ${
    on ? 'bg-bouton text-sur-bouton border-bouton' : 'bg-papier text-gris border-filet hover:text-encre hover:border-encre'
  }`;

const Audience: React.FC<{
  value: NewsletterAudience;
  onChange: (a: NewsletterAudience) => void;
  disabled?: boolean;
  letterLang: 'fr' | 'en';
  lang: Language;
}> = ({ value, onChange, disabled, letterLang, lang }) => {
  const t = useTextes('adminInfolettre_audience', TEXTES, lang);
  const { data: subs } = useCollection<Subscriber>('subscribers');
  const [q, setQ] = useState('');

  const actifs = useMemo(() => subs.filter((s) => s.status === 'active'), [subs]);

  const filtreLangue = value.langue === 'toutes' ? null : value.langue === 'auto' ? letterLang : value.langue;
  const correspondLangue = (s: Subscriber) => !filtreLangue || (s.lang || 'fr') === filtreLangue;

  const total = useMemo(() => {
    const dans = actifs.filter(correspondLangue);
    if (value.mode === 'tous') return dans.length;
    if (value.mode === 'tags') return value.tags.length ? dans.filter((s) => (s.tags || []).some((tg) => value.tags.includes(tg))).length : 0;
    return value.ids.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actifs, value.mode, value.tags, value.ids, filtreLangue]);

  const tagOptions = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of actifs) for (const tg of s.tags || []) m.set(tg, (m.get(tg) || 0) + 1);
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], 'fr'));
  }, [actifs]);

  const resultats = useMemo(() => {
    const f = q.trim().toLowerCase();
    if (f.length < 2) return [];
    return actifs.filter((s) => s.email.toLowerCase().includes(f) || (s.name || '').toLowerCase().includes(f)).slice(0, 40);
  }, [actifs, q]);

  const toggleTag = (tg: string) => onChange({ ...value, mode: 'tags', tags: value.tags.includes(tg) ? value.tags.filter((x) => x !== tg) : [...value.tags, tg] });
  const toggleId = (id: string) => onChange({ ...value, mode: 'choix', ids: value.ids.includes(id) ? value.ids.filter((x) => x !== id) : [...value.ids, id] });
  const parId = useMemo(() => new Map(subs.map((s) => [s.id, s])), [subs]);

  return (
    <div className="space-y-3" data-tx-scope="adminInfolettre_audience">
      <div className="flex items-baseline justify-between">
        <p className="kicker text-gris">{t.titre}</p>
        <p className="font-serif text-h3 text-encre tabular-nums">{total} <span className="kicker text-rose">{t.personnes}{total > 1 ? 's' : ''}</span></p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={disabled} className={chip(value.mode === 'tous')} onClick={() => onChange({ ...value, mode: 'tous' })}>{t.tous}</button>
        <button type="button" disabled={disabled} className={chip(value.mode === 'tags')} onClick={() => onChange({ ...value, mode: 'tags' })}>{t.tags}</button>
        <button type="button" disabled={disabled} className={chip(value.mode === 'choix')} onClick={() => onChange({ ...value, mode: 'choix' })}>{t.choix}</button>
      </div>

      {value.mode !== 'choix' && (
        <div className="space-y-1.5">
          <p className="text-xs text-gris">{t.langueTitre}</p>
          <div className="flex flex-wrap gap-2">
            {([['auto', t.langueAuto], ['fr', t.fr], ['en', t.en], ['toutes', t.toutes]] as const).map(([k, l]) => (
              <button key={k} type="button" disabled={disabled} className={chip(value.langue === k)} onClick={() => onChange({ ...value, langue: k })}>{l}</button>
            ))}
          </div>
        </div>
      )}

      {value.mode === 'tags' && (
        <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto">
          {tagOptions.length === 0 && <p className="text-xs text-gris">{t.aucuneListe}</p>}
          {tagOptions.map(([tg, n]) => (
            <button key={tg} type="button" disabled={disabled} onClick={() => toggleTag(tg)} className={chip(value.tags.includes(tg))}>
              {tg} <span className="opacity-60">· {n}</span>
            </button>
          ))}
        </div>
      )}

      {value.mode === 'choix' && (
        <div className="space-y-2">
          {value.ids.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {value.ids.map((id) => (
                <button key={id} type="button" disabled={disabled} onClick={() => toggleId(id)} className={chip(true)} title={t.retirer}>
                  {parId.get(id)?.email || id} ×
                </button>
              ))}
            </div>
          )}
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.chercher}
            disabled={disabled}
            className="w-full bg-papier border border-filet rounded-champ px-3 py-2 text-sm text-encre outline-none focus:border-rose"
          />
          {resultats.length > 0 && (
            <ul className="max-h-48 overflow-y-auto divide-y divide-filet text-sm border border-filet rounded-champ">
              {resultats.map((s) => (
                <li key={s.id}>
                  <button type="button" disabled={disabled} onClick={() => toggleId(s.id)} className="w-full text-left px-3 py-2 flex justify-between gap-2 hover:bg-papier-2 text-encre">
                    <span className="truncate">{s.name || '·'} · {s.email}</span>
                    {value.ids.includes(s.id) && <span className="text-rose">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Audience;
