/**
 * Firebase web configuration, sourced from NEXT_PUBLIC_* environment variables.
 * These values are safe to expose to the browser — access is governed by
 * Firebase Authentication and Firestore Security Rules, not by secrecy.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

/**
 * True only when real credentials are present. The bundled placeholder key
 * contains "DEMO", which we treat as "not configured" so the UI can show a
 * helpful setup banner instead of failing silently.
 */
export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes("DEMO"),
);
