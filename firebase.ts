import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported as analyticsSupported, type Analytics } from 'firebase/analytics';

const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};
if (!firebaseConfig.projectId) throw new Error('Configuration Firebase absente : vérifier le fichier .env');

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// La mesure d'audience (Loi 25) ne démarre qu'après consentement — jamais au chargement.
// Le bandeau (components/Consentement.tsx) appelle activerAnalytics() une fois le choix "j'accepte" fait,
// et cette même fonction relance la mesure au retour d'une personne qui avait déjà accepté.
let analyticsInstance: Analytics | null = null;

export function activerAnalytics(): void {
  if (typeof window === 'undefined' || analyticsInstance) return;
  analyticsSupported()
    .then((ok) => {
      if (ok) analyticsInstance = getAnalytics(app);
    })
    .catch(() => {});
}

const CLE_CONSENTEMENT = 'xena.consentement';
if (typeof window !== 'undefined') {
  try {
    const brut = window.localStorage.getItem(CLE_CONSENTEMENT);
    const consentement = brut ? JSON.parse(brut) : null;
    if (consentement?.valeur === 'accepte') activerAnalytics();
  } catch {
    /* navigation privée ou stockage bloqué : la bannière reparaîtra, rien de plus */
  }
}
