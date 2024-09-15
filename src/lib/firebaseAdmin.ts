// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const verifyIdToken = (token: string) => {
  return admin.auth().verifyIdToken(token);
};
const db = admin.firestore(); // Access Firestore

export { db, admin }; // Export both Firestore and the admin instance