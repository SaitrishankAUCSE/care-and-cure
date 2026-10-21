import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const isConfigured = Boolean(
  apiKey &&
  apiKey.trim() !== '' &&
  projectId &&
  projectId.trim() !== ''
);

let db = null;
let app = null;

if (isConfigured) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.log('[Firebase] Connected to Firestore Demo DB');
  } catch (err) {
    console.warn('[Firebase] Initialization error, falling back to local demo storage:', err);
  }
}

export { db, isConfigured };
