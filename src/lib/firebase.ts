// Firebase configuration — these are PUBLISHABLE keys, safe to commit.
// Replace the placeholder values with your project's web config from
// Firebase Console → Project Settings → General → Your apps → Web app.
//
// You also need to enable, in the Firebase Console:
//   1. Build → Firestore Database  → Create database (start in test mode for now)
//   2. Build → Authentication      → Sign-in method → Anonymous → Enable
//
// Recommended Firestore rules for per-visitor rooms (paste in Rules tab):
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /chats/{uid}/messages/{messageId} {
//         allow read, write: if request.auth != null && request.auth.uid == uid;
//       }
//     }
//   }

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL1-3hqyCO7ab1qKxvfPqq7XClzIu36Ro",
  authDomain: "real---chatting-website.firebaseapp.com",
  projectId: "real---chatting-website",
  storageBucket: "real---chatting-website.firebasestorage.app",
  messagingSenderId: "1040118498234",
  appId: "1:1040118498234:web:ff40c4c2eaed0a0dca5383",
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("YOUR_");

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

export const auth = authInstance;
export const db = dbInstance;
