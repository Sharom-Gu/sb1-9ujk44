import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "DEINE_API_KEY",
  authDomain: "DEINE_AUTH_DOMAIN",
  projectId: "DEIN_PROJECT_ID",
  storageBucket: "DEIN_STORAGE_BUCKET",
  messagingSenderId: "DEINE_MESSAGING_SENDER_ID",
  appId: "DEINE_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);