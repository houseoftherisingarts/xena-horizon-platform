# Branchements

Ce que chaque intégration externe du site demande d'Alex : un compte à créer, une clé à générer, un
geste précis à poser, et où déposer le résultat. Une section par intégration. Rien ici ne s'active tout
seul : tant qu'une section n'est pas faite, la fonction correspondante existe dans le code, compile,
mais reste inactive (projet Firebase `xena-70977` sur le plan Spark : aucune fonction déployée).

## Infolettre (envoi réel des lettres composées)

Ce que ça fait : le bouton « Envoyer » du composeur (Admin › Infolettres) part réellement vers les
abonnés au lieu de rester un brouillon. Le module vit dans `components/admin/infolettre/`,
`lib/infolettre/`, le code serveur dans `functions/src/infolettre/send.ts` (callable
`envoyerInfolettre`, région `northamerica-northeast1`). Détail complet des étapes et des secrets :
`functions/README.md`.

**1. Le plan Blaze**, comme pour toute fonction serveur de ce projet (voir plus bas).

**2. Le domaine chez Resend.** Vérifier `xenahorizon.com` (DKIM + SPF) pour pouvoir envoyer depuis
`infolettre@xenahorizon.com`.

**3. Les secrets côté Firebase** :

```bash
firebase functions:secrets:set RESEND_API_KEY --project xena-70977
firebase functions:secrets:set RESEND_WEBHOOK_SECRET --project xena-70977          # rendu par Resend à la création du webhook, étape 5
firebase functions:secrets:set NEWSLETTER_POSTAL_ADDRESS --project xena-70977      # adresse postale réelle, exigée par la loi anti-pourriel : jamais inventée ici
```

**4. Le déploiement**, une fois Blaze actif :

```bash
cd functions && npm install && npm run build
firebase deploy --only functions --project xena-70977
```

**5. Le webhook Resend.** Créer un webhook (POST `https://api.resend.com/webhooks`) vers l'URL de
`resendWebhook` rendue par le déploiement, pour les événements `email.bounced` et `email.complained`.

**Une fois branché**, Laurie teste avec « Test à Laurie » ou « Test à une autre adresse » dans le
composeur avant tout envoi réel à sa liste.

## Google Agenda (synchronisation des rendez-vous)

Ce que ça fait : les rendez-vous confirmés de Laurie deviennent des événements dans SON agenda Google,
et les plages déjà prises dans cet agenda bloquent automatiquement les nouveaux créneaux sur le site.
Le module vit dans `components/admin/agenda/GoogleAgenda.tsx` (Admin › Agenda), le code serveur dans
`functions/src/agenda/google.ts`.

**1. Le projet Google Cloud.** Créer (ou réutiliser) un projet sur [console.cloud.google.com](https://console.cloud.google.com),
puis activer l'API **Google Calendar API** (menu « API et services » › « Bibliothèque »).

**2. L'écran de consentement OAuth.** « API et services » › « Écran de consentement OAuth » : type
Externe, nom de l'app « Xena Horizon », courriel de support et logo au choix. Ajouter les deux portées
(*scopes*) `https://www.googleapis.com/auth/calendar.events` et `.../calendar.readonly`. Ajouter
`laurie.belhumeur@gmail.com` comme utilisatrice test tant que l'app n'est pas publiée (ou publier
l'écran si Laurie veut se connecter sans cet avertissement).

**3. L'identifiant client OAuth.** « API et services » › « Identifiants » › « Créer des identifiants »
› « ID client OAuth », type **Application Web**. Dans « URI de redirection autorisés », coller
EXACTEMENT cette adresse (aucune variante, aucun slash de fin) :

```
https://northamerica-northeast1-xena-70977.cloudfunctions.net/agendaGoogleRetour
```

Google rend alors un **ID client** et un **code secret**.

**4. Les secrets côté Firebase** (une fois le plan Blaze actif, voir point 5) :

```bash
firebase functions:secrets:set GOOGLE_OAUTH_CLIENT_ID --project xena-70977       # l'ID client de l'étape 3
firebase functions:secrets:set GOOGLE_OAUTH_CLIENT_SECRET --project xena-70977   # le code secret de l'étape 3
firebase functions:secrets:set AGENDA_STATE_SECRET --project xena-70977         # une chaîne aléatoire longue, ex. `openssl rand -hex 32`
```

`AGENDA_STATE_SECRET` n'est pas un secret Google : c'est une clé maison qui signe le paramètre `state`
de l'aller-retour OAuth, pour qu'un tiers ne puisse pas déclencher l'échange de code à la place de
Laurie. N'importe quelle chaîne aléatoire longue convient.

**5. Le plan Blaze.** Comme pour l'infolettre (voir `functions/README.md`), aucune fonction ne se
déploie tant que le projet reste sur Spark. Une fois Blaze actif :

```bash
firebase deploy --only functions:agendaGoogleConnecter,functions:agendaGoogleRetour,functions:agendaGoogleEtat,functions:agendaGoogleDeconnecter,functions:agendaGoogleSync,functions:agendaGoogleSyncSurEcriture --project xena-70977
```

**Une fois branché**, Laurie clique « Connecter mon Google Agenda » dans Admin › Agenda et suit l'écran
Google. Rien d'autre à faire de son côté : la synchronisation tourne seule toutes les 15 minutes, et
sur-le-champ à chaque confirmation, annulation ou fin de rendez-vous.

## Stripe (paiement d'une facture publiée)

Ce que ça fait : la personne qui reçoit une facture à l'adresse `/facture/{jeton}` voit un bouton
« Payer par carte » et règle le montant exact sans quitter la page. Le module vit dans
`lib/factures.ts`, `components/admin/factures/DocumentFacture.tsx`, `pages/FacturePublique.tsx` et,
côté serveur, `functions/src/factures/paiement.ts`.

**Deux chemins, un seul actif à la fois.**

**Chemin A (actif dès maintenant, sans clé ni fonction) : un lien de paiement Stripe.** Laurie crée un
lien de paiement dans son compte Stripe (Stripe › Paiements › Liens de paiement) au montant de la
facture, et le colle dans Admin › Factures › Réglages, champ « Lien de paiement ». La page publique
l'affiche telle quelle, avec le courriel du client et le numéro de facture ajoutés à l'adresse. Un lien
de paiement Stripe est à montant fixe : Laurie doit en créer un qui correspond au bon montant pour
chaque facture (ou une poignée de liens à montants ronds), tant que le chemin B n'est pas branché.

**Chemin B (montant exact, automatique, demande le forfait Blaze) : Stripe Checkout.**

1. **Le compte Stripe de Laurie.** Depuis [dashboard.stripe.com](https://dashboard.stripe.com), copier
   la clé secrète (Développeurs › Clés API, « Clé secrète », commence par `sk_live_` ou `sk_test_`
   pour essayer d'abord).
2. **Les secrets côté Firebase** (une fois le plan Blaze actif, voir point 4) :

   ```bash
   firebase functions:secrets:set STRIPE_SECRET_KEY_XENA --project xena-70977   # la clé secrète de l'étape 1
   ```

3. **Le point de terminaison webhook.** Une fois la fonction déployée (point 4), Stripe › Développeurs
   › Webhooks › « Ajouter un point de terminaison », adresse :

   ```
   https://northamerica-northeast1-xena-70977.cloudfunctions.net/webhookStripeXena
   ```

   Événement à cocher : `checkout.session.completed`. Stripe rend alors une clé de signature
   (`whsec_...`) :

   ```bash
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET_XENA --project xena-70977   # le whsec_... ci-dessus
   ```

4. **Le plan Blaze.** Comme pour l'infolettre et l'agenda Google, aucune fonction ne se déploie tant
   que le projet reste sur Spark. Une fois Blaze actif :

   ```bash
   firebase deploy --only functions:creerPaiementFacture,functions:webhookStripeXena --project xena-70977
   ```

**Une fois branché**, le bouton « Payer par carte » de la page publique peut appeler `creerPaiementFacture`
au lieu du lien de paiement statique : ce dernier raccord (quelques lignes dans
`pages/FacturePublique.tsx`) se fait au moment où Alex active le chemin B, pour ne pas préparer un
appel à une fonction qui n'existe pas encore côté serveur.

## Stripe (produits vendus en ligne, échelle de valeur)

Ce que ça fait : chaque offre du catalogue (Admin › Produits) réglée en « Paiement en ligne » se relie
à un Product et un Price Stripe. Sur `/services`, le bouton de la carte devient « Acheter » et ouvre une
session Stripe Checkout au montant exact. Le module vit dans `lib/produits.ts`,
`components/admin/offres/Paiement.tsx`, `pages/PublicServices.tsx` et, côté serveur,
`functions/src/produits/stripe.ts`.

**Deux chemins, un seul actif à la fois, comme pour les factures.**

**Chemin A (actif dès maintenant, sans clé ni fonction) : un lien de paiement Stripe.** Laurie crée un
lien de paiement dans son compte Stripe (Stripe › Paiements › Liens de paiement) au montant de l'offre,
et le colle dans le formulaire de l'offre, bloc « Paiement », champ « Lien de paiement Stripe ». Le
bouton « Acheter » l'ouvre dans un nouvel onglet. Un lien de paiement est à montant fixe : une offre à
prix variable reste en « Sur demande » ou « Inscription ».

**Chemin B (montant exact, automatique, demande le forfait Blaze) : Stripe Checkout.**

1. **Le compte Stripe de Laurie.** Même clé secrète que le chemin B des factures ci-dessus
   (`STRIPE_SECRET_KEY_XENA`) : si elle est déjà posée, rien à refaire ici.
2. **Le secret de webhook, propre à ce point de terminaison** (une fois le plan Blaze actif, voir
   point 4) :

   ```bash
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET_PRODUITS_XENA --project xena-70977
   ```

3. **Le point de terminaison webhook.** Une fois la fonction déployée (point 4), Stripe › Développeurs
   › Webhooks › « Ajouter un point de terminaison », adresse :

   ```
   https://northamerica-northeast1-xena-70977.cloudfunctions.net/webhookStripeProduits
   ```

   Événement à cocher : `checkout.session.completed`. Stripe rend alors une clé de signature
   (`whsec_...`), à poser avec la commande de l'étape 2.

4. **Le plan Blaze.** Comme pour l'infolettre, l'agenda Google et les factures, aucune fonction ne se
   déploie tant que le projet reste sur Spark. Une fois Blaze actif :

   ```bash
   firebase deploy --only functions:synchroniserProduitStripe,functions:creerPaiementProduit,functions:webhookStripeProduits --project xena-70977
   ```

**Une fois branché**, chaque offre publiée et réglée « Paiement en ligne » se synchronise seule dès
qu'elle est enregistrée (pastille « Reliée à Stripe » dans le formulaire); les paiements reçus
s'accumulent dans la collection `commandes`, lisible par Laurie dans la console Firebase en attendant
un onglet dédié.
