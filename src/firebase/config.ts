/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "@firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

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
const storage = getStorage(app);


/**
 * Deletes a file from Firebase Storage using its download URL.
 * Silently skips URLs that are not from Firebase Storage (e.g. legacy Supabase URLs).
 */
async function deleteFromFirebaseStorage(url: string): Promise<void> {
  if (!url) return;
  if (
    !url.includes('firebasestorage.googleapis.com') &&
    !url.includes('firebasestorage.app')
  ) return;

  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (err: any) {
    // Ignore "file not found" — it may have already been removed
    if (err?.code !== 'storage/object-not-found') {
      throw new Error(`Failed to delete image: ${err.message}`);
    }
  }
}

export { app, auth, analytics, ApplicationDB, storage, deleteFromFirebaseStorage };