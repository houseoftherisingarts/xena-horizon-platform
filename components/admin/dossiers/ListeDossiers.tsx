import React, { useMemo, useState } from 'react';
import { Search, Download, FolderOpen, FileWarning, MessageCircle, Archive } from 'lucide-react';
import GlassCard from '../../GlassCard';
import { GLASS_INPUT_CLASSES } from '../../../constants';
import { Dossier, DossierConfig, Language, PieceDeposee } from '../../../types';
import { PROFILS, avancement, dossiersCsv, telecharger } from '../../../lib/dossier';
import { dateCourte } from './util';

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
    () => actifs.reduce((n, d) => n + (d.pieces ? Object.values(d.pieces).filter((p) => p.etat === 'depose').length : 0), 0),
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">{tr.title}</h1>
          <p className="text-slate-400">{tr.subtitle}</p>
        </div>
        <button onClick={exporter} className="px-4 py-3 rounded-[15px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/10 flex items-center gap-2 text-sm min-h-[44px]">
          <Download className="w-4 h-4" /> {tr.export}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center gap-3">
          <FolderOpen className="w-8 h-8 text-cyan-300" />
          <div>
            <p className="text-2xl font-bold text-white">{actifs.length}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{tr.dossiersActifs}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <FileWarning className="w-8 h-8 text-amber-300" />
          <div>
            <p className="text-2xl font-bold text-white">{piecesAValider}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{tr.piecesAValider}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-emerald-300" />
          <div>
            <p className="text-2xl font-bold text-white">{messagesNonLus}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{tr.messagesNonLus}</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-4 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={tr.search}
            className={`${GLASS_INPUT_CLASSES} pl-10`}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        <select value={filtreEtape} onChange={(e) => setFiltreEtape(e.target.value)} className={`${GLASS_INPUT_CLASSES} lg:w-52`}>
          <option value="tous">{tr.tousEtapes}</option>
          {config.etapes.map((e) => (
            <option key={e.id} value={e.id}>{e.titre}</option>
          ))}
        </select>
        <select value={filtreProfil} onChange={(e) => setFiltreProfil(e.target.value)} className={`${GLASS_INPUT_CLASSES} lg:w-52`}>
          <option value="tous">{tr.tousProfils}</option>
          {PROFILS.map((p) => (
            <option key={p.id} value={p.id}>{p.nom}</option>
          ))}
        </select>
        <div className="flex rounded-[15px] border border-white/10 overflow-hidden">
          <button
            type="button"
            onClick={() => setAfficherArchives(false)}
            className={`px-4 py-3 text-sm font-medium ${!afficherArchives ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            {tr.actifs}
          </button>
          <button
            type="button"
            onClick={() => setAfficherArchives(true)}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-1.5 ${afficherArchives ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <Archive className="w-3.5 h-3.5" /> {tr.archives}
          </button>
        </div>
      </GlassCard>

      {loading ? (
        <p className="text-slate-400 text-center py-12">{tr.chargement}</p>
      ) : filtres.length === 0 ? (
        <p className="text-slate-500 text-center py-12 italic">{tr.aucun}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtres.map((d) => {
            const pct = avancement(d, config.pieces);
            const etape = config.etapes.find((e) => e.id === d.etape);
            const profil = PROFILS.find((p) => p.id === d.profil)?.nom ?? d.profil;
            return (
              <GlassCard key={d.id} className="p-6 cursor-pointer" hoverEffect onClick={() => onSelect(d.id)}>
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-xl font-bold text-white">{d.nom || d.courriel}</h3>
                      {!!d.nonLusAdmin && (
                        <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                          {d.nonLusAdmin}
                        </span>
                      )}
                    </div>
                    <p className="text-cyan-300/80 text-sm">{profil}</p>
                    {d.projet?.titre && <p className="text-slate-400 text-sm line-clamp-1 mt-1">{d.projet.titre}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 sm:items-center text-sm text-slate-400">
                    <div>
                      <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">{etape ? tr.avancement : ''}</span>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium border border-white/15 text-slate-300 mb-1.5">
                        {etape?.titre ?? d.etape}
                      </span>
                      <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-iridescent" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 uppercase tracking-wider">{tr.activite}</span>
                      {dateCourte(d.derniereActiviteClient) || '—'}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListeDossiers;
