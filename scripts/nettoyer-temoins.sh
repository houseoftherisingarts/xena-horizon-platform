#!/bin/bash
# Retire les deux comptes témoins de vérification (client et admin), leurs dossiers Firestore et leurs fichiers Storage.
# À lancer à la fin d'une boucle de vérification, jamais avant : le script qa-xena.cjs en a besoin.
set -e
PROJET=xena-70977
KEY=$(grep VITE_FIREBASE_API_KEY "$(dirname "$0")/../.env" | cut -d= -f2)
TOKEN=$(gcloud auth print-access-token)
while IFS= read -r ligne; do
  email=$(echo "$ligne" | awk -F' / ' '{print $1}' | xargs); pw=$(echo "$ligne" | awk -F' / ' '{print $2}' | xargs)
  [ -z "$email" ] && continue
  idtoken=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$KEY" -H 'Content-Type: application/json' -d "{\"email\":\"$email\",\"password\":\"$pw\",\"returnSecureToken\":true}" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('idToken',''))")
  uid=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=$KEY" -H 'Content-Type: application/json' -d "{\"idToken\":\"$idtoken\"}" | python3 -c "import json,sys;d=json.load(sys.stdin);u=d.get('users',[{}]);print(u[0].get('localId','') if u else '')")
  if [ -n "$uid" ]; then
    gsutil -m rm -r "gs://$PROJET.firebasestorage.app/dossiers/$uid" 2>/dev/null || true
    for sub in messages notes; do
      curl -s -H "Authorization: Bearer $TOKEN" "https://firestore.googleapis.com/v1/projects/$PROJET/databases/(default)/documents/dossiers/$uid/$sub?pageSize=300" | python3 -c "import json,sys;[print(d['name']) for d in json.load(sys.stdin).get('documents',[])]" | while read -r doc; do curl -s -X DELETE -H "Authorization: Bearer $TOKEN" "https://firestore.googleapis.com/v1/$doc" >/dev/null; done
    done
    curl -s -X DELETE -H "Authorization: Bearer $TOKEN" "https://firestore.googleapis.com/v1/projects/$PROJET/databases/(default)/documents/dossiers/$uid" >/dev/null
    curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=$KEY" -H 'Content-Type: application/json' -d "{\"idToken\":\"$idtoken\"}" >/dev/null
    echo "retiré : $email ($uid)"
  else
    echo "introuvable : $email"
  fi
done < "$HOME/.config/xena/compte-temoin.txt"
