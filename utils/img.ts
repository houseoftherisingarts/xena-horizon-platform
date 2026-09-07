/**
 * Chemin webp d'une image locale, quand il existe. `public/images/*.jpg` a son
 * équivalent `.webp` généré au même endroit (voir CLAUDE.md, section images) :
 * ce helper échange l'extension pour les chemins qui commencent par /images/.
 * Les URLs distantes (Firebase Storage, Unsplash...) traversent inchangées :
 * seules les images maison, servies par ce dépôt, ont un frère .webp garanti.
 */
export function webp(path: string): string {
  if (!path.startsWith('/images/')) return path;
  return path.replace(/\.(jpe?g|png)$/i, '.webp');
}
