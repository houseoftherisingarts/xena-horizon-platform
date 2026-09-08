// LecteurAudio — lecteur de témoignage audio réutilisable, porté du site de Philippe Dufresne
// (signature.html : .lect/.lect-b/.onde, lignes 481-500 et 4188-4217). Bouton rond, onde de barres
// qui n'ondulent que pendant la lecture, temps écoulé / durée, barre de progression cliquable.
// Un seul lecteur joue à la fois : le registre de module met les autres en pause.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Language } from '../types';

export interface LecteurAudioProps {
  src: string;
  nom: string;
  /** « temoignage » (défaut) ou « episode » : change seulement le libellé accessible. */
  genre?: 'temoignage' | 'episode';
  lang: Language;
  onLecture?: () => void;
  className?: string;
}

const NB_BARRES = 24;

// Le lecteur en cours, tous composants confondus : au démarrage d'un nouveau, celui-ci se met en pause.
let audioActif: HTMLAudioElement | null = null;

const mmss = (secondes: number): string => {
  const t = Math.max(0, Math.round(secondes || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

export const LecteurAudio: React.FC<LecteurAudioProps> = ({ src, nom, lang, onLecture, className = '', genre = 'temoignage' }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [joue, setJoue] = useState(false);
  const [ecoule, setEcoule] = useState(0);
  const [duree, setDuree] = useState(0);

  // Hauteur d'ondulation et délai de chaque barre : posés une fois au montage, jamais recalculés.
  const barres = useMemo(
    () =>
      Array.from({ length: NB_BARRES }, () => ({
        duree: (0.5 + Math.random() * 0.5).toFixed(2),
        delai: (Math.random() * 0.5).toFixed(2),
      })),
    []
  );

  useEffect(
    () => () => {
      const au = audioRef.current;
      if (!au) return;
      au.pause();
      if (audioActif === au) audioActif = null;
    },
    []
  );

  const obtenirAudio = (): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;
    const au = new Audio(src);
    au.preload = 'none';
    au.addEventListener('loadedmetadata', () => setDuree(au.duration || 0));
    au.addEventListener('timeupdate', () => setEcoule(au.currentTime));
    au.addEventListener('play', () => setJoue(true));
    au.addEventListener('pause', () => setJoue(false));
    au.addEventListener('ended', () => setEcoule(0));
    audioRef.current = au;
    return au;
  };

  const basculer = () => {
    const au = obtenirAudio();
    if (!au.paused) {
      au.pause();
      return;
    }
    if (audioActif && audioActif !== au) audioActif.pause();
    audioActif = au;
    au.play().catch(() => setJoue(false));
    onLecture?.();
  };

  const chercher = (e: React.MouseEvent<HTMLDivElement>) => {
    const au = audioRef.current;
    if (!au || !duree) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    au.currentTime = ratio * duree;
    setEcoule(au.currentTime);
  };

  const pct = duree > 0 ? (ecoule / duree) * 100 : 0;
  const episode = genre === 'episode';
  const libelle =
    lang === 'FR'
      ? joue
        ? `Mettre en pause ${episode ? "l'épisode" : 'le témoignage de'} ${nom}`
        : `Écouter ${episode ? "l'épisode" : 'le témoignage de'} ${nom}`
      : joue
        ? `Pause the ${episode ? 'episode' : 'testimonial from'} ${nom}`
        : `Play the ${episode ? 'episode' : 'testimonial from'} ${nom}`;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        type="button"
        onClick={basculer}
        aria-label={libelle}
        className="flex h-12 w-12 flex-none items-center justify-center rounded-pilule bg-bouton text-sur-bouton transition-transform duration-200 hover:scale-[1.06]"
      >
        {joue ? <Pause className="h-4 w-4" fill="currentColor" aria-hidden /> : <Play className="h-4 w-4" fill="currentColor" aria-hidden />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex h-6 items-end gap-[3px]" aria-hidden="true">
          {barres.map((b, i) => (
            <span
              key={i}
              className={`xh-onde-barre w-[3px] rounded-full bg-trait ${joue ? 'xh-onde-barre--joue' : ''}`}
              style={{ animationDuration: `${b.duree}s`, animationDelay: `${b.delai}s` }}
            />
          ))}
        </div>
        <div onClick={chercher} aria-hidden="true" className="mt-2 h-[3px] w-full cursor-pointer rounded-pilule bg-filet">
          <div className="h-full rounded-pilule bg-trait" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <span className="flex-none text-petit tabular-nums text-gris">
        {mmss(ecoule)} / {mmss(duree)}
      </span>

      <style>{`
        .xh-onde-barre{height:100%;transform:scaleY(.42);transform-origin:bottom;opacity:.45;transition:opacity .3s}
        .xh-onde-barre--joue{opacity:1;animation-name:xh-ondule;animation-iteration-count:infinite;animation-timing-function:ease-in-out}
        @keyframes xh-ondule{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
        @media (prefers-reduced-motion: reduce){.xh-onde-barre--joue{animation:none;transform:scaleY(.7)}}
      `}</style>
    </div>
  );
};

export default LecteurAudio;
