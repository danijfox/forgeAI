import * as admin from "firebase-admin";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount as string)),
    });
  } catch (e: any) {
    console.error("Firebase admin initialization error", e.stack);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
