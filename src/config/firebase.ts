import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// ── Firebase Project: luna-health-202fb ───────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase only once (safe for Expo hot-reload)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase v12 in this project does not expose React Native persistence helpers.
// Use initializeAuth when possible and gracefully fallback to getAuth on hot reload.
export const auth = (() => {
  try {
    return initializeAuth(app);
  } catch {
    return getAuth(app);
  }
})();

// Firestore database
export const db = getFirestore(app);

// Firebase Cloud Functions
export const functions = getFunctions(app);

// Firebase Storage
export const storage = getStorage(app);
