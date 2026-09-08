/**
 * Formatage des montants comptables (en dollars) : virgule décimale et milliers en fr-CA/en-CA,
 * espace insécable avant le symbole en français. Les chiffres passent par Figtree avec la classe
 * `tabular-nums` côté appelant (voir CLAUDE.md) ; cet helper ne rend que le texte.
 */
import type { Language } from '../../types';

const ESPACE_INSECABLE = ' ';

export function formatMontant(montant: number, lang: Language = 'FR', decimales = 2): string {
  const locale = lang === 'FR' ? 'fr-CA' : 'en-CA';
  const nombre = montant.toLocaleString(locale, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
  return lang === 'FR' ? `${nombre}${ESPACE_INSECABLE}$` : `$${nombre}`;
}

/** Signe + ou - devant le montant, pour un grand livre ou une ligne de transaction. */
export function formatMontantSigne(montant: number, lang: Language = 'FR', decimales = 2): string {
  const signe = montant > 0 ? '+' : '';
  return `${signe}${formatMontant(montant, lang, decimales)}`;
}

/** Un pourcentage fr-CA/en-CA (répartition des dépenses, taux effectif). */
export function formatPourcent(valeur: number, lang: Language = 'FR', decimales = 1): string {
  const locale = lang === 'FR' ? 'fr-CA' : 'en-CA';
  const nombre = valeur.toLocaleString(locale, { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
  return `${nombre}${ESPACE_INSECABLE}%`;
}
