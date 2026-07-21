/**
 * Firebase Admin SDK initialization.
 *
 * Reads credentials from environment variables so no service account
 * JSON file needs to be committed to source control. In test environments
 * (NODE_ENV=test) initialization is skipped/mocked by jest.
 */
const admin = require('firebase-admin');

let initialized = false;

function initializeFirebase() {
  if (initialized || admin.apps.length > 0) {
    initialized = true;
    return admin;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private keys in .env files store literal "\n" sequences; convert them
  // back to real newlines before handing them to the Firebase SDK.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  const config = {};

  if (projectId && clientEmail && privateKey) {
    config.credential = admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    });
  } else {
    // Falls back to GOOGLE_APPLICATION_CREDENTIALS or the default
    // service account when running inside Google Cloud infrastructure.
    config.credential = admin.credential.applicationDefault();
  }

  if (process.env.FIREBASE_DATABASE_URL) {
    config.databaseURL = process.env.FIREBASE_DATABASE_URL;
  }

  admin.initializeApp(config);
  initialized = true;
  return admin;
}

// In test mode, defer initialization to jest mocks (see tests/__mocks__).
if (process.env.NODE_ENV !== 'test') {
  initializeFirebase();
}

module.exports = {
  admin,
  initializeFirebase,
  get auth() {
    return admin.auth();
  },
  get firestore() {
    return admin.firestore();
  },
  get messaging() {
    return admin.messaging();
  },
};
