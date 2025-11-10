// Firebase configuration and initialization
// Structure based on Firebase Web SDK documentation
// Source: https://firebase.google.com/docs/web/setup
// Accessed: November 4, 2025

import { initializeApp } from "firebase/app";
// Initialize Analytics only when safe (production, browser, and not blocked)
// Avoids dev console noise from ad blockers (ERR_BLOCKED_BY_CLIENT)
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics: any;
export const initAnalytics = () => {
  if (
    typeof window !== 'undefined' &&
    import.meta.env.PROD &&
    // Only attempt when a measurement ID exists
    (firebaseConfig as any).measurementId
  ) {
    try {
      
      return import('firebase/analytics').then(async ({ getAnalytics, isSupported }) => {
        try {
          if (await isSupported()) {
            analytics = getAnalytics(app);
            return analytics;
          }
        } catch (_) {
          
        }
        return undefined;
      });
    } catch (_) {
      //  ignore any analytics errors
    }
  }
  return Promise.resolve(undefined);
};

export { analytics };
export default app;