import React, { useEffect, useMemo, useRef, useState } from 'react';
import { increment, orderBy, serverTimestamp } from 'firebase/firestore';
import { AlertCircle, Send } from 'lucide-react';
import { createDoc, patchDoc, useCollection } from '../../lib/firestore';
import { useTextes } from '../../lib/textes';
import { DossierMessage, Language } from '../../types';

interface MessagesProps {
  uid: string;
  lang: Language;
}

const PHOTO_LAURIE = '/images/laurie-apropos.jpg';
const HAUTEUR_CHAMP_MAX = 84; // ~3 lignes avant que le champ défile plutôt que de grandir encore

const versDate = (ts: any): Date => {
  if (ts?.toDate) return ts.toDate();
  if (ts instanceof Date) return ts;
  return new Date();
};

const memeJour = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const jourClef = (d: Date): string => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const etiquetteJour = (d: Date, lang: Language, aujourdhui: string, hier: string): string => {
  const maintenant = new Date();
  if (memeJour(d, maintenant)) return aujourdhui;
  const veille = new Date(maintenant);
  veille.setDate(veille.getDate() - 1);
  if (memeJour(d, veille)) return hier;
  const locale = lang === 'EN' ? 'en-CA' : 'fr-CA';
  return d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: d.getFullYear() !== maintenant.getFullYear() ? 'numeric' : undefined,
  });
};

const heureCourte = (d: Date, lang: Language): string =>
  d.toLocaleTimeString(lang === 'EN' ? 'en-CA' : 'fr-CA', { hour: '2-digit', minute: '2-digit' });

type Groupe = { cle: string; de: 'client' | 'admin'; msgs: DossierMessage[] };
type Item = { kind: 'sep'; cle: string; texte: string } | { kind: 'groupe'; groupe: Groupe };

const TEXTES = {
  FR: {
    titre: 'Messages',
    nomLaurie: 'Laurie Belhumeur',
    sous: 'Te répond ici, dans ton dossier',
    placeholder: 'Ton message',
    envoyer: 'Envoyer',
    vide: 'Écris-moi ici : je te réponds dans ce fil.',
    echec: 'L\'envoi a échoué. Réessaie dans un instant.',
    aujourdhui: 'Aujourd\'hui',
    hier: 'Hier',
    vu: 'Vu',
  },
  EN: {
    titre: 'Messages',
    nomLaurie: 'Laurie Belhumeur',
    sous: 'Replies to you here, in your file',
    placeholder: 'Your message',
    envoyer: 'Send',
    vide: 'Write to me here: I reply to you in this thread.',
    echec: 'Sending failed. Try again in a moment.',
    aujourdhui: 'Today',
    hier: 'Yesterday',
    vu: 'Seen',
  },
};

const Messages: React.FC<MessagesProps> = ({ uid, lang }) => {
  const { data: messages } = useCollection<DossierMessage>(`dossiers/${uid}/messages`, [orderBy('createdAt', 'asc')]);
  const [texte, setTexte] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filRef = useRef<HTMLDivElement>(null);
  const champRef = useRef<HTMLTextAreaElement>(null);
  const marqueEnCours = useRef(false);
  const t = useTextes('espaceMessages', TEXTES, lang);

  useEffect(() => {
    filRef.current?.scrollTo({ top: filRef.current.scrollHeight });
  }, [messages.length]);

  // À l'ouverture, marquer les messages de Laurie comme lus et remettre nonLusClient à 0.
  useEffect(() => {
    const nonLus = messages.filter((m) => m.de === 'admin' && !m.luParClient);
    if (nonLus.length === 0 || marqueEnCours.current) return;
    marqueEnCours.current = true;
    Promise.all(nonLus.map((m) => patchDoc<Record<string, any>>(`dossiers/${uid}/messages`, m.id, { luParClient: true })))
      .then(() => patchDoc<Record<string, any>>('dossiers', uid, { nonLusClient: 0 }))
      .catch(() => {})
      .finally(() => {
        marqueEnCours.current = false;
      });
  }, [messages, uid]);

  // Le champ grandit avec le texte, jusqu'à ~3 lignes, puis défile.
  useEffect(() => {
    const el = champRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, HAUTEUR_CHAMP_MAX)}px`;
  }, [texte]);

  const items = useMemo<Item[]>(() => {
    const out: Item[] = [];
    let jourCourant: string | null = null;
    let groupeCourant: Groupe | null = null;

    messages.forEach((m) => {
      const d = versDate(m.createdAt);
      const clef = jourClef(d);
      if (clef !== jourCourant) {
        if (groupeCourant) {
          out.push({ kind: 'groupe', groupe: groupeCourant });
          groupeCourant = null;
        }
        out.push({ kind: 'sep', cle: `sep-${clef}`, texte: etiquetteJour(d, lang, t.aujourdhui, t.hier) });
        jourCourant = clef;
      }
      if (!groupeCourant || groupeCourant.de !== m.de) {
        if (groupeCourant) out.push({ kind: 'groupe', groupe: groupeCourant });
        groupeCourant = { cle: m.id, de: m.de, msgs: [m] };
      } else {
        groupeCourant.msgs.push(m);
      }
    });
    if (groupeCourant) out.push({ kind: 'groupe', groupe: groupeCourant });
    return out;
  }, [messages, lang, t.aujourdhui, t.hier]);

  const dernierMsg = messages[messages.length - 1];
  const vuDernier = !!dernierMsg && dernierMsg.de === 'client' && !!dernierMsg.luParAdmin;

  const envoyer = async () => {
    const v = texte.trim();
    if (!v || busy) return;
    setBusy(true);
    setError(null);
    try {
      await createDoc(`dossiers/${uid}/messages`, {
        texte: v,
        de: 'client',
        deUid: uid,
        luParAdmin: false,
        luParClient: true,
      });
      await patchDoc<Record<string, any>>('dossiers', uid, {
        nonLusAdmin: increment(1),
        derniereActiviteClient: serverTimestamp(),
      });
      setTexte('');
    } catch {
      setError(t.echec);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    envoyer();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      envoyer();
    }
  };

  const rendreGroupe = (groupe: Groupe) => {
    const estClient = groupe.de === 'client';
    const dernier = groupe.msgs[groupe.msgs.length - 1];
    const montrerVu = estClient && dernier.id === dernierMsg?.id && vuDernier;

    return (
      <div key={groupe.cle} className={`flex flex-col gap-1 ${estClient ? 'items-end' : 'items-start'}`}>
        <div className="flex items-end gap-2 max-w-[78%]">
          {!estClient && (
            <img
              src={PHOTO_LAURIE}
              alt=""
              className="w-7 h-7 rounded-full object-cover object-[50%_20%] flex-shrink-0"
            />
          )}
          <div className="flex flex-col gap-1 min-w-0">
            {groupe.msgs.map((m) => {
              const estDernierDuGroupe = m.id === dernier.id;
              const coin = estDernierDuGroupe ? (estClient ? 'rounded-br-[4px]' : 'rounded-bl-[4px]') : '';
              return (
                <p
                  key={m.id}
                  className={`rounded-[18px] ${coin} px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line font-sans ${
                    estClient ? 'bg-bouton text-sur-bouton' : 'bg-papier-2 text-encre'
                  }`}
                >
                  {m.texte}
                </p>
              );
            })}
          </div>
        </div>
        <p className={`text-xs text-gris ${!estClient ? 'pl-9' : ''}`}>
          {heureCourte(versDate(dernier.createdAt), lang)}
          {montrerVu && <span className="block">{t.vu}</span>}
        </p>
      </div>
    );
  };

  return (
    <section data-tx-scope="espaceMessages" className="border-t border-filet pt-8 flex flex-col">
      <h2 className="sr-only">{t.titre}</h2>

      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-filet flex-shrink-0">
        <img
          src={PHOTO_LAURIE}
          alt={t.nomLaurie}
          className="w-11 h-11 rounded-full object-cover object-[50%_20%] flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="font-sans font-semibold text-encre truncate">{t.nomLaurie}</p>
          <p className="text-xs text-gris truncate">{t.sous}</p>
        </div>
      </div>

      <div ref={filRef} data-lenis-prevent className="min-h-[50vh] max-h-[65vh] overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 py-16 text-center">
            <img src={PHOTO_LAURIE} alt="" className="w-11 h-11 rounded-full object-cover object-[50%_20%]" />
            <p className="text-gris text-sm">{t.vide}</p>
          </div>
        ) : (
          items.map((item) =>
            item.kind === 'sep' ? (
              <p key={item.cle} className="kicker text-gris text-center">
                {item.texte}
              </p>
            ) : (
              rendreGroupe(item.groupe)
            )
          )
        )}
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 text-sm text-rose mt-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex items-end gap-2 mt-4 flex-shrink-0">
        <label htmlFor="msg-champ" className="sr-only">
          {t.placeholder}
        </label>
        <textarea
          id="msg-champ"
          ref={champRef}
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.placeholder}
          maxLength={5000}
          rows={1}
          className="flex-1 bg-papier-2 border border-filet rounded-pilule px-5 py-2.5 min-h-[44px] max-h-[84px] text-sm text-encre placeholder-gris resize-none overflow-y-auto transition-colors focus:outline-none focus:border-rose"
        />
        <button
          type="submit"
          disabled={busy || !texte.trim()}
          aria-label={t.envoyer}
          className="w-11 h-11 rounded-full bg-bouton flex items-center justify-center text-sur-bouton flex-shrink-0 disabled:opacity-50 hover:bg-bouton-2 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
};

export default Messages;
