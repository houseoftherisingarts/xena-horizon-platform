// Studio social : trois colonnes (formats et gabarits, toile, propriétés), une bande de légende et
// d'export en bas. Les gabarits et la toile partagent le même moteur de calques (lib/studio,
// components/admin/studio) : ce qu'on voit dans une vignette est ce que « Utiliser » applique.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Move, Sparkles, Upload, X } from 'lucide-react';
import { EnTete, Panneau, Bouton } from '../components/admin/ui';
import { FormatsPanel } from '../components/admin/studio/FormatsPanel';
import { PropertiesPanel } from '../components/admin/studio/PropertiesPanel';
import { LegendBar } from '../components/admin/studio/LegendBar';
import { Toile } from '../components/admin/studio/Toile';
import {
  FORMATS,
  formatParId,
  IMAGES_PUBLIQUES,
  nouveauTexte,
  nouvelleImage,
  nouvelleForme,
} from '../lib/studio/types';
import type { Calque, Fond, FormeType, Reseau } from '../lib/studio/types';
import { GABARITS, gabaritBaladoAvecEpisode } from '../lib/studio/gabarits';
import { telechargerToile, copierTexte } from '../lib/studio/export';
import { GalleryImage, Language } from '../types';
import { useCollection } from '../lib/firestore';

interface SocialCreatorProps {
  lang: Language;
}

type Onglet = 'formats' | 'toile' | 'proprietes';

const SocialCreator: React.FC<SocialCreatorProps> = ({ lang }) => {
  const { data: gallery } = useCollection<GalleryImage>('gallery');

  const [formatId, setFormatId] = useState<Reseau>('carre');
  const format = formatParId(formatId);
  const [fond, setFond] = useState<Fond>({ src: '/images/laurie-portrait-nb.jpg', nb: true, luminositePct: 65 });
  const [calques, setCalques] = useState<Calque[]>([nouveauTexte({ texte: 'Votre message inspirant', taillePct: 6.5 }), nouveauTexte({ texte: '@xenahorizon', yPct: 72, taillePct: 3, ombre: false })]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [onglet, setOnglet] = useState<Onglet>('toile');
  const [legende, setLegende] = useState('');
  const [motsClics, setMotsClics] = useState('');
  const [copie, setCopie] = useState(false);
  const [exportEnCours, setExportEnCours] = useState(false);
  const [choixFond, setChoixFond] = useState(false);

  const [episodeBalado, setEpisodeBalado] = useState<string | null>(null);
  useEffect(() => {
    fetch('/balado.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((flux) => setEpisodeBalado(flux?.episodes?.[0]?.titre ?? null))
      .catch(() => setEpisodeBalado(null));
  }, []);

  // Nano Banana : le bouton reste la promesse déjà en place, aucune clé côté client (voir CLAUDE.md).
  const [isNanoOpen, setIsNanoOpen] = useState(false);
  const [nanoPrompt, setNanoPrompt] = useState('');
  const [nanoRefPreview, setNanoRefPreview] = useState<string | null>(null);
  const nanoFileInputRef = useRef<HTMLInputElement>(null);

  const toileRef = useRef<HTMLDivElement | null>(null);
  const calque = calques.find((c) => c.id === selectedId) ?? null;
  const images = useMemo(() => [...IMAGES_PUBLIQUES, ...gallery.map((g) => g.url)], [gallery]);
  const gabaritsAffiches = useMemo(
    () => GABARITS.map((g) => (g.id === 'balado' ? gabaritBaladoAvecEpisode(episodeBalado ?? (lang === 'FR' ? 'Le dernier épisode' : 'The latest episode')) : g)),
    [episodeBalado, lang]
  );

  const t = {
    FR: {
      title: 'Créateur de contenu',
      subtitle: 'Gabarits, calques et export pour vos visuels de réseaux sociaux.',
      format: 'Format', gabarits: 'Gabarits', use: 'Utiliser',
      onglets: { formats: 'Gabarits', toile: 'Toile', proprietes: 'Propriétés' },
      ajouter: 'Ajouter', texte: 'Texte', image: 'Image', forme: 'Forme',
      proprietes: 'Propriétés du calque', contenu: 'Texte', police: 'Police', taille: 'Taille',
      graisse: 'Graisse', couleur: 'Couleur', ombre: 'Ombre douce', align: 'Alignement',
      nb: 'Noir et blanc', opacite: 'Opacité', filet: 'Filet seulement',
      supprimer: 'Supprimer', dupliquer: 'Dupliquer', kit: 'Kit de marque', kitLogo: 'Ajouter le logo',
      aucunCalque: 'Sélectionnez un calque sur la toile, ou ajoutez-en un ci-dessus.',
      choisirImage: 'Utiliser cette image',
      legende: 'Légende', motsClics: 'Mots-clics', signes: 'signes',
      exporter: 'Exporter en PNG', exportEnCours: 'Export…', copier: 'Copier la légende', copie: 'Copiée',
      hint: 'Glissez, redimensionnez par les coins, flèches pour ajuster, Suppr pour retirer, Ctrl/Cmd+D pour dupliquer.',
      fondTitre: 'Fond', fondNb: 'Noir et blanc', fondLuminosite: 'Luminosité', fondImage: 'Changer l’image',
      nano: 'Nano Banana', nanoTitle: 'Génération IA (Nano Banana)', nanoPlaceholder: "Décrivez l'image de fond idéale...",
      generate: 'Générer', soon: 'La génération par IA arrive bientôt : elle passera par le serveur pour protéger la clé.',
      uploadRef: 'Ajouter une image de référence (optionnel)', remove: 'Retirer',
    },
    EN: {
      title: 'Content creator',
      subtitle: 'Templates, layers and export for your social visuals.',
      format: 'Format', gabarits: 'Templates', use: 'Use',
      onglets: { formats: 'Templates', toile: 'Canvas', proprietes: 'Properties' },
      ajouter: 'Add', texte: 'Text', image: 'Image', forme: 'Shape',
      proprietes: 'Layer properties', contenu: 'Text', police: 'Font', taille: 'Size',
      graisse: 'Weight', couleur: 'Color', ombre: 'Soft shadow', align: 'Alignment',
      nb: 'Black and white', opacite: 'Opacity', filet: 'Outline only',
      supprimer: 'Delete', dupliquer: 'Duplicate', kit: 'Brand kit', kitLogo: 'Add logo',
      aucunCalque: 'Select a layer on the canvas, or add one above.',
      choisirImage: 'Use this image',
      legende: 'Caption', motsClics: 'Hashtags', signes: 'characters',
      exporter: 'Export as PNG', exportEnCours: 'Exporting…', copier: 'Copy caption', copie: 'Copied',
      hint: 'Drag to move, corner handles to resize, arrows to nudge, Delete to remove, Ctrl/Cmd+D to duplicate.',
      fondTitre: 'Background', fondNb: 'Black and white', fondLuminosite: 'Brightness', fondImage: 'Change image',
      nano: 'Nano Banana', nanoTitle: 'AI generation (Nano Banana)', nanoPlaceholder: 'Describe the ideal background image...',
      generate: 'Generate', soon: 'AI generation is coming soon: it will go through the server to protect the key.',
      uploadRef: 'Add reference image (optional)', remove: 'Remove',
    },
  }[lang];

  const majCalque = (patch: Partial<Calque>) => {
    if (!selectedId) return;
    setCalques((cs) => cs.map((c) => (c.id === selectedId ? ({ ...c, ...patch } as Calque) : c)));
  };
  const supprimerCalque = () => {
    setCalques((cs) => cs.filter((c) => c.id !== selectedId));
    setSelectedId(null);
  };
  const dupliquerCalque = () => {
    if (!calque) return;
    const copie2: Calque = { ...calque, id: `${calque.id}-${Date.now().toString(36)}`, xPct: Math.min(96, calque.xPct + 3), yPct: Math.min(96, calque.yPct + 3) };
    setCalques((cs) => [...cs, copie2]);
    setSelectedId(copie2.id);
  };
  const ajouterTexte = () => {
    const c = nouveauTexte({ z: calques.length + 1 });
    setCalques((cs) => [...cs, c]);
    setSelectedId(c.id);
    setOnglet('toile');
  };
  const ajouterImage = (src: string) => {
    const c = nouvelleImage(src, { z: calques.length + 1 });
    setCalques((cs) => [...cs, c]);
    setSelectedId(c.id);
  };
  const ajouterForme = (forme: FormeType) => {
    const c = nouvelleForme(forme, { z: calques.length + 1 });
    setCalques((cs) => [...cs, c]);
    setSelectedId(c.id);
  };

  const choisirGabarit = (g: (typeof gabaritsAffiches)[number]) => {
    setFormatId(g.format);
    setFond(g.fond);
    setCalques(g.calques.map((c, i) => ({ ...c, id: `${c.id}-${Date.now().toString(36)}${i}` })));
    setSelectedId(null);
    setOnglet('toile');
  };

  const exporter = async () => {
    if (!toileRef.current) return;
    setExportEnCours(true);
    setSelectedId(null);
    // Un cycle de rendu pour que les poignées de sélection disparaissent avant la capture.
    await new Promise((r) => setTimeout(r, 60));
    try {
      await telechargerToile(toileRef.current, format);
    } finally {
      setExportEnCours(false);
    }
  };

  const copier = async () => {
    const texte = motsClics ? `${legende}\n\n${motsClics}` : legende;
    if (await copierTexte(texte)) {
      setCopie(true);
      setTimeout(() => setCopie(false), 1800);
    }
  };

  const handleNanoImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setNanoRefPreview(URL.createObjectURL(e.target.files[0]));
  };

  const ongletBtn = (id: Onglet, label: string) => (
    <button
      type="button"
      onClick={() => setOnglet(id)}
      className={`flex-1 py-2 rounded-champ text-xs font-semibold transition-colors ${onglet === id ? 'bg-bouton text-sur-bouton' : 'text-gris'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="px-6 md:px-10 py-10 space-y-6">
      <EnTete titre={t.title} lede={t.subtitle} />

      <div className="lg:hidden flex gap-1 bg-papier-2 border border-filet rounded-champ p-1">
        {ongletBtn('formats', t.onglets.formats)}
        {ongletBtn('toile', t.onglets.toile)}
        {ongletBtn('proprietes', t.onglets.proprietes)}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className={`w-full lg:w-1/4 lg:max-h-[80vh] lg:overflow-y-auto lg:pr-1 ${onglet === 'formats' ? 'block' : 'hidden'} lg:block`}>
          <FormatsPanel formats={FORMATS} format={format} onFormat={(f) => setFormatId(f.id)} gabarits={gabaritsAffiches} onGabarit={choisirGabarit} lang={lang} t={t} />
        </div>

        <div className={`w-full lg:w-2/4 flex flex-col items-center gap-4 ${onglet === 'toile' ? 'flex' : 'hidden'} lg:flex`}>
          <Panneau titre={t.fondTitre} className="w-full">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-encre font-medium cursor-pointer">
                <input type="checkbox" checked={fond.nb} onChange={(e) => setFond({ ...fond, nb: e.target.checked })} className="w-4 h-4 accent-rose" />
                {t.fondNb}
              </label>
              <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                <span className="text-xs text-gris flex-shrink-0">{t.fondLuminosite}</span>
                <input type="range" min={30} max={100} value={fond.luminositePct} onChange={(e) => setFond({ ...fond, luminositePct: parseInt(e.target.value, 10) })} className="w-full accent-rose" />
              </div>
              <Bouton variante="secondaire" petit onClick={() => setChoixFond((v) => !v)}>{t.fondImage}</Bouton>
              <Bouton variante="danger" petit icone={Sparkles} onClick={() => setIsNanoOpen(true)}>{t.nano}</Bouton>
            </div>
            {choixFond && (
              <div className="mt-3 grid grid-cols-6 gap-2">
                {images.map((src) => (
                  <button key={src} type="button" onClick={() => { setFond({ ...fond, src }); setChoixFond(false); }} className={`aspect-square rounded-champ overflow-hidden border ${fond.src === src ? 'border-rose' : 'border-filet hover:border-encre'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Panneau>

          <Toile
            ref={toileRef}
            format={format}
            fond={fond}
            calques={calques}
            editable
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={setCalques}
            maquetteTelephone={format.id === 'story'}
            className="w-full max-w-[560px] rounded-champ border border-filet"
          />
          <p className="text-gris text-sm flex items-center gap-2 text-center">
            <Move className="w-4 h-4 flex-shrink-0" /> {t.hint}
          </p>
        </div>

        <div className={`w-full lg:w-1/4 lg:max-h-[80vh] lg:overflow-y-auto lg:pl-1 ${onglet === 'proprietes' ? 'block' : 'hidden'} lg:block`}>
          <PropertiesPanel calque={calque} onChange={majCalque} onDelete={supprimerCalque} onDuplicate={dupliquerCalque} onAddTexte={ajouterTexte} onAddImage={ajouterImage} onAddForme={ajouterForme} images={images} t={t} />
        </div>
      </div>

      <LegendBar legende={legende} onLegende={setLegende} motsClics={motsClics} onMotsClics={setMotsClics} onExporter={exporter} exportEnCours={exportEnCours} onCopier={copier} copie={copie} t={t} />

      {isNanoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
          <div className="bg-papier-2 border border-filet rounded-champ shadow-panneau w-full max-w-md">
            <div className="p-6 border-b border-filet flex justify-between items-center">
              <h2 className="font-serif text-h3 text-encre flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose" /> {t.nanoTitle}
              </h2>
              <button type="button" onClick={() => setIsNanoOpen(false)} className="text-gris hover:text-encre" aria-label={t.remove}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div
                onClick={() => nanoFileInputRef.current?.click()}
                className={`relative w-full h-32 rounded-champ border border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${nanoRefPreview ? 'border-rose/50 bg-papier' : 'border-filet hover:border-encre'}`}
              >
                {nanoRefPreview ? (
                  <>
                    <img src={nanoRefPreview} alt="Référence" className="h-full w-full object-contain opacity-60" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setNanoRefPreview(null); if (nanoFileInputRef.current) nanoFileInputRef.current.value = ''; }}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-papier-2 border border-filet text-encre rounded-pilule"
                      title={t.remove}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gris">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-xs">{t.uploadRef}</span>
                  </div>
                )}
                <input type="file" ref={nanoFileInputRef} onChange={handleNanoImageSelect} className="hidden" accept="image/*" />
              </div>
              <textarea
                className="w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose h-32 resize-none"
                placeholder={t.nanoPlaceholder}
                value={nanoPrompt}
                onChange={(e) => setNanoPrompt(e.target.value)}
              />
              <Bouton variante="secondaire" icone={Sparkles} disabled className="w-full">{t.generate}</Bouton>
              <p className="text-xs text-gris text-center">{t.soon}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialCreator;
