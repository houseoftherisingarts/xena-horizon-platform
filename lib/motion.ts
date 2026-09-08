// Politique de mouvement du site : les animations jouent sur tous les ordinateurs,
// même quand le système demande « réduire les animations » (ordre d'Alex, 8 sept 2026 :
// le site de Laurie n'animait rien sur son poste). Un seul point pour changer d'avis.
export const useReducedMotion = (): boolean => false;
export const MOUVEMENT_REDUIT = false;
