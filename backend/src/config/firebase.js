import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const isFirebaseMode = () => process.env.USE_FIREBASE === "true";
let firestoreConfigured = false;

const buildCredential = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    });
  }

  throw new Error("Firebase credentials are missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or individual FIREBASE_* values.");
};

export const initFirebase = () => {
  if (!isFirebaseMode()) {
    return null;
  }

  if (!getApps().length) {
    initializeApp({
      credential: buildCredential()
    });
  }

  const db = getFirestore();
  if (!firestoreConfigured) {
    db.settings({ preferRest: true });
    firestoreConfigured = true;
  }
  return db;
};

export const getFirebaseDb = () => {
  const db = initFirebase();

  if (!db) {
    throw new Error("Firebase mode is not enabled");
  }

  return db;
};
