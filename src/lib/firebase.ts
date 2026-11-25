// Firebase setup for the Senstoria mobile app.
// Project: senstoria-app, region asia-southeast2.
// All config values come from EXPO_PUBLIC_FIREBASE_* env vars (see .env.example).
// Nothing is hardcoded: without env vars the SDK is initialized with obvious
// placeholders and isFirebaseConfigured() returns false. Real values are filled
// in from the Firebase console by the founder — never commit them.
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  type Auth,
  type UserCredential,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const PLACEHOLDER = 'FILL_ME_IN';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? PLACEHOLDER,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? PLACEHOLDER,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? PLACEHOLDER,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? PLACEHOLDER,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? PLACEHOLDER,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? PLACEHOLDER,
};

export function isFirebaseConfigured(): boolean {
  return Object.values(firebaseConfig).every((v) => v !== PLACEHOLDER && v.length > 0);
}

function getFirebaseApp(): FirebaseApp {
  const existing = getApps();
  if (existing.length > 0) return existing[0] as FirebaseApp;
  return initializeApp(firebaseConfig);
}

export const app: FirebaseApp = getFirebaseApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Minimal auth stub (foundation only; no UI yet).
// Email sign-in; Google/Apple sign-in and auth state handling arrive in Fase 2.
// Note: React Native auth persistence is in-memory by default. Wiring
// AsyncStorage persistence (getReactNativePersistence) is a Fase 2 step.
export function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}
