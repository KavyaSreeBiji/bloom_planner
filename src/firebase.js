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
  apiKey: "AIzaSyDmFRdQS8auQ7cIZjppGmXb2KD2AQZ_r38",
  authDomain: "bloomplanner-1b832.firebaseapp.com",
  projectId: "bloomplanner-1b832",
  storageBucket: "bloomplanner-1b832.firebasestorage.app",
  messagingSenderId: "444422666159",
  appId: "1:444422666159:web:7c98e75f5543f04e8ae15a",
  measurementId: "G-WQFK016690"
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
