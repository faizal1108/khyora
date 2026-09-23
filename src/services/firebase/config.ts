import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import {
  Firestore,
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
} from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function ensureApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Copy .env.example to .env and add your Firebase credentials.',
    );
  }

  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

function createReactNativePersistence() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const authModule = require('@firebase/auth') as {
    getReactNativePersistence: (storage: typeof AsyncStorage) => unknown;
  };
  return authModule.getReactNativePersistence(AsyncStorage);
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth;
  const firebaseApp = ensureApp();

  try {
    auth = initializeAuth(firebaseApp, {
      persistence: createReactNativePersistence() as never,
    });
  } catch {
    auth = getAuth(firebaseApp);
  }

  return auth;
}

export function getFirebaseDb(): Firestore {
  if (db) return db;
  const firebaseApp = ensureApp();

  try {
    const localCache =
      Platform.OS === 'web' ? persistentLocalCache() : memoryLocalCache();
    db = initializeFirestore(firebaseApp, { localCache });
  } catch {
    db = getFirestore(firebaseApp);
  }

  return db;
}
