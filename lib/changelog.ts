/**
 * Le journal des changements du site de Laurie, tel qu'elle le lit dans son back-office.
 *
 * Il vit dans le code plutôt que dans Firestore : il part avec chaque déploiement, il porte
 * l'historique du dépôt, et personne ne peut l'effacer par mégarde depuis l'admin.
 *
 * RÈGLE DE TENUE : chaque journée de travail sur ce site ajoute son entrée EN TÊTE du tableau,
 * le jour même, avant de dire que la livraison est finie. Le texte s'adresse à Laurie, au
 * « vous » comme le reste de son back-office, sans vocabulaire de programmeur : elle doit
 * reconnaître ce qui a changé pour elle, pas lire un rapport technique. Une journée déjà
 * inscrite ne se récrit pas.
 */

export type EntreeJournal = {
  /** AAAA-MM-JJ, la journée de travail. */
  date: string;
  titre: string;
  /** Une ou deux phrases qui situent la journée. */
  intro: string;
  /** Ce qui a été fait, une phrase entière par étape. */
  etapes: string[];
};

export const JOURNAL: EntreeJournal[] = [
  {
    date: '2026-09-23',
    titre: "L'offre de représentante Vexel",
    intro:
      "Votre back-office porte maintenant l'offre officielle de Vexel Webstudio : une fenêtre s'ouvre à votre prochaine visite pour vous présenter ce que vous touchez en amenant d'autres personnes vers Vexel, et vous choisissez le moment de vous y engager.",
    etapes: [
      "La fenêtre explique le programme en une page, avec le bonus de 200 $ au premier client Signature que vous amenez et les 12 % de chaque abonnement qui reviennent tous les mois, tant que le site de ce client reste en ligne.",
      "Le bouton de la visite ouvre l'accueil de vexelwebstudio.com dans un nouvel onglet, où quatre cartes vous montrent les réalisations, le calcul de votre part et les formules que vos clients verront, avant de vous laisser signer.",
      "Si le moment ne s'y prête pas, « Plus tard » range l'offre dans une petite bulle au coin de votre écran, qui garde sa pastille et rouvre la fenêtre d'un seul clic.",
      "L'entente se lit et se signe en ligne avec votre compte Google, et la bulle disparaît d'elle-même une fois l'entente signée.",
    ],
  },
  {
    date: '2026-09-16',
    titre: 'Une précision sur le collant Vexel',
    intro:
      "La carte qui explique l'entente Vexel, au bas de vos pages, dit maintenant plus précisément ce qu'est ce projet.",
    etapes: [
      "La ligne sous le nom de Vexel Webstudio dit désormais qu'il s'agit d'un projet créatif du Salon des Inconnus, en français comme en anglais.",
    ],
  },
  {
    date: '2026-09-14',
    titre: 'Votre bouton Google répond à nouveau',
    intro:
      "Depuis que votre site a pris l'adresse lauriebelhumeur.com, la connexion par Google ouvrait une fenêtre qui se refermait aussitôt, chez vous comme chez les personnes qui viennent ouvrir leur dossier. La cause a été trouvée et corrigée, et la carte du collant Vexel a reçu au passage deux ajouts.",
    etapes: [
      "Votre nouvelle adresse n'avait jamais été déclarée auprès de Google, qui refusait donc la connexion sans rien expliquer; elle l'est maintenant, avec sa version en www, et le bouton « Continuer avec Google » mène à la vraie page de Google sur les deux adresses de votre site.",
      "La connexion se souvient de vous dans une mémoire du navigateur plus solide que celle employée jusqu'ici, ce qui évite qu'une session se perde toute seule sur un ordinateur dont la mémoire interne est abîmée.",
      "Si une connexion échoue malgré tout, le message qui s'affiche est écrit en français et dit quoi faire, au lieu de montrer le code d'erreur du fournisseur.",
      "Sous le nom de Vexel Webstudio, une ligne précise maintenant qu'il s'agit d'un projet du Salon des Inconnus, et le sigle doré du Salon apparaît en bas à droite de la carte, en lien vers son propre site.",
      "La carte s'ouvre désormais par-dessus tout le reste de la page, assistant et bandeau compris, sur ordinateur comme sur téléphone.",
    ],
  },
  {
    date: '2026-09-10',
    titre: 'Votre nom de domaine quitte Wix',
    intro:
      "Votre site vivait chez nous depuis deux jours pendant que votre adresse pointait encore vers Wix. Les deux sont maintenant réunis, et vos abonnements Wix ont été coupés.",
    etapes: [
      "Votre adresse lauriebelhumeur.com mène désormais à votre nouveau site plutôt qu'à l'ancien, et l'adresse xenahorizon.com continue de fonctionner en parallèle.",
      "Votre forfait Wix a été résilié, ses fonctions restant allumées jusqu'au 12 octobre 2026 pour que rien ne tombe entre-temps.",
      "Le renouvellement automatique de votre nom de domaine a été coupé avant qu'il ne se facture, et le domaine a été déverrouillé pour partir vers un registraire qui ne vend que des noms.",
      "Un document appelé « Où vit votre site » a été déposé dans vos ressources partagées : il dit sous quel compte chaque morceau est rangé, qui en est responsable et ce que tout cela coûte.",
      "Le journal que vous lisez a été bâti, et l'historique du projet y a été remonté depuis le premier jour.",
      "Le collant « Site créé par Vexel Webstudio » au bas de vos pages a été posé droit avec le logo complet, un second collant carré « Affilié certifié » l'accompagne, et la fenêtre qui explique l'entente s'ouvre maintenant comme une carte plus large.",
      "En mode nuit, le bouton « Mon espace » et le petit cadenas de votre admin se lisent en noir sur votre photo d'accueil, là où ils se perdaient dans le blanc.",
    ],
  },
  {
    date: '2026-09-09',
    titre: 'Les derniers détails avant de vous montrer le site',
    intro:
      "Quatre irritants restaient de la veille, et ils ont été fermés un par un plutôt que laissés pour plus tard.",
    etapes: [
      "Une facture courte tenait sur deux pages à l'impression à cause de son pied de page, et elle tient maintenant sur une seule.",
      "Vos pages bougeaient légèrement au chargement, le temps que les images se placent. Elles se posent maintenant d'un coup.",
      "Vos quatre pages publiques existent en anglais à leur propre adresse, et les moteurs de recherche savent laquelle correspond à laquelle.",
      "La vitesse d'affichage a été mesurée sur le vrai site plutôt que sur un banc d'essai : la plus lente de vos pages se dessine en une seconde.",
    ],
  },
  {
    date: '2026-09-08',
    titre: "Le jour où votre site est devenu un outil",
    intro:
      "Vous vouliez pouvoir corriger vos textes vous-même, prendre vos rendez-vous sans Calendly et suivre vos dossiers sans sortir du site. Tout cela est arrivé dans la même journée.",
    etapes: [
      "Un crayon apparaît en haut à droite quand vous êtes connectée, et il vous laisse récrire n'importe quel titre ou paragraphe du site, puis recadrer vos photos en déplaçant un point sur l'image.",
      "Le bouton « Prendre rendez-vous » ouvre le compte de la personne, l'inscrit dans votre agenda et lui envoie un courriel, sans que vous ayez à faire quoi que ce soit.",
      "Votre agenda vit maintenant dans votre site plutôt que chez Calendly, avec vos disponibilités, la confirmation des demandes et une salle de rencontre vidéo qui s'ouvre à même la page.",
      "Votre espace client a pris l'allure d'un vrai profil, avec votre bannière, votre photo et vos onglets, et la messagerie s'y lit comme une conversation ordinaire.",
      "Votre back-office a reçu ses grands modules : les factures avec leur page publique et leur bouton de paiement, l'infolettre avec ses gabarits, le studio des visuels, la comptabilité avec l'import de vos relevés, et un prédicteur d'impôt pour 2026.",
      "Les témoignages audio sont arrivés sur l'accueil, et le balado montre ses épisodes sur la page des projets.",
      "Un mode nuit s'allume avec celui de votre appareil, et une bascule vous laisse comparer la version éditoriale et vos propres couleurs.",
      "Le site a été passé au peigne fin côté sécurité et côté moteurs de recherche, et vos pages anglaises ont été reprises une à une.",
    ],
  },
  {
    date: '2026-09-07',
    titre: 'Votre site refait au complet',
    intro:
      "Le point de départ du vrai site. Tout ce que disait votre page Wix a été relu, gardé et remis en scène, puis le site a reçu un espace client et un back-office.",
    etapes: [
      "Les pages publiques ont été rebâties dans une direction éditoriale, avec le papier chaud, l'encre et le trait de rose emprunté à la couverture de votre livre.",
      "Vos textes, vos services et vos photos ont été repris depuis votre ancien site plutôt qu'inventés, et vos vraies coordonnées y sont revenues.",
      "L'espace client est né : vos gens y ouvrent leur dossier, déposent leurs documents, suivent leur parcours en cinq temps et vous écrivent.",
      "Le back-office est né avec lui : la liste des dossiers, la validation des pièces, vos notes privées et l'export de chaque fiche.",
      "L'adresse xenahorizon.com a été branchée, et le site est passé en ligne le soir même.",
    ],
  },
  {
    date: '2026-05-18',
    titre: 'La première maquette',
    intro:
      "Une première version du site avait été dessinée pour donner une idée, sans jamais être mise en ligne. Elle a servi de point de départ à la refonte de septembre.",
    etapes: [
      "Les grandes pages ont été esquissées avec une première proposition de couleurs et de mise en page.",
      "La base de données et l'ossature du site ont été montées pour que le vrai travail puisse commencer dessus.",
    ],
  },
];

/** Le nombre d'étapes livrées depuis le début, pour l'en-tête du journal. */
export const nombreEtapes = (): number => JOURNAL.reduce((n, e) => n + e.etapes.length, 0);
