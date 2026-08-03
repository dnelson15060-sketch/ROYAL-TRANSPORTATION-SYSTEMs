const { admin, firestore } = require('../config/firebase');
const { COLLECTIONS } = require('../config/constants');

/**
 * Creates a Firestore user document. Called after a client has already
 * registered the account with Firebase Auth (or after an admin creates
 * a Firebase Auth user server-side).
 */
async function createUserDocument({ uid, email, name, role, phone = null }) {
  const userData = {
    uid,
    email,
    name,
    role,
    phone,
    fcmToken: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await firestore.collection(COLLECTIONS.USERS).doc(uid).set(userData, { merge: true });
  return userData;
}

/**
 * Verifies a Firebase ID token and returns the decoded claims.
 */
async function verifyIdToken(token) {
  return admin.auth().verifyIdToken(token);
}

/**
 * Creates a brand-new Firebase Auth user (used by admin-driven registration
 * flows where the backend provisions the account).
 */
async function createFirebaseUser({ email, password, displayName }) {
  return admin.auth().createUser({ email, password, displayName });
}

async function getFirebaseUserByUid(uid) {
  return admin.auth().getUser(uid);
}

module.exports = {
  createUserDocument,
  verifyIdToken,
  createFirebaseUser,
  getFirebaseUserByUid,
};
