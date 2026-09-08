// Export du studio social : on rasterise le DOM réel de la toile (html-to-image) plutôt que de
// redessiner sur un <canvas> séparé, pour que l'image téléchargée soit exactement ce qui est
// affiché (police, ombre, filtre). Le facteur de pixels ramène la toile, affichée petite à
// l'écran, à la résolution native du format choisi.
import { toPng } from 'html-to-image';
import type { Format } from './types';

export const telechargerToile = async (noeud: HTMLElement, format: Format, prefixe = 'xena'): Promise<void> => {
  const rect = noeud.getBoundingClientRect();
  const pixelRatio = rect.width > 0 ? format.largeur / rect.width : 2;
  const dataUrl = await toPng(noeud, { pixelRatio, cacheBust: true, skipFonts: false });
  const lien = document.createElement('a');
  lien.download = `${prefixe}-${format.id}.png`;
  lien.href = dataUrl;
  lien.click();
};

export const copierTexte = async (texte: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    return false;
  }
};
