// Le balado « En quête de liberté », écoutable dans le site : les épisodes viennent de /balado.json,
// instantané du flux RSS de Balado Québec pris à chaque déploiement (scripts/balado.mjs). Le lecteur
// est celui des témoignages audio ; un seul épisode joue à la fois.
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import LecteurAudio from './LecteurAudio';
import { useTextes } from '../lib/textes';
import type { Language } from '../types';

interface Episode { titre: string; date: string; duree: number; description: string; url: string; image?: string }
interface Flux { titre?: string; prisLe?: string; episodes: Episode[] }

const TEXTES = {
  FR: { kicker: 'Écouter ici', titre: 'Les épisodes', vide: 'Les épisodes arrivent bientôt.', plus: 'Voir tous les épisodes', moins: 'Voir moins', minutes: 'min', prisLe: 'Épisodes à jour au' },
  EN: { kicker: 'Listen here', titre: 'Episodes', vide: 'Episodes are coming soon.', plus: 'See all episodes', moins: 'See fewer', minutes: 'min', prisLe: 'Episodes as of' },
};

const dateLongue = (iso: string, lang: Language) => new Date(iso + 'T12:00:00').toLocaleDateString(lang === 'FR' ? 'fr-CA' : 'en-CA', { day: 'numeric', month: 'long', year: 'numeric' });

const Balado: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useTextes('balado', TEXTES, lang);
  const [flux, setFlux] = useState<Flux | null>(null);
  const [tous, setTous] = useState(false);
  useEffect(() => {
    fetch('/balado.json').then((r) => (r.ok ? r.json() : { episodes: [] })).then(setFlux).catch(() => setFlux({ episodes: [] }));
  }, []);
  if (!flux) return null;
  const episodes = tous ? flux.episodes : flux.episodes.slice(0, 3);
  return (
    <div data-tx-scope="balado" className="mt-10 border-t border-filet pt-8">
      <p className="kicker text-rose mb-2">{t.kicker}</p>
      <h3 className="font-serif text-h3 text-encre mb-6">{t.titre}</h3>
      {flux.episodes.length === 0 ? (
        <p className="text-gris text-sm">{t.vide}</p>
      ) : (
        <ol className="divide-y divide-filet">
          {episodes.map((e) => (
            <li key={e.url} className="py-5 grid gap-4 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <p className="font-sans font-semibold text-encre">{e.titre}</p>
                <p className="text-petit text-gris mt-1">
                  {dateLongue(e.date, lang)}{e.duree ? ` · ${Math.round(e.duree / 60)} ${t.minutes}` : ''}
                </p>
              </div>
              <div className="md:col-span-7">
                <LecteurAudio src={e.url} nom={e.titre} lang={lang} genre="episode" />
              </div>
            </li>
          ))}
        </ol>
      )}
      {flux.episodes.length > 3 && (
        <button type="button" onClick={() => setTous((v) => !v)} className="mt-4 inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-encre hover:text-rose">
          {tous ? t.moins : t.plus} <ChevronDown className={`w-4 h-4 transition-transform ${tous ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      )}
      {flux.prisLe && <p className="mt-4 text-xs text-gris">{t.prisLe} {dateLongue(flux.prisLe, lang)}.</p>}
    </div>
  );
};

export default Balado;
