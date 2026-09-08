// Le composeur : plein écran, la lettre s'écrit comme elle sera lue. Chaque texte se modifie au clic,
// chaque image se remplace au clic. Sauvegarde automatique cinq secondes après le dernier changement,
// une version gardée par heure d'écriture (plus une avant toute restauration). Port du composeur de
// Krystine (2e génération, 7 septembre 2026) : Iris, la lettre d'or, la traduction et Terminal ne sont
// pas repris ici (hors périmètre de Xena). ponytail: réordonner par flèches seulement, pas de glisser-
// déposer, à ajouter si Laurie écrit des lettres longues et que ça devient pénible.
import React, { useEffect, useRef, useState } from 'react';
import { orderBy, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ArrowLeft, X, Save, Send, Eye, SlidersHorizontal, Clock, RotateCcw, Mail, Upload, Copy } from 'lucide-react';
import { app } from '../../../firebase';
import type { Language, GalleryImage } from '../../../types';
import { useCollection, createDoc, patchDoc, readDoc, uploadFile, makeStoragePath } from '../../../lib/firestore';
import {
  FONDS_INFOLETTRE, estSombre, BRAND,
  type NewsletterBlock, type BlockType, type NewsletterDoc, type NewsletterVersion, type NewsletterAudience,
  type BandeauInfolettre,
} from '../../../lib/infolettre/renderer';
import { renderEmailHtml } from '../../../lib/infolettre/email';
import { COORDONNEES } from '../../../lib/contenu';
import { BlockFrame, InsertPoint, BLOCK_PALETTE } from './BlockFrame';
import Audience from './Audience';
import Apercu from './Apercu';
import { Bouton } from '../ui';
import { useTextes } from '../../../lib/textes';

interface Props { id: string | null; onBack: () => void; lang: Language }

const AUDIENCE_DEFAUT: NewsletterAudience = { mode: 'tous', tags: [], ids: [], langue: 'auto' };
const FOND_DEFAUT = FONDS_INFOLETTRE[1].hex; // papier chaud

const TEXTES = {
  FR: {
    retour: 'Retour', brouillon: 'Brouillon', envoyee: 'Envoyée',
    historique: 'Historique', fermerHistorique: 'Fermer l’historique',
    apercu: 'Aperçu du courriel', reglages: 'Réglages',
    copier: 'Copier le HTML', copie: 'HTML copié dans le presse-papiers.',
    testLaurie: 'Test à Laurie', testAutre: 'Test à une autre adresse',
    enregistrer: 'Enregistrer', creer: 'Créer le brouillon', enregistrement: 'Enregistrement…',
    envoyer: 'Envoyer', envoiEnCours: 'Envoi…', dupliquer: 'Dupliquer',
    sujetRequis: 'Le sujet est requis.', blocRequis: 'Ajoutez au moins un bloc avant d’envoyer.',
    fonctionAbsente: 'L’envoi demande la fonction serveur (projet Firebase sur Blaze et clé Resend), pas encore activée. La lettre reste en brouillon.',
    confirmEnvoi: 'Envoyer cette infolettre maintenant à {qui} ? Cette action est irréversible.',
    promptTest: 'Adresse courriel pour le test :',
    testEnvoye: 'Test envoyé à {e}.',
    envoyeeA: 'Envoyée à {n} personne(s).',
    ajouterBloc: 'Ajouter un bloc',
    vide: 'Ajoutez un premier bloc ci-dessous, puis cliquez sur un texte pour l’écrire.',
    sujetPlaceholder: 'Cliquez ici pour écrire le sujet…',
    preheaderPlaceholder: 'Pré-en-tête : quelques mots vus dans la boîte de réception…',
    langueLettre: 'Langue de la lettre',
    fondTitre: 'Fond de la lettre',
    bandeauTitre: 'Le bandeau', bandeauAide: 'La bande au-dessus du sujet.', bandeauFond: 'Fond', bandeauTexte: 'Sujet', bandeauMasquer: 'Sans bandeau',
    audienceTitre: 'À qui l’envoyer', audienceVide: 'Cochez au moins une liste, ou choisissez « Tout le monde ».',
    versionsTitre: 'Versions gardées', versionsVide: 'Aucune version encore.',
    restaurer: 'Restaurer', confirmRestaurer: 'Revenir à cette version ? La version actuelle est gardée dans l’historique.',
    choisirImage: 'Choisir dans la galerie', televerser: 'Téléverser', fermer: 'Fermer',
    galerieVide: 'Aucune image dans la galerie. Téléversez-en une.',
    monter: 'Monter', descendre: 'Descendre', supprimerBloc: 'Supprimer ce bloc',
    niveauGrand: 'Grand titre', niveauTitre: 'Titre', niveauSousTitre: 'Sous-titre',
    aligner: 'Centrer / aligner à gauche', lien: 'Lien sur la sélection',
    styleBouton: 'Plein', styleContour: 'Contour', numero: 'Numéros', puce: 'Puces',
    petit: 'Petit', moyen: 'Moyen', grand: 'Grand',
  },
  EN: {
    retour: 'Back', brouillon: 'Draft', envoyee: 'Sent',
    historique: 'History', fermerHistorique: 'Close history',
    apercu: 'Email preview', reglages: 'Settings',
    copier: 'Copy HTML', copie: 'HTML copied to clipboard.',
    testLaurie: 'Test to Laurie', testAutre: 'Test to another address',
    enregistrer: 'Save', creer: 'Create draft', enregistrement: 'Saving…',
    envoyer: 'Send', envoiEnCours: 'Sending…', dupliquer: 'Duplicate',
    sujetRequis: 'Subject is required.', blocRequis: 'Add at least one block before sending.',
    fonctionAbsente: 'Sending requires the server function (Firebase project on Blaze plan and a Resend key), not yet activated. The letter stays a draft.',
    confirmEnvoi: 'Send this newsletter now to {qui}? This is irreversible.',
    promptTest: 'Email address for the test:',
    testEnvoye: 'Test sent to {e}.',
    envoyeeA: 'Sent to {n} people.',
    ajouterBloc: 'Add a block',
    vide: 'Add a first block below, then click a text to write it.',
    sujetPlaceholder: 'Click here to write the subject…',
    preheaderPlaceholder: 'Preheader: a few words seen in the inbox…',
    langueLettre: 'Letter language',
    fondTitre: 'Letter background',
    bandeauTitre: 'The banner', bandeauAide: 'The strip above the subject.', bandeauFond: 'Background', bandeauTexte: 'Subject', bandeauMasquer: 'No banner',
    audienceTitre: 'Who receives it', audienceVide: 'Check at least one list, or choose “Everyone”.',
    versionsTitre: 'Saved versions', versionsVide: 'No version yet.',
    restaurer: 'Restore', confirmRestaurer: 'Go back to this version? The current one is kept in the history.',
    choisirImage: 'Choose from the gallery', televerser: 'Upload', fermer: 'Close',
    galerieVide: 'No image in the gallery yet. Upload one.',
    monter: 'Move up', descendre: 'Move down', supprimerBloc: 'Delete this block',
    niveauGrand: 'Large title', niveauTitre: 'Title', niveauSousTitre: 'Subtitle',
    aligner: 'Center / left-align', lien: 'Link on selection',
    styleBouton: 'Solid', styleContour: 'Outline', numero: 'Numbered', puce: 'Bulleted',
    petit: 'Small', moyen: 'Medium', grand: 'Large',
  },
};

const Composer: React.FC<Props> = ({ id, onBack, lang }) => {
  const t = useTextes('adminInfolettre_composer', TEXTES, lang);
  const [loading, setLoading] = useState(id !== null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [docId, setDocId] = useState<string | null>(id);
  const [statut, setStatut] = useState<'brouillon' | 'envoyee'>('brouillon');

  const [sujet, setSujet] = useState('');
  const [preheader, setPreheader] = useState('');
  const [blocs, setBlocs] = useState<NewsletterBlock[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [audience, setAudience] = useState<NewsletterAudience>(AUDIENCE_DEFAUT);
  const [fond, setFond] = useState<string>(FOND_DEFAUT);
  const [bandeau, setBandeau] = useState<BandeauInfolettre>({});
  const [letterLang, setLetterLang] = useState<'fr' | 'en'>('fr');
  const [versionAt, setVersionAt] = useState(0);

  const [side, setSide] = useState<'reglages' | 'apercu' | 'versions'>('reglages');
  const [pickFor, setPickFor] = useState<number | null>(null);
  const [sendBusy, setSendBusy] = useState<'idle' | 'test' | 'live'>('idle');
  const [sendErr, setSendErr] = useState<string | null>(null);
  const [sendInfo, setSendInfo] = useState<string | null>(null);

  const isReadOnly = statut === 'envoyee';
  const sombre = estSombre(fond);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    readDoc<NewsletterDoc>(`newsletters/${id}`).then((n) => {
      if (!n) { onBack(); return; }
      setSujet(n.sujet || ''); setPreheader(n.preheader || ''); setBlocs(n.blocs || []);
      setStatut(n.statut || 'brouillon'); setAudience(n.audience || AUDIENCE_DEFAUT);
      setFond(n.fond || FOND_DEFAUT); setBandeau(n.bandeau || {}); setLetterLang(n.lang === 'en' ? 'en' : 'fr');
      setVersionAt(n.versionAt ? (typeof n.versionAt === 'number' ? n.versionAt : n.versionAt.toMillis()) : 0);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addBlock = (type: BlockType, at: number = blocs.length) => {
    if (isReadOnly) return;
    const gabarit = BLOCK_PALETTE.find((b) => b.type === type)?.gabarit();
    if (!gabarit) return;
    setBlocs((prev) => [...prev.slice(0, at), gabarit, ...prev.slice(at)]);
    setSelectedIdx(at);
    if (type === 'image') setPickFor(at);
  };
  const dupliquerBloc = (idx: number) => setBlocs((prev) => [...prev.slice(0, idx + 1), JSON.parse(JSON.stringify(prev[idx])), ...prev.slice(idx + 1)]);
  const updateBloc = (idx: number, patch: Record<string, any>) => setBlocs((prev) => prev.map((b, i) => (i === idx ? { ...b, content: { ...(b.content || {}), ...patch } } : b)));
  const deplacerBloc = (idx: number, dir: -1 | 1) => setBlocs((prev) => { const n = prev.slice(); const j = idx + dir; if (j < 0 || j >= n.length) return prev; [n[idx], n[j]] = [n[j], n[idx]]; return n; });
  const retirerBloc = (idx: number) => { setBlocs((prev) => prev.filter((_, i) => i !== idx)); setSelectedIdx(null); };

  const etat = JSON.stringify({ sujet, preheader, blocs, audience, fond, bandeau, letterLang });
  const etatSauve = useRef<string | null>(null);
  useEffect(() => { if (!loading && etatSauve.current === null) etatSauve.current = etat; }, [loading, etat]);

  const contenuVersion = () => ({ sujet, preheader, blocs, lang: letterLang, fond, bandeau });

  const save = async (): Promise<string | null> => {
    if (isReadOnly) return docId;
    if (!sujet.trim()) return null;
    setSaving(true);
    const etatDepart = etat;
    try {
      const payload = { sujet, preheader, blocs, lang: letterLang, audience, fond, bandeau, updatedAt: serverTimestamp() };
      let savedId = docId;
      if (docId) {
        await patchDoc('newsletters', docId, payload);
      } else {
        savedId = await createDoc('newsletters', { ...payload, statut: 'brouillon' });
        setDocId(savedId);
      }
      etatSauve.current = etatDepart;
      setSavedAt(new Date());
      if (savedId && Date.now() - versionAt > 3600e3) {
        try { await createDoc(`newsletters/${savedId}/versions`, { ...contenuVersion(), savedAt: serverTimestamp(), raison: 'heure' }); setVersionAt(Date.now()); } catch { /* l'historique n'empêche jamais la sauvegarde */ }
      }
      return savedId;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (loading || saving || isReadOnly) return;
    if (etatSauve.current === null || etat === etatSauve.current) return;
    if (!sujet && !blocs.length) return;
    const tId = window.setTimeout(() => { save().catch(() => {}); }, 5000);
    return () => window.clearTimeout(tId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etat, loading, saving, isReadOnly]);

  const { data: versions } = useCollection<NewsletterVersion>(docId ? `newsletters/${docId}/versions` : 'newsletters/_/versions', [orderBy('savedAt', 'desc')]);

  const restaurer = async (v: NewsletterVersion) => {
    if (!docId || isReadOnly) return;
    if (!window.confirm(t.confirmRestaurer)) return;
    try { await createDoc(`newsletters/${docId}/versions`, { ...contenuVersion(), savedAt: serverTimestamp(), raison: 'restauration' }); setVersionAt(Date.now()); } catch { /* noop */ }
    setSujet(v.sujet || ''); setPreheader(v.preheader || ''); setBlocs(v.blocs || []);
    setLetterLang(v.lang === 'en' ? 'en' : 'fr'); setFond(v.fond || FOND_DEFAUT); setBandeau(v.bandeau || {});
    setSelectedIdx(null);
  };

  const messageEchec = (e: any): string => {
    const code = e?.code || '';
    if (code.startsWith('functions/') || /fetch|network|offline/i.test(String(e?.message || ''))) return t.fonctionAbsente;
    return e?.message || t.fonctionAbsente;
  };

  const triggerSend = async (testEmail?: string) => {
    setSendErr(null); setSendInfo(null);
    if (!sujet.trim()) { setSendErr(t.sujetRequis); return; }
    if (!blocs.length) { setSendErr(t.blocRequis); return; }
    setSendBusy(testEmail ? 'test' : 'live');
    try {
      const savedId = await save();
      if (!savedId) throw new Error(t.sujetRequis);
      const fns = getFunctions(app, 'northamerica-northeast1');
      const call = httpsCallable(fns, 'envoyerInfolettre');
      const res: any = await call({ id: savedId, test: testEmail });
      const data = res.data || {};
      if (testEmail) {
        setSendInfo(t.testEnvoye.replace('{e}', testEmail));
      } else {
        setStatut('envoyee');
        await patchDoc('newsletters', savedId, { statut: 'envoyee', sentAt: serverTimestamp(), envoi: data });
        setSendInfo(t.envoyeeA.replace('{n}', String(data.total ?? data.envoyes ?? 0)));
      }
    } catch (e: any) {
      setSendErr(messageEchec(e));
    } finally {
      setSendBusy('idle');
    }
  };

  const sendTest = async () => {
    const email = window.prompt(t.promptTest);
    if (!email) return;
    await triggerSend(email);
  };

  const audienceLibelle = audience.mode === 'tous' ? (lang === 'FR' ? 'tout le monde' : 'everyone') : audience.mode === 'tags' ? `${audience.tags.length} liste(s)` : `${audience.ids.length} personne(s)`;
  const audienceVide = (audience.mode === 'tags' && audience.tags.length === 0) || (audience.mode === 'choix' && audience.ids.length === 0);
  const sendLive = async () => {
    if (audienceVide) { setSendErr(t.audienceVide); return; }
    if (!window.confirm(t.confirmEnvoi.replace('{qui}', audienceLibelle))) return;
    await triggerSend();
  };

  const copierHtml = async () => {
    const html = renderEmailHtml(blocs, { subject: sujet, preheader, unsubscribeUrl: '#', postalAddress: '', fond, bandeau });
    await navigator.clipboard.writeText(html);
    setSendInfo(t.copie);
  };

  const dupliquer = async () => {
    const nouvId = await createDoc('newsletters', { sujet, preheader, blocs, lang: letterLang, audience, fond, bandeau, statut: 'brouillon' });
    setDocId(nouvId); setStatut('brouillon'); setSavedAt(null); setVersionAt(0);
    etatSauve.current = null;
  };

  const { data: gallery } = useCollection<GalleryImage>('gallery');
  const [uploadBusy, setUploadBusy] = useState(false);
  const uploaderImage = async (file: File) => {
    setUploadBusy(true);
    try {
      const path = makeStoragePath('gallery', file.name);
      const { url } = await uploadFile(path, file);
      await createDoc('gallery', { url, name: file.name, date: new Date().toISOString().slice(0, 10), storagePath: path });
    } finally {
      setUploadBusy(false);
    }
  };

  if (loading) return <div className="px-6 md:px-10 py-16 text-center text-gris">…</div>;

  return (
    <div data-tx-scope="adminInfolettre_composer" className="fixed inset-0 z-50 flex flex-col bg-papier overflow-y-auto">
      <style>{`.nl-inline{outline:none;cursor:text;min-width:2ch;border-radius:4px;transition:box-shadow .15s}.nl-inline:hover{box-shadow:0 0 0 2px rgb(var(--c-rose)/0.3)}.nl-inline:focus{box-shadow:0 0 0 2px rgb(var(--c-rose)/0.6)}.nl-inline:empty:before{content:attr(data-placeholder);opacity:.4;pointer-events:none}`}</style>

      <div className="flex flex-wrap items-center gap-3 px-4 md:px-6 py-3 border-b border-filet bg-papier-2 shrink-0">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-gris hover:text-encre"><ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t.retour}</button>
        <span className={`kicker px-3 py-1 rounded-pilule ${statut === 'envoyee' ? 'bg-rose/10 text-rose' : 'border border-filet text-gris'}`}>{statut === 'envoyee' ? t.envoyee : t.brouillon}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {savedAt && !isReadOnly && <span className="text-xs text-gris">{saving ? t.enregistrement : savedAt.toLocaleTimeString(lang === 'FR' ? 'fr-CA' : 'en-CA', { hour: '2-digit', minute: '2-digit' })}</span>}
          <button type="button" onClick={() => setSide(side === 'versions' ? 'reglages' : 'versions')} className="p-2 rounded-champ text-gris hover:text-encre" title={side === 'versions' ? t.fermerHistorique : t.historique} aria-label={t.historique}><Clock className="w-4 h-4" aria-hidden="true" /></button>
          <button type="button" onClick={() => setSide(side === 'apercu' ? 'reglages' : 'apercu')} className="p-2 rounded-champ text-gris hover:text-encre" title={t.apercu} aria-label={t.apercu}>{side === 'apercu' ? <SlidersHorizontal className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}</button>
          <Bouton variante="discret" petit icone={Copy} onClick={copierHtml}>{t.copier}</Bouton>
          {isReadOnly ? (
            <Bouton variante="secondaire" petit icone={Copy} onClick={dupliquer}>{t.dupliquer}</Bouton>
          ) : (
            <>
              <Bouton variante="secondaire" petit icone={Save} onClick={() => save()} disabled={saving || !sujet.trim()}>{docId ? t.enregistrer : t.creer}</Bouton>
              <Bouton variante="discret" petit icone={Mail} onClick={() => triggerSend(COORDONNEES.courriel)} disabled={sendBusy !== 'idle' || !sujet.trim()}>{t.testLaurie}</Bouton>
              <Bouton variante="discret" petit icone={Send} onClick={sendTest} disabled={sendBusy !== 'idle' || !sujet.trim()}>{t.testAutre}</Bouton>
              <Bouton petit icone={Send} onClick={sendLive} disabled={sendBusy !== 'idle' || !sujet.trim() || !blocs.length || audienceVide}>{sendBusy === 'live' ? t.envoiEnCours : t.envoyer}</Bouton>
            </>
          )}
        </div>
      </div>
      {(sendErr || sendInfo) && <div className={`px-6 py-2.5 text-sm shrink-0 ${sendErr ? 'bg-rose/10 text-rose' : 'bg-papier-2 text-encre'}`}>{sendErr || sendInfo}</div>}

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 min-w-0" onClick={() => setSelectedIdx(null)}>
          <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8">
            <div className="w-full rounded-champ border border-filet overflow-hidden" style={{ background: fond }}>
              <div className="flex items-center gap-3 px-6 md:px-[8%] pt-5 pb-3" onClick={(e) => e.stopPropagation()}>
                <span className="kicker text-gris">{t.langueLettre}</span>
                <div className="inline-flex rounded-pilule border border-filet p-0.5">
                  {(['fr', 'en'] as const).map((l) => (
                    <button key={l} type="button" disabled={isReadOnly} onClick={() => setLetterLang(l)} className={`px-3 py-1 rounded-pilule text-xs font-semibold transition-colors ${letterLang === l ? 'bg-bouton text-sur-bouton' : 'text-gris hover:text-encre'}`}>{l === 'fr' ? 'FR' : 'EN'}</button>
                  ))}
                </div>
              </div>
              {!bandeau.masque && (
                <div className="px-6 md:px-[8%] pt-6 pb-6" style={{ backgroundColor: bandeau.fond || BRAND.ink }} onClick={(e) => e.stopPropagation()}>
                  <input value={bandeau.etiquette ?? ''} onChange={(e) => setBandeau((b) => ({ ...b, etiquette: e.target.value }))} disabled={isReadOnly}
                    placeholder={lang === 'FR' ? 'Infolettre' : 'Newsletter'} className="nl-inline w-full bg-transparent kicker" style={{ color: bandeau.texte || BRAND.accentSurEncre }} />
                  <input value={sujet} onChange={(e) => setSujet(e.target.value)} disabled={isReadOnly} placeholder={t.sujetPlaceholder}
                    style={{ color: bandeau.texte || BRAND.paper }} className="nl-inline w-full bg-transparent font-serif text-2xl md:text-3xl mt-3" />
                  <div className="mt-4 h-px w-12" style={{ background: bandeau.texte || BRAND.accentSurEncre }} />
                </div>
              )}
              <div className="px-6 md:px-[8%] pt-6 pb-5 border-b border-filet" onClick={(e) => e.stopPropagation()}>
                {bandeau.masque && (
                  <input value={sujet} onChange={(e) => setSujet(e.target.value)} disabled={isReadOnly} placeholder={t.sujetPlaceholder}
                    className="nl-inline w-full bg-transparent font-serif text-2xl md:text-3xl text-encre" />
                )}
                <input value={preheader} onChange={(e) => setPreheader(e.target.value)} disabled={isReadOnly} placeholder={t.preheaderPlaceholder}
                  className={`nl-inline w-full bg-transparent text-sm text-encre/60 ${bandeau.masque ? 'mt-2' : ''}`} />
              </div>

              <div className="px-6 md:px-[8%] py-8 min-h-[40vh]">
                {blocs.length === 0 && <p className="py-12 text-center text-encre/40 text-sm">{t.vide}</p>}
                {blocs.map((block, idx) => (
                  <React.Fragment key={idx}>
                    {!isReadOnly && <InsertPoint onAdd={(ty) => addBlock(ty, idx)} />}
                    <BlockFrame
                      block={block} selected={selectedIdx === idx} readOnly={isReadOnly} first={idx === 0} last={idx === blocs.length - 1}
                      t={t} onSelect={() => setSelectedIdx(idx)} onPatch={(p) => updateBloc(idx, p)}
                      onMove={(d) => deplacerBloc(idx, d)} onRemove={() => retirerBloc(idx)} onDuplicate={() => dupliquerBloc(idx)}
                      onPickImage={() => setPickFor(idx)}
                    />
                  </React.Fragment>
                ))}
                {!isReadOnly && (
                  <div className="mt-8 pt-6 border-t border-dashed border-filet" onClick={(e) => e.stopPropagation()}>
                    <p className="kicker text-gris mb-3">{t.ajouterBloc}</p>
                    <div className="flex flex-wrap gap-2">
                      {BLOCK_PALETTE.map((b) => (
                        <button key={b.type} type="button" onClick={() => addBlock(b.type)} className="inline-flex items-center gap-2 px-4 py-2 rounded-pilule border border-filet hover:border-rose text-xs font-medium text-encre transition-colors">
                          <b.icone className="w-3.5 h-3.5 text-rose" aria-hidden="true" /> {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <aside className={`shrink-0 border-t lg:border-t-0 lg:border-l border-filet bg-papier-2 overflow-y-auto ${side === 'apercu' ? 'lg:w-[560px]' : 'lg:w-[360px]'}`}>
          {side === 'apercu' ? (
            <div className="p-4"><Apercu blocs={blocs} sujet={sujet} preheader={preheader} fond={fond} bandeau={bandeau} lang={lang} /></div>
          ) : side === 'versions' ? (
            <div className="p-5 space-y-3">
              <p className="kicker text-gris">{t.versionsTitre}</p>
              {versions.length === 0 && <p className="text-sm text-gris">{t.versionsVide}</p>}
              <ul className="space-y-2">
                {versions.map((v) => (
                  <li key={v.id} className="border border-filet rounded-champ bg-papier px-4 py-3 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-encre truncate">{v.sujet || '·'}</p>
                      <p className="text-xs text-gris">{v.savedAt?.toDate?.().toLocaleString(lang === 'FR' ? 'fr-CA' : 'en-CA', { dateStyle: 'medium', timeStyle: 'short' }) || '…'}</p>
                    </div>
                    <button type="button" onClick={() => restaurer(v)} disabled={isReadOnly} aria-label={t.restaurer} className="p-2 rounded-champ text-gris hover:text-rose disabled:opacity-30"><RotateCcw className="w-4 h-4" aria-hidden="true" /></button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-5 space-y-6">
              {!isReadOnly && (
                <div>
                  <p className="kicker text-gris mb-2">{t.audienceTitre}</p>
                  <Audience value={audience} onChange={setAudience} disabled={isReadOnly} letterLang={letterLang} lang={lang} />
                </div>
              )}
              <div>
                <p className="kicker text-gris mb-2">{t.fondTitre}</p>
                <div className="flex flex-wrap gap-2">
                  {FONDS_INFOLETTRE.map((f) => (
                    <button key={f.hex} type="button" disabled={isReadOnly} title={f.label} onClick={() => setFond(f.hex)}
                      className={`w-8 h-8 rounded-pilule border-2 transition-transform ${fond.toUpperCase() === f.hex ? 'border-rose scale-110' : 'border-filet hover:scale-105'}`} style={{ background: f.hex }} aria-label={f.label} />
                  ))}
                </div>
                <p className="text-xs text-gris mt-2">{FONDS_INFOLETTRE.find((f) => f.hex === fond.toUpperCase())?.label || fond}{sombre ? ' · texte ivoire' : ''}</p>
              </div>
              <div className="space-y-3 pt-4 border-t border-filet">
                <p className="kicker text-gris">{t.bandeauTitre}</p>
                <p className="text-xs text-gris">{t.bandeauAide}</p>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 border border-filet rounded-champ px-3 py-2">
                    <input type="color" value={bandeau.fond || BRAND.ink} disabled={isReadOnly} onChange={(e) => setBandeau((b) => ({ ...b, fond: e.target.value }))} className="w-7 h-7 rounded-champ border-0 bg-transparent p-0 cursor-pointer" />
                    <span className="text-xs text-encre">{t.bandeauFond}</span>
                  </label>
                  <label className="flex items-center gap-2 border border-filet rounded-champ px-3 py-2">
                    <input type="color" value={bandeau.texte || BRAND.paper} disabled={isReadOnly} onChange={(e) => setBandeau((b) => ({ ...b, texte: e.target.value }))} className="w-7 h-7 rounded-champ border-0 bg-transparent p-0 cursor-pointer" />
                    <span className="text-xs text-encre">{t.bandeauTexte}</span>
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm text-encre">
                  <input type="checkbox" checked={!!bandeau.masque} disabled={isReadOnly} onChange={(e) => setBandeau((b) => ({ ...b, masque: e.target.checked }))} className="accent-rose" />
                  {t.bandeauMasquer}
                </label>
              </div>
            </div>
          )}
        </aside>
      </div>

      {pickFor !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-encre/60" onClick={() => setPickFor(null)}>
          <div className="bg-papier border border-filet rounded-champ w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-filet flex items-center justify-between">
              <p className="font-serif text-h3 text-encre">{t.choisirImage}</p>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-pilule border border-filet text-xs font-semibold text-encre cursor-pointer hover:border-rose">
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" /> {uploadBusy ? '…' : t.televerser}
                  <input type="file" accept="image/*" className="hidden" disabled={uploadBusy} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploaderImage(f); e.target.value = ''; }} />
                </label>
                <button type="button" onClick={() => setPickFor(null)} aria-label={t.fermer} className="p-2 rounded-champ text-gris hover:text-encre"><X className="w-5 h-5" aria-hidden="true" /></button>
              </div>
            </div>
            <div className="p-5 overflow-y-auto grid grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.length === 0 && <p className="col-span-full text-sm text-gris text-center py-8">{t.galerieVide}</p>}
              {gallery.map((img) => (
                <button key={img.id} type="button" onClick={() => { updateBloc(pickFor, { url: img.url }); setPickFor(null); }} className="aspect-square overflow-hidden border-2 border-transparent hover:border-rose transition-colors">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Composer;
