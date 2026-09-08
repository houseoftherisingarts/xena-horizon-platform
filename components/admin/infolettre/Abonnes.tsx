// Les abonnés de l'infolettre : liste, recherche, filtres, ajout manuel, import CSV collé, retrait,
// export CSV. La liste de Xena est petite : tout se lit et se filtre côté client, sans pagination.
import React, { useMemo, useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { Plus, Trash2, Download, Upload } from 'lucide-react';
import type { Language, Subscriber } from '../../../types';
import { useCollection, createDoc, removeDoc } from '../../../lib/firestore';
import { Panneau, Bouton, Champ, Selection, Zone, Etiquette, Vide, Chargement } from '../ui';
import { useTextes } from '../../../lib/textes';

const TEXTES = {
  FR: {
    titre: 'Abonnés',
    ajouter: 'Ajouter un abonné',
    email: 'Adresse courriel',
    nom: 'Nom',
    langue: 'Langue',
    tags: 'Listes (séparées par virgule)',
    ajouterBouton: 'Ajouter',
    annuler: 'Annuler',
    rechercher: 'Rechercher (courriel, nom, liste)…',
    statutTous: 'Tous les statuts',
    statutActifs: 'Actifs',
    statutDesabonnes: 'Désabonnés',
    langueToutes: 'Toutes les langues',
    importer: 'Importer un fichier CSV',
    importerAide: 'Une ligne par abonné : courriel;nom;langue (fr ou en). Collez le contenu ci-dessous.',
    importerBouton: 'Importer',
    importerResultat: (n: number, doublons: number, invalides: number) =>
      `${n} ajouté${n > 1 ? 's' : ''}, ${doublons} doublon${doublons > 1 ? 's' : ''} ignoré${doublons > 1 ? 's' : ''}, ${invalides} ligne${invalides > 1 ? 's' : ''} invalide${invalides > 1 ? 's' : ''}.`,
    exporter: 'Exporter CSV',
    vide: 'Aucun abonné pour l’instant.',
    chargement: 'Chargement…',
    colEmail: 'Courriel',
    colNom: 'Nom',
    colStatut: 'Statut',
    colLangue: 'Langue',
    retirer: 'Retirer',
    confirmRetirer: 'Retirer cet abonné ?',
    fermer: 'Fermer',
  },
  EN: {
    titre: 'Subscribers',
    ajouter: 'Add a subscriber',
    email: 'Email address',
    nom: 'Name',
    langue: 'Language',
    tags: 'Lists (comma-separated)',
    ajouterBouton: 'Add',
    annuler: 'Cancel',
    rechercher: 'Search (email, name, list)…',
    statutTous: 'All statuses',
    statutActifs: 'Active',
    statutDesabonnes: 'Unsubscribed',
    langueToutes: 'All languages',
    importer: 'Import a CSV file',
    importerAide: 'One line per subscriber: email;name;language (fr or en). Paste the content below.',
    importerBouton: 'Import',
    importerResultat: (n: number, doublons: number, invalides: number) => `${n} added, ${doublons} duplicate(s) skipped, ${invalides} invalid line(s).`,
    exporter: 'Export CSV',
    vide: 'No subscriber yet.',
    chargement: 'Loading…',
    colEmail: 'Email',
    colNom: 'Name',
    colStatut: 'Status',
    colLangue: 'Language',
    retirer: 'Remove',
    confirmRetirer: 'Remove this subscriber?',
    fermer: 'Close',
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function downloadCsv(filename: string, rows: Record<string, string>[]) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const escCell = (v: string) => (/[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const csv = [cols.join(';'), ...rows.map((r) => cols.map((c) => escCell(r[c] ?? '')).join(';'))].join('\n');
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const Abonnes: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useTextes('adminInfolettre_abonnes', TEXTES, lang);
  const { data: subs, loading } = useCollection<Subscriber>('subscribers', [orderBy('createdAt', 'desc')]);
  const [q, setQ] = useState('');
  const [statut, setStatut] = useState<'tous' | 'active' | 'unsubscribed'>('tous');
  const [langueF, setLangueF] = useState<'tous' | 'fr' | 'en'>('tous');
  const [modalAjout, setModalAjout] = useState(false);
  const [modalImport, setModalImport] = useState(false);
  const [csv, setCsv] = useState('');
  const [importResultat, setImportResultat] = useState<string | null>(null);
  const [nouv, setNouv] = useState({ email: '', name: '', lang: 'fr' as 'fr' | 'en', tags: '' });
  const [busy, setBusy] = useState(false);

  const filtres = useMemo(() => {
    const f = q.trim().toLowerCase();
    return subs.filter((s) => {
      if (statut !== 'tous' && s.status !== statut) return false;
      if (langueF !== 'tous' && (s.lang || 'fr') !== langueF) return false;
      if (!f) return true;
      return s.email.toLowerCase().includes(f) || (s.name || '').toLowerCase().includes(f) || (s.tags || []).some((tg) => tg.toLowerCase().includes(f));
    });
  }, [subs, q, statut, langueF]);

  const dejaLa = useMemo(() => new Set(subs.map((s) => s.email.toLowerCase())), [subs]);

  const ajouter = async () => {
    const email = nouv.email.trim();
    if (!EMAIL_RE.test(email)) return;
    setBusy(true);
    try {
      const tags = nouv.tags.split(',').map((x) => x.trim()).filter(Boolean);
      await createDoc<Partial<Subscriber>>('subscribers', { email, name: nouv.name.trim() || undefined, tags: tags.length ? tags : undefined, status: 'active', source: 'admin', lang: nouv.lang });
      setNouv({ email: '', name: '', lang: 'fr', tags: '' });
      setModalAjout(false);
    } finally {
      setBusy(false);
    }
  };

  const importer = async () => {
    setBusy(true);
    let ajoutes = 0, doublons = 0, invalides = 0;
    const vus = new Set(dejaLa);
    try {
      for (const ligneBrute of csv.split('\n')) {
        const ligne = ligneBrute.trim();
        if (!ligne) continue;
        const [email = '', name = '', langue = ''] = ligne.split(';').map((x) => x.trim());
        if (!EMAIL_RE.test(email)) { invalides++; continue; }
        const clef = email.toLowerCase();
        if (vus.has(clef)) { doublons++; continue; }
        vus.add(clef);
        await createDoc<Partial<Subscriber>>('subscribers', { email, name: name || undefined, status: 'active', source: 'import', lang: langue === 'en' ? 'en' : 'fr' });
        ajoutes++;
      }
      setImportResultat(t.importerResultat(ajoutes, doublons, invalides));
      setCsv('');
    } finally {
      setBusy(false);
    }
  };

  const retirer = async (s: Subscriber) => {
    if (!window.confirm(t.confirmRetirer)) return;
    await removeDoc('subscribers', s.id);
  };

  const exporter = () =>
    downloadCsv(`abonnes_${new Date().toISOString().slice(0, 10)}.csv`, filtres.map((s) => ({
      email: s.email, nom: s.name || '', langue: s.lang || 'fr', statut: s.status, tags: (s.tags || []).join(','), source: s.source || '',
    })));

  return (
    <div data-tx-scope="adminInfolettre_abonnes" className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.rechercher}
          className="flex-1 min-w-[220px] bg-papier border border-filet rounded-champ px-4 py-2.5 text-sm text-encre outline-none focus:border-rose" />
        <select value={statut} onChange={(e) => setStatut(e.target.value as any)} className="bg-papier border border-filet rounded-champ px-3 py-2.5 text-sm text-encre outline-none focus:border-rose">
          <option value="tous">{t.statutTous}</option>
          <option value="active">{t.statutActifs}</option>
          <option value="unsubscribed">{t.statutDesabonnes}</option>
        </select>
        <select value={langueF} onChange={(e) => setLangueF(e.target.value as any)} className="bg-papier border border-filet rounded-champ px-3 py-2.5 text-sm text-encre outline-none focus:border-rose">
          <option value="tous">{t.langueToutes}</option>
          <option value="fr">FR</option>
          <option value="en">EN</option>
        </select>
        <Bouton variante="secondaire" petit icone={Upload} onClick={() => setModalImport(true)}>{t.importer}</Bouton>
        <Bouton variante="secondaire" petit icone={Download} onClick={exporter}>{t.exporter}</Bouton>
        <Bouton petit icone={Plus} onClick={() => setModalAjout(true)}>{t.ajouter}</Bouton>
      </div>
      <p className="text-xs text-gris">{filtres.length} / {subs.length}</p>

      {loading ? (
        <Chargement texte={t.chargement} />
      ) : filtres.length === 0 ? (
        <Vide titre={t.vide} />
      ) : (
        <div className="border border-filet rounded-champ overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left kicker text-gris border-b border-filet">
                <th className="py-3 px-4">{t.colEmail}</th>
                <th className="py-3 px-4 hidden md:table-cell">{t.colNom}</th>
                <th className="py-3 px-4 hidden sm:table-cell">{t.colStatut}</th>
                <th className="py-3 px-4 hidden sm:table-cell">{t.colLangue}</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-filet">
              {filtres.map((s) => (
                <tr key={s.id} className="hover:bg-papier-2 transition-colors">
                  <td className="py-3 px-4 text-encre">{s.email}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-gris">{s.name || '—'}</td>
                  <td className="py-3 px-4 hidden sm:table-cell"><Etiquette tone={s.status === 'active' ? 'accent' : 'neutre'}>{s.status === 'active' ? t.statutActifs : t.statutDesabonnes}</Etiquette></td>
                  <td className="py-3 px-4 hidden sm:table-cell text-gris text-xs uppercase">{s.lang || 'fr'}</td>
                  <td className="py-3 px-4 text-right">
                    <button type="button" onClick={() => retirer(s)} aria-label={t.retirer} className="p-2 rounded-champ text-gris hover:text-rose transition-colors">
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAjout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
          <Panneau className="max-w-md w-full" titre={t.ajouter}>
            <div className="space-y-4">
              <Champ label={t.email} type="email" autoFocus value={nouv.email} onChange={(e) => setNouv({ ...nouv, email: e.target.value })} />
              <Champ label={t.nom} value={nouv.name} onChange={(e) => setNouv({ ...nouv, name: e.target.value })} />
              <Selection label={t.langue} value={nouv.lang} onChange={(e) => setNouv({ ...nouv, lang: e.target.value as 'fr' | 'en' })}>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </Selection>
              <Champ label={t.tags} value={nouv.tags} onChange={(e) => setNouv({ ...nouv, tags: e.target.value })} />
              <div className="flex justify-end gap-2 pt-2">
                <Bouton variante="discret" onClick={() => setModalAjout(false)}>{t.annuler}</Bouton>
                <Bouton onClick={ajouter} disabled={busy || !EMAIL_RE.test(nouv.email.trim())}>{t.ajouterBouton}</Bouton>
              </div>
            </div>
          </Panneau>
        </div>
      )}

      {modalImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
          <Panneau className="max-w-lg w-full" titre={t.importer}>
            <div className="space-y-3">
              <p className="text-sm text-gris">{t.importerAide}</p>
              <Zone label="CSV" value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="laurie@exemple.com;Laurie;fr" className="min-h-[10rem]" />
              {importResultat && <p className="text-xs text-rose">{importResultat}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <Bouton variante="discret" onClick={() => { setModalImport(false); setImportResultat(null); }}>{t.fermer}</Bouton>
                <Bouton onClick={importer} disabled={busy || !csv.trim()}>{t.importerBouton}</Bouton>
              </div>
            </div>
          </Panneau>
        </div>
      )}
    </div>
  );
};

export default Abonnes;
