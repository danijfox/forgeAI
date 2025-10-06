import * as admin from "firebase-admin";

// This function ensures that the Firebase Admin SDK is initialized only once.
function getFirebaseAdmin() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!admin.apps.length) {
    if (!serviceAccount) {
      // This error will be thrown if the service account key is not set in the environment.
      // During `next build`, this is expected and should not halt the process if this function is not called.
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
    }
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount as string)),
      });
    } catch (e: any) {
      console.error("Firebase admin initialization error", e.stack);
      throw new Error("Failed to initialize Firebase Admin SDK.");
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
  };
}

// We export the function itself, not the instances.
export { getFirebaseAdmin };
