import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

/**
 * Signs an admin in with email + password. Throws a Firebase Auth error on failure.
 */
export async function login(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password
  );
  return credential.user;
}

/**
 * Signs the current admin out.
 */
export async function logout(): Promise<void> {
  await signOut(getFirebaseAuth());
}

/**
 * Subscribes to Firebase Auth state changes.
 */
export function subscribeToAuthChanges(
  callback: (user: FirebaseUser | null) => void
): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

/**
 * Returns the current user's Firebase ID token, or null if unauthenticated.
 */
export async function getIdToken(): Promise<string | null> {
  const currentUser = getFirebaseAuth().currentUser;
  if (!currentUser) return null;
  return currentUser.getIdToken();
}
