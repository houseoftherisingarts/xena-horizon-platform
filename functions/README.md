# Fonctions — infolettre Xena Horizon

Prêt côté code, pas encore actif : le projet `xena-70977` est sur Spark, aucune fonction n'y est déployée.

Pour activer, le jour venu :

1. Passer le projet Firebase sur le forfait Blaze (facturation à l'usage, seuil requis pour les Cloud Functions).
2. Vérifier le domaine `xenahorizon.com` chez Resend (DKIM + SPF) pour pouvoir envoyer depuis `infolettre@xenahorizon.com`.
3. Poser les secrets : `firebase functions:secrets:set RESEND_API_KEY`, `firebase functions:secrets:set RESEND_WEBHOOK_SECRET` (rendu par Resend à la création du webhook), `firebase functions:secrets:set NEWSLETTER_POSTAL_ADDRESS` (adresse postale réelle, exigée par la loi anti-pourriel — jamais inventée ici).
4. `npm install && npm run build` dans `functions/`, puis `firebase deploy --only functions --project xena-70977`.
5. Créer le webhook chez Resend (POST `https://api.resend.com/webhooks`) vers l'URL de `resendWebhook` rendue par le déploiement, pour les événements `email.bounced` et `email.complained`.
6. Appeler `envoyerInfolettre` avec `testEmail` avant tout envoi réel.

`envoyerInfolettre` est reprenable : un appel qui dépasse le budget de 7 minutes s'arrête proprement et un nouvel appel reprend au curseur `envoi.lastId`.
