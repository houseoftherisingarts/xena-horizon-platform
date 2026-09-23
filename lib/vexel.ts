/**
 * Le lien de parrainage de Laurie chez Vexel Webstudio. La personne qui clique sur l'autocollant du
 * pied de page arrive sur vexelwebstudio.com avec le code partenaire de Laurie déjà rempli : si elle
 * ouvre un compte client, Laurie devient sa marraine et touche sa part de l'abonnement chaque mois.
 * Le code vit dans le compte partenaire de Laurie chez Vexel (collection `partenaires`).
 */
export const CODE_PARTENAIRE_LAURIE = 'XENA-LB26';
export const LIEN_PARRAINAGE_VEXEL = `https://vexelwebstudio.com/?parrain=${CODE_PARTENAIRE_LAURIE}`;

/**
 * Le dossier de Xena Horizon chez Vexel (`clients/xena` du projet vexel-integrations) et sa clé :
 * la même paire que la fenêtre de demandes (pages/AdminVexel.tsx). Elle n'ouvre que le dépôt d'une
 * demande et la lecture de l'offre partenaire, jamais autre chose.
 */
export const SLUG_VEXEL = 'xena';
export const CLE_VEXEL = 'jsV84Gj0KONwv-J82NDbcGSR';
/** La personne à qui s'adresse l'offre partenaire officielle de Vexel. */
export const COURRIEL_LAURIE = 'laurie.belhumeur@gmail.com';
