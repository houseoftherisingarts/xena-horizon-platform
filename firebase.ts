import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBGL4SBR3jTBZ25gyDdQQebRnRihU44FxQ',
  authDomain: 'xena-70977.firebaseapp.com',
  projectId: 'xena-70977',
  storageBucket: 'xena-70977.firebasestorage.app',
  messagingSenderId: '26573351102',
  appId: '1:26573351102:web:9c32bc58d4e387232a96ef',
  measurementId: 'G-ZBXZLK36QV',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

if (typeof window !== 'undefined') {
  analyticsSupported().then((ok) => {
    if (ok) getAnalytics(app);
  }).catch(() => {});
}
