# Branchements

Ce que chaque intégration externe du site demande d'Alex : un compte à créer, une clé à générer, un
geste précis à poser, et où déposer le résultat. Une section par intégration. Rien ici ne s'active tout
seul : tant qu'une section n'est pas faite, la fonction correspondante existe dans le code, compile,
mais reste inactive (projet Firebase `xena-70977` sur le plan Spark : aucune fonction déployée).

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
