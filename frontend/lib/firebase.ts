/**
 * VayuNet Firebase Client Stub
 * Environment-variable driven configuration for Firebase Auth and Firestore.
 * Zero hardcoded keys or production secrets.
 * 
 * Safe for Next.js SSR / client-side execution.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-placeholder-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'vayunet.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'vayunet',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'vayunet.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:000000000000',
};

// Initialize Firebase only once across hot reloads
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export default app;
