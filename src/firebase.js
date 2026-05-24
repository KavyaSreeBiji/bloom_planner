// src/firebase.js
// ⚠️  Replace ALL values below with your own Firebase project credentials.
// Steps:
//  1. Go to https://console.firebase.google.com
//  2. Create a new project (or open an existing one)
//  3. Click "Add app" → Web app icon (</>)
//  4. Copy the firebaseConfig object shown and paste here
//  5. In Firebase console → Authentication → Sign-in method → Enable Email/Password
//  6. In Firebase console → Firestore Database → Create database (start in production mode)
//     Add these Firestore Security Rules:
//       rules_version = '2';
//       service cloud.firestore {
//         match /databases/{database}/documents {
//           match /users/{userId}/{document=**} {
//             allow read, write: if request.auth != null && request.auth.uid == userId;
//           }
//         }
//       }

import { initializeApp } from "firebase/app";
import { 
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc
};
