import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "wandyte-book-sales.firebaseapp.com",
  projectId: "wandyte-book-sales",
  storageBucket: "wandyte-book-sales.firebasestorage.app",
  messagingSenderId: "901567363996",
  appId: "1:901567363996:web:d55a171298ce65a55a6659",
  measurementId: "G-NH5Z0LSMJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const ApplicationDB = getFirestore();

export { app, auth, analytics, ApplicationDB };