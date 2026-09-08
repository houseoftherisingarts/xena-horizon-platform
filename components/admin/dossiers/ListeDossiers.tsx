import React, { useMemo, useState } from 'react';
import { Search, Download, FolderOpen, FileWarning, MessageCircle, Archive } from 'lucide-react';
import { Dossier, DossierConfig, Language } from '../../../types';
import { PROFILS, avancement, dossiersCsv, etatPiece, telecharger } from '../../../lib/dossier';
import { dateCourte } from './util';
import { EnTete, Panneau, Bouton, Chiffre, Vide, Chargement, Etiquette } from '../ui';

interface ListeDossiersProps {
  dossiers: Dossier[];
  config: DossierConfig;
  lang: Language;
  loading: boolean;
  onSelect: (uid: string) => void;
}

const t = {
  FR: {
    title: 'Dossiers',
    subtitle: "Les personnes accompagnées, où elles en sont.",
    search: 'Chercher un nom, un courriel, un projet…',
    tousEtapes: 'Toutes les étapes',
    tousProfils: 'Tous les profils',
    actifs: 'Actifs',
    archives: 'Archivés',
    export: 'Export CSV',
    dossiersActifs: 'Dossiers actifs',
    piecesAValider: 'Pièces à valider',
    messagesNonLus: 'Messages non lus',
    aucun: 'Aucun dossier ici.',
    chargement: 'Chargement…',
    avancement: 'Avancement',
    activite: 'Dernière activité',
  },
  EN: {
    title: 'Client files',
    subtitle: 'The people you support, and where they stand.',
    search: 'Search a name, email, project…',
    tousEtapes: 'All steps',
    tousProfils: 'All profiles',
    actifs: 'Active',
    archives: 'Archived',
    export: 'Export CSV',
    dossiersActifs: 'Active files',
    piecesAValider: 'Files to review',
    messagesNonLus: 'Unread messages',
    aucun: 'Nothing here.',
    chargement: 'Loading…',
    avancement: 'Progress',
    activite: 'Last activity',
  },
};

const ListeDossiers: React.FC<ListeDossiersProps> = ({ dossiers, config, lang, loading, onSelect }) => {
  const tr = t[lang];
  const [recherche, setRecherche] = useState('');
  const [filtreEtape, setFiltreEtape] = useState('tous');
  const [filtreProfil, setFiltreProfil] = useState('tous');
  const [afficherArchives, setAfficherArchives] = useState(false);

  const actifs = useMemo(() => dossiers.filter((d) => !d.archive), [dossiers]);
  const piecesAValider = useMemo(
    () =>
      actifs.reduce((n, d) => {
        const ids = d.pieces ? Object.keys(d.pieces) : [];
        return n + ids.filter((id) => ['deposee', 'redeposee'].includes(etatPiece(d, id))).length;
      }, 0),
    [actifs]
  );
  const messagesNonLus = useMemo(() => actifs.reduce((n, d) => n + (d.nonLusAdmin || 0), 0), [actifs]);

  const filtres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return dossiers
      .filter((d) => (afficherArchives ? d.archive : !d.archive))
      .filter((d) => filtreEtape === 'tous' || d.etape === filtreEtape)
      .filter((d) => filtreProfil === 'tous' || d.profil === filtreProfil)
      .filter(
        (d) =>
          !q ||
          d.nom?.toLowerCase().includes(q) ||
          d.courriel?.toLowerCase().includes(q) ||
          d.projet?.titre?.toLowerCase().includes(q)
      );
  }, [dossiers, afficherArchives, filtreEtape, filtreProfil, recherche]);

  const exporter = () => telecharger('dossiers-xena-horizon.csv', dossiersCsv(filtres, config), 'text/csv;charset=utf-8');

  const CHAMP =
    'w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose';

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">
      <EnTete
        titre={tr.title}
        lede={tr.subtitle}
        actions={
          <Bouton variante="secondaire" icone={Download} onClick={exporter}>
            {tr.export}
          </Bouton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Panneau>
          <div className="flex items-center gap-4">
            <FolderOpen className="w-6 h-6 text-rose flex-shrink-0" aria-hidden="true" />
            <Chiffre valeur={actifs.length} libelle={tr.dossiersActifs} />
          </div>
        </Panneau>
        <Panneau>
          <div className="flex items-center gap-4">
            <FileWarning className="w-6 h-6 text-rose flex-shrink-0" aria-hidden="true" />
            <Chiffre valeur={piecesAValider} libelle={tr.piecesAValider} />
          </div>
        </Panneau>
        <Panneau>
          <div className="flex items-center gap-4">
            <MessageCircle className="w-6 h-6 text-rose flex-shrink-0" aria-hidden="true" />
            <Chiffre valeur={messagesNonLus} libelle={tr.messagesNonLus} />
          </div>
        </Panneau>
      </div>

      <Panneau>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gris" aria-hidden="true" />
            <input
              type="text"
              placeholder={tr.search}
              className={`${CHAMP} pl-10`}
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
          <select value={filtreEtape} onChange={(e) => setFiltreEtape(e.target.value)} className={`${CHAMP} lg:w-52`}>
            <option value="tous">{tr.tousEtapes}</option>
            {config.etapes.map((e) => (
              <option key={e.id} value={e.id}>{e.titre}</option>
            ))}
          </select>
          <select value={filtreProfil} onChange={(e) => setFiltreProfil(e.target.value)} className={`${CHAMP} lg:w-52`}>
            <option value="tous">{tr.tousProfils}</option>
            {PROFILS.map((p) => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
          <div className="flex rounded-champ border border-filet overflow-hidden">
            <button
              type="button"
              onClick={() => setAfficherArchives(false)}
              className={`px-4 min-h-[44px] text-sm font-medium ${!afficherArchives ? 'bg-encre text-papier' : 'text-gris hover:text-encre'}`}
            >
              {tr.actifs}
            </button>
            <button
              type="button"
              onClick={() => setAfficherArchives(true)}
              className={`px-4 min-h-[44px] text-sm font-medium flex items-center gap-1.5 ${afficherArchives ? 'bg-encre text-papier' : 'text-gris hover:text-encre'}`}
            >
              <Archive className="w-3.5 h-3.5" aria-hidden="true" /> {tr.archives}
            </button>
          </div>
        </div>
      </Panneau>

      {loading ? (
        <Chargement texte={tr.chargement} />
      ) : filtres.length === 0 ? (
        <Vide titre={tr.aucun} />
      ) : (
        <div className="space-y-4">
          {filtres.map((d) => {
            const pct = avancement(d, config.pieces);
            const etape = config.etapes.find((e) => e.id === d.etape);
            const profil = PROFILS.find((p) => p.id === d.profil)?.nom ?? d.profil;
            return (
              <button
                type="button"
                key={d.id}
                onClick={() => onSelect(d.id)}
                className="w-full text-left bg-papier-2 border border-filet rounded-champ p-6 hover:border-encre transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-serif text-h3 text-encre">{d.nom || d.courriel}</h3>
                      {!!d.nonLusAdmin && <Etiquette tone="accent">{d.nonLusAdmin}</Etiquette>}
                    </div>
                    <p className="text-rose text-sm">{profil}</p>
                    {d.projet?.titre && <p className="text-gris text-sm line-clamp-1 mt-1">{d.projet.titre}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 sm:items-center text-sm text-gris">
                    <div>
                      <span className="block kicker text-gris mb-1">{etape ? tr.avancement : ''}</span>
                      <Etiquette tone="neutre" className="mb-1.5">{etape?.titre ?? d.etape}</Etiquette>
                      <div className="w-32 h-1.5 rounded-pilule bg-filet overflow-hidden">
                        <div className="h-full bg-rose" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div>
                      <span className="block kicker text-gris">{tr.activite}</span>
                      {dateCourte(d.derniereActiviteClient) || '-'}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListeDossiers;
