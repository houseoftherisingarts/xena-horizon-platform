// La messagerie du module « Courriel et messagerie » : le fil de dossier (FilAdmin, réutilisé tel
// quel) précédé d'un en-tête social de la personne — bannière, avatar, profil, bio, liens.
import React, { useMemo, useState } from 'react';
import { orderBy, serverTimestamp, increment } from 'firebase/firestore';
import { ExternalLink, FolderOpen, ChevronLeft } from 'lucide-react';
import { auth } from '../../../firebase';
import { Dossier, DossierMessage, Language } from '../../../types';
import { useCollection, createDoc, patchDoc } from '../../../lib/firestore';
import { PROFILS } from '../../../lib/dossier';
import { dateCourte } from '../dossiers/util';
import { Bouton, Etiquette, Vide, Chargement } from '../ui';
import FilAdmin from '../dossiers/FilAdmin';
import { useTextes } from '../../../lib/textes';

const TEXTES = {
  FR: {
    search: 'Chercher un nom, un courriel…',
    aucun: 'Aucune conversation.',
    aucunTexte: 'Les échanges avec les personnes accompagnées apparaissent ici.',
    chargement: 'Chargement…',
    select: 'Choisis une conversation dans la liste.',
    voirDossier: 'Voir son dossier',
    retour: 'Retour à la liste',
  },
  EN: {
    search: 'Search a name, an email…',
    aucun: 'No conversation.',
    aucunTexte: 'Exchanges with the people you support appear here.',
    chargement: 'Loading…',
    select: 'Pick a conversation from the list.',
    voirDossier: 'View their file',
    retour: 'Back to list',
  },
};

interface MessagerieProps {
  dossiers: Dossier[];
  loading: boolean;
  lang: Language;
  onChangeView: (view: 'ADMIN_DOSSIERS') => void;
}

const Messagerie: React.FC<MessagerieProps> = ({ dossiers, loading, lang, onChangeView }) => {
  const t = useTextes('adminCourriel_messagerie', TEXTES, lang);
  const [recherche, setRecherche] = useState('');
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  const actifs = useMemo(() => dossiers.filter((d) => !d.archive), [dossiers]);
  const tries = useMemo(
    () =>
      [...actifs].sort((a, b) => (b.derniereActiviteClient?.toMillis?.() ?? 0) - (a.derniereActiviteClient?.toMillis?.() ?? 0)),
    [actifs]
  );
  const filtres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return tries;
    return tries.filter((d) => d.nom?.toLowerCase().includes(q) || d.courriel?.toLowerCase().includes(q));
  }, [tries, recherche]);

  const selected = selectedUid ? actifs.find((d) => d.id === selectedUid) ?? null : null;

  const msgConstraints = useMemo(() => [orderBy('createdAt', 'asc')], []);
  const { data: messages } = useCollection<DossierMessage>(
    selected ? `dossiers/${selected.id}/messages` : 'dossiers/__aucun__/messages',
    msgConstraints
  );

  const envoyerMessage = async (texte: string) => {
    if (!selected) return;
    const admin = auth.currentUser;
    if (!admin) throw new Error('non connecté');
    await createDoc(`dossiers/${selected.id}/messages`, {
      texte,
      de: 'admin',
      deUid: admin.uid,
      luParAdmin: true,
      luParClient: false,
    });
    await patchDoc('dossiers', selected.id, { nonLusClient: increment(1), derniereActiviteAdmin: serverTimestamp() });
  };

  const CHAMP =
    'w-full bg-papier border border-filet rounded-champ px-4 py-2.5 text-sm text-encre placeholder-gris outline-none transition-colors focus:border-rose';

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LISTE DES DOSSIERS */}
      <div className={`${selected ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 flex-shrink-0 flex-col gap-3`}>
        <input
          type="text"
          placeholder={t.search}
          aria-label={t.search}
          className={CHAMP}
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <div className="bg-papier-2 border border-filet rounded-champ overflow-hidden">
          {loading ? (
            <Chargement texte={t.chargement} />
          ) : filtres.length === 0 ? (
            <Vide titre={t.aucun} texte={t.aucunTexte} />
          ) : (
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-filet">
              {filtres.map((d) => {
                const actif = selected?.id === d.id;
                return (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => setSelectedUid(d.id)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors hover:bg-papier ${
                      actif ? 'bg-papier border-l-2 border-l-rose' : 'border-l-2 border-l-transparent'
                    }`}
                  >
                    {d.photoURL ? (
                      <img src={d.photoURL} alt="" className="w-11 h-11 rounded-pilule object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-pilule bg-encre text-papier flex items-center justify-center font-semibold flex-shrink-0">
                        {(d.nom || d.courriel || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-encre truncate">{d.nom || d.courriel}</p>
                      <p className="text-xs text-gris truncate">{dateCourte(d.derniereActiviteClient) || '—'}</p>
                    </div>
                    {!!d.nonLusAdmin && <Etiquette tone="accent">{d.nonLusAdmin}</Etiquette>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CONVERSATION */}
      <div className={`${selected ? 'flex' : 'hidden'} lg:flex flex-1 min-w-0 flex-col gap-4`}>
        {selected ? (
          <>
            <button
              type="button"
              onClick={() => setSelectedUid(null)}
              className="lg:hidden text-sm text-gris hover:text-encre self-start"
            >
              ← {t.aucun.length > 0 ? '' : ''}
            </button>
            <EnTeteSocial dossier={selected} lang={lang} t={t} onChangeView={onChangeView} />
            <div className="min-h-[360px] flex-1">
              <FilAdmin messages={messages} dossierNom={selected.nom || selected.courriel} lang={lang} onSend={envoyerMessage} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-papier-2 border border-filet rounded-champ py-14">
            <p className="text-gris text-sm">{t.select}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const EnTeteSocial: React.FC<{
  dossier: Dossier;
  lang: Language;
  t: (typeof TEXTES)['FR'];
  onChangeView: (view: 'ADMIN_DOSSIERS') => void;
}> = ({ dossier, lang, t, onChangeView }) => {
  const profil = PROFILS.find((p) => p.id === dossier.profil)?.nom ?? dossier.profil;
  const meta = [profil, dossier.discipline, dossier.ville].filter(Boolean).join(' · ');
  const liens = dossier.liens ? Object.entries(dossier.liens).filter(([, v]) => !!v) : [];

  return (
    <div className="bg-papier-2 border border-filet rounded-champ overflow-hidden">
      <div className="relative aspect-[4/1] bg-papier">
        <img
          src={dossier.banniereURL || '/images/banniere-defaut-960.jpg'}
          alt=""
          className="w-full h-full object-cover"
        />
        {dossier.photoURL ? (
          <img
            src={dossier.photoURL}
            alt=""
            className="absolute left-6 -bottom-8 w-16 h-16 rounded-pilule object-cover border-4 border-papier-2"
          />
        ) : (
          <div className="absolute left-6 -bottom-8 w-16 h-16 rounded-pilule bg-encre text-papier border-4 border-papier-2 flex items-center justify-center text-xl font-semibold">
            {(dossier.nom || dossier.courriel || '?').charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="pt-10 pb-5 px-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-h3 text-encre">{dossier.nom || dossier.courriel}</h3>
            {meta && <p className="text-sm text-gris mt-0.5">{meta}</p>}
          </div>
          <Bouton variante="secondaire" petit icone={FolderOpen} onClick={() => onChangeView('ADMIN_DOSSIERS')}>
            {t.voirDossier}
          </Bouton>
        </div>
        {dossier.bio && <p className="text-sm text-encre mesure">{dossier.bio}</p>}
        {liens.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {liens.map(([cle, url]) => (
              <a
                key={cle}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-rose hover:text-encre transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> {cle}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messagerie;
