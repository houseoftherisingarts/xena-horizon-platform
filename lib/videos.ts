// Capsules vidéo (accueil, mode éducatif) : constantes et petits utilitaires purs partagés entre
// l'admin (pages/AdminVideos.tsx) et l'accueil (pages/accueil/Capsules.tsx). Le CRUD lui-même passe
// par lib/firestore.ts (createDoc, patchDoc, uploadFile...), comme partout ailleurs dans le site.

export const TAILLE_MAX_VIDEO = 200 * 1024 * 1024; // 200 Mo, borne de storage.rules
export const TYPES_VIDEO = ['video/mp4', 'video/webm'];

/** Un nom de fichier stable et lisible, pour Storage. */
export const glisser = (texte: string): string =>
  texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'capsule';

export const extension = (nomFichier: string, repli: string): string => {
  const m = /\.([a-zA-Z0-9]+)$/.exec(nomFichier);
  return m ? m[1].toLowerCase() : repli;
};

/**
 * Capture la première image lisible d'un fichier vidéo pour servir d'affiche, par un <video> hors
 * écran et un <canvas> (aucune dépendance : ffmpeg côté client n'existe pas dans un navigateur).
 * Cherche 0,3 s dans le flux (l'image à 0 est parfois noire le temps que le décodeur s'amorce).
 */
export function genererAffiche(fichier: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(fichier);
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = url;

    const fin = (blob: Blob | null) => {
      URL.revokeObjectURL(url);
      resolve(blob);
    };

    video.addEventListener('loadeddata', () => {
      video.currentTime = Math.min(0.3, (video.duration || 1) / 4);
    });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx || !canvas.width) return fin(null);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => fin(blob), 'image/jpeg', 0.85);
    });
    video.addEventListener('error', () => fin(null));
  });
}

export const octetsLisibles = (o: number): string => {
  if (o < 1024 * 1024) return `${Math.round(o / 1024)} Ko`;
  return `${(o / (1024 * 1024)).toFixed(1)} Mo`;
};
