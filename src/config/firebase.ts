import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Track whether this is the first initialization (guards against Fast Refresh
// calling initializeAuth twice, which throws "already initialized" error).
const isFirstInit = getApps().length === 0;
export const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

// Auth with AsyncStorage persistence — keeps user logged in between sessions.
// On Fast Refresh / hot reload, fall back to getAuth() since initializeAuth
// can only be called once per Firebase app instance.
export const auth = isFirstInit
  ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  : getAuth(app);

export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);